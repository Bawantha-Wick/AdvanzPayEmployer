import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { MdFileUpload, MdCloudUpload, MdErrorOutline, MdCheckCircle } from 'react-icons/md';
import { HiDocumentText } from 'react-icons/hi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { employeeService } from '../../services/employeeService';
import ExcelPreview, { type ExcelEmployeeData } from './ExcelPreview';

interface ExcelUploadProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = React.useState<'upload' | 'preview'>('upload');
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [parsedData, setParsedData] = React.useState<ExcelEmployeeData[]>([]);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setStep('upload');
      setUploadedFile(null);
      setParsedData([]);
      setError('');
      setLoading(false);
      setSuccess(false);
      setUploadProgress(0);
    }
  }, [open]);

  const parseExcelFile = React.useCallback((file: File): Promise<ExcelEmployeeData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Assuming the first row contains headers
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as unknown[][];

          // Define expected headers in exact order
          const expectedHeaders = ['Employee ID', 'Name', 'Email', 'Mobile Number', 'Basic Salary', 'Account Name', 'Account Number', 'Bank Name', 'Branch'];

          // Validate that we have exactly the expected number of headers
          if (headers.length !== expectedHeaders.length) {
            throw new Error(`Excel file must have exactly ${expectedHeaders.length} columns. Found ${headers.length} columns.`);
          }

          // Map headers to expected field names (exact match, case-insensitive)
          const headerMap: { [key: string]: keyof Omit<ExcelEmployeeData, 'rowIndex'> } = {};
          const fieldMapping = ['id', 'name', 'email', 'mobile', 'salary', 'accountName', 'accountNumber', 'bankName', 'branch'] as const;

          // Validate headers match expected format
          headers.forEach((header, index) => {
            const actualHeader = header?.toString().trim();
            const expectedHeader = expectedHeaders[index];

            // Case-insensitive comparison
            if (actualHeader.toLowerCase() !== expectedHeader.toLowerCase()) {
              throw new Error(`Column ${index + 1} should be "${expectedHeader}" but found "${actualHeader}"`);
            }

            headerMap[index] = fieldMapping[index];
          });

          // Parse rows into employee data
          const employees: ExcelEmployeeData[] = rows
            .map((row, rowIndex) => {
              const employee: ExcelEmployeeData = {
                id: '',
                name: '',
                email: '',
                mobile: '',
                salary: '',
                accountName: '',
                accountNumber: '',
                bankName: '',
                branch: '',
                rowIndex: rowIndex + 2 // +2 because we removed header and array is 0-indexed
              };

              // Map data from row to employee object
              Object.entries(headerMap).forEach(([columnIndex, fieldName]) => {
                const value = row[parseInt(columnIndex)];
                if (value !== undefined && value !== null) {
                  employee[fieldName] = value.toString().trim();
                }
              });

              return employee;
            })
            .filter(
              (employee) =>
                // Filter out empty rows
                employee.name || employee.email || employee.mobile
            );

          resolve(employees);
        } catch {
          reject(new Error('Failed to parse Excel file. Please check the file format.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file.'));
      };

      reader.readAsBinaryString(file);
    });
  }, []);

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      setError('');

      try {
        // Validate file type
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
          throw new Error('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File size should be less than 10MB');
        }

        setUploadedFile(file);

        // Parse the Excel file
        const employees = await parseExcelFile(file);

        if (employees.length === 0) {
          throw new Error('No valid employee data found in the file. Please check the file format and try again.');
        }

        setParsedData(employees);
        setStep('preview');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setUploadedFile(null);
      } finally {
        setLoading(false);
      }
    },
    [parseExcelFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled: loading || success
  });

  const handleBackToUpload = () => {
    setStep('upload');
    setUploadedFile(null);
    setParsedData([]);
    setError('');
  };

  const handleSubmitData = async (finalData: ExcelEmployeeData[], onError: (error: string) => void) => {
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Convert the data to the format expected by the API
      const employeeDataForAPI = finalData.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        mobile: emp.mobile,
        basicSalAmt: parseFloat(emp.salary) || 0,
        accNo: emp.accountNumber,
        accName: emp.accountName,
        accBank: emp.bankName,
        accBranch: emp.branch
      }));

      // Upload data to backend
      await employeeService.uploadEmployeeData(employeeDataForAPI);

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success state
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);

        // Auto-close and return to main page after 2 seconds
        setTimeout(() => {
          onSuccess(); // This will refresh the employee list and close the modal
        }, 2000);
      }, 500);
    } catch (error) {
      clearInterval(200);
      setLoading(false);
      setUploadProgress(0);
      // Pass error to preview component instead of showing it here
      onError(error instanceof Error ? error.message : 'Failed to upload data. Please try again.');
    }
  };

  const handleClose = () => {
    if (!loading) {
      if (success) {
        onSuccess();
      }
      onClose();
    }
  };

  const handleNewUpload = () => {
    setUploadedFile(null);
    setError('');
    setLoading(false);
    setSuccess(false);
    setUploadProgress(0);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          p: 3,
          minHeight: '400px',
          minWidth: '90%'
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="medium">
            {step === 'upload' ? 'Upload Excel File' : 'Preview & Edit Employee Data'}
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {step === 'upload' ? (
          // Upload Step
          <Box>
            {success ? (
              // Success State
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <MdCheckCircle size={64} color="#00b79a" style={{ marginBottom: '16px' }} />
                <Typography variant="h6" sx={{ mb: 2, color: '#00b79a', fontWeight: 500 }}>
                  Data Uploaded Successfully!
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
                  Your employee data has been processed and imported.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handleNewUpload}
                    sx={{
                      borderRadius: '8px',
                      color: '#e07a64',
                      borderColor: '#e07a64',
                      '&:hover': {
                        borderColor: '#d06954',
                        backgroundColor: 'rgba(224, 122, 100, 0.04)'
                      }
                    }}
                  >
                    Upload Another File
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      onSuccess(); // This will refresh the employee list and close the modal
                    }}
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: '#e07a64',
                      '&:hover': {
                        backgroundColor: '#d06954'
                      }
                    }}
                  >
                    Done
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }} icon={<MdErrorOutline />}>
                    {error}
                  </Alert>
                )}

                {/* File Format Instructions */}
                <Box sx={{ mb: 4, p: 3, backgroundColor: '#f8efe7', borderRadius: 2, border: '1px solid #e6d1b5' }}>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, color: '#e07a64' }}>
                    Excel File Format Requirements
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Please ensure your Excel file contains exactly the following columns in this order:
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      1. Employee ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      2. Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      3. Email
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      4. Mobile Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      5. Basic Salary
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      6. Account Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      7. Account Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      8. Bank Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      9. Branch
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#d32f2f', fontStyle: 'italic', fontWeight: 500 }}>
                    * The file must have exactly these 9 columns in the specified order. Column names must match exactly (case-insensitive).
                  </Typography>
                </Box>

                {/* Upload Area */}
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? '#e07a64' : '#e6d1b5',
                    borderRadius: 3,
                    p: 6,
                    textAlign: 'center',
                    backgroundColor: isDragActive ? 'rgba(224, 122, 100, 0.04)' : '#fcf9f1',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: loading ? '#e6d1b5' : '#e07a64',
                      backgroundColor: loading ? '#fcf9f1' : 'rgba(224, 122, 100, 0.04)'
                    }
                  }}
                >
                  <input {...getInputProps()} />

                  <Box sx={{ mb: 3 }}>{loading ? <MdCloudUpload size={48} color="#ccc" /> : <MdFileUpload size={48} color="#e07a64" />}</Box>

                  {loading ? (
                    <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                      Uploading file...
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                        {isDragActive ? 'Drop your Excel file here' : 'Drag & drop your Excel file here'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                        or click to browse files
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Supported formats: .xlsx, .xls, .csv (Max size: 10MB)
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Loading Progress */}
                {loading && (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#e07a64',
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, color: '#666' }}>
                      {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Processing...'}
                    </Typography>
                  </Box>
                )}

                {/* Selected File Display */}
                {uploadedFile && !loading && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <HiDocumentText size={24} color="#e07a64" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {uploadedFile.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <IoCheckmarkCircle size={24} color="#00b79a" />
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ) : (
          // Preview Step
          <ExcelPreview data={parsedData} fileName={uploadedFile?.name || 'Unknown'} onBack={handleBackToUpload} onSubmit={handleSubmitData} isSubmitting={loading} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExcelUpload;
