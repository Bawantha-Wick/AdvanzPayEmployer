import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TransactionHistory from './TransactionHistory';
import { employeeService } from '../../services/employeeService';
import type { CreateCorpEmployeeData, UpdateCorpEmployeeData } from '../../types/api';

export interface EmployeeFormData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  salary: string;
  accountStatus?: boolean;
  approveStatus?: boolean;
  status?: 'ACTV' | 'INAC' | 'BLCK';
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branch: string;
  };
}

interface AddEmployeeProps {
  open: boolean;
  onClose: () => void;
  onSave: (employeeData: EmployeeFormData) => void;
  mode?: 'add' | 'edit';
  employeeData?: EmployeeFormData;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ open, onClose, onSave, mode = 'add', employeeData: initialEmployeeData }) => {
  const [employeeData, setEmployeeData] = React.useState<EmployeeFormData>({
    id: '',
    name: '',
    email: '',
    mobile: '',
    salary: '',
    accountStatus: true,
    approveStatus: true,
    status: 'ACTV',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: ''
    }
  });
  const [showHistory, setShowHistory] = React.useState<boolean>(false);
  const [detailsExpanded, setDetailsExpanded] = React.useState<boolean>(true);
  const [historyExpanded, setHistoryExpanded] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [isFormDisabled, setIsFormDisabled] = React.useState<boolean>(false);

  // Initialize form with employee data when in edit mode
  React.useEffect(() => {
    setError(''); // Clear error when dialog opens

    if (mode === 'edit' && initialEmployeeData) {
      setEmployeeData({
        ...initialEmployeeData,
        // Ensure bankDetails exists
        bankDetails: initialEmployeeData.bankDetails || {
          accountName: '',
          accountNumber: '',
          bankName: '',
          branch: ''
        },
        // Set default status if not provided
        status: initialEmployeeData.status || 'ACTV'
      });
      // Set form disabled state based on status
      setIsFormDisabled(initialEmployeeData.status === 'INAC');
    } else if (mode === 'add') {
      // Reset form for add mode
      setEmployeeData({
        id: '',
        name: '',
        email: '',
        mobile: '',
        salary: '',
        accountStatus: true,
        approveStatus: true,
        status: 'ACTV',
        bankDetails: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          branch: ''
        }
      });
      setIsFormDisabled(false);
    }
  }, [mode, initialEmployeeData, open]);

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setEmployeeData({
      ...employeeData,
      [field]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleBankDetailsChange = (field: keyof typeof employeeData.bankDetails, value: string) => {
    setEmployeeData({
      ...employeeData,
      bankDetails: {
        ...employeeData.bankDetails,
        [field]: value
      }
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Mock transaction history data
  const historyData = [
    { date: '2023/10/02', referenceNo: '789845', accountNo: '12894', status: 'Active', amount: '900 USD' },
    { date: '2023/09/15', referenceNo: '789123', accountNo: '12894', status: 'Active', amount: '850 USD' },
    { date: '2023/08/20', referenceNo: '788956', accountNo: '12894', status: 'Active', amount: '900 USD' },
    { date: '2023/07/30', referenceNo: '787112', accountNo: '12894', status: 'Active', amount: '900 USD' },
    { date: '2023/06/25', referenceNo: '786540', accountNo: '12894', status: 'Active', amount: '850 USD' }
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // Basic validation
      if (!employeeData.name || !employeeData.email || !employeeData.mobile || !employeeData.salary) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!employeeData.bankDetails.accountName || !employeeData.bankDetails.accountNumber || !employeeData.bankDetails.bankName || !employeeData.bankDetails.branch) {
        setError('Please fill in all bank details');
        setLoading(false);
        return;
      }

      if (mode === 'add') {
        // Map form data to API format for creation
        const apiData: CreateCorpEmployeeData = {
          name: employeeData.name,
          email: employeeData.email,
          mobile: employeeData.mobile,
          basicSalAmt: parseFloat(employeeData.salary) || 0,
          accNo: employeeData.bankDetails.accountNumber,
          accName: employeeData.bankDetails.accountName,
          accBank: employeeData.bankDetails.bankName,
          accBranch: employeeData.bankDetails.branch
        };

        await employeeService.createCorpEmployee(apiData);
      } else {
        // Map form data to API format for update
        const updateData: UpdateCorpEmployeeData = {
          no: parseInt(employeeData.id) || 0,
          name: employeeData.name,
          email: employeeData.email,
          mobile: employeeData.mobile,
          basicSalAmt: parseFloat(employeeData.salary) || 0,
          accNo: employeeData.bankDetails.accountNumber,
          accName: employeeData.bankDetails.accountName,
          accBank: employeeData.bankDetails.bankName,
          accBranch: employeeData.bankDetails.branch,
          status: employeeData.status || 'ACTV'
        };

        await employeeService.updateCorpEmployee(updateData);
      }

      onSave(employeeData);
      onClose();
    } catch (err: unknown) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} employee:`, err);
      const errorMessage = err instanceof Error ? err.message : `Failed to ${mode === 'add' ? 'create' : 'update'} employee. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = () => {
    // Set status to inactive and disable form fields
    setEmployeeData({
      ...employeeData,
      status: 'INAC',
      accountStatus: false
    });
    setIsFormDisabled(true);
  };

  // const handleBlock = () => {
  //   if (employeeData.status === 'BLCK') {
  //     // If currently blocked, unblock (set to active)
  //     setEmployeeData({
  //       ...employeeData,
  //       status: 'ACTV',
  //       accountStatus: true
  //     });
  //   } else {
  //     // Set status to blocked but keep form fields enabled
  //     setEmployeeData({
  //       ...employeeData,
  //       status: 'BLCK',
  //       accountStatus: false
  //     });
  //   }
  //   // Don't disable form fields for blocked status
  // };

  const handleReactivate = () => {
    // Set status back to active and enable form fields
    setEmployeeData({
      ...employeeData,
      status: 'ACTV',
      accountStatus: true
    });
    setIsFormDisabled(false);
  };

  const toggleHistory = () => {
    if (showHistory) {
      // If showing history, collapse history first, then expand details
      setHistoryExpanded(false);
      setTimeout(() => {
        setShowHistory(false);
        setDetailsExpanded(true);
      }, 300);
    } else {
      // If showing details, collapse details first, then expand history
      setDetailsExpanded(false);
      setTimeout(() => {
        setShowHistory(true);
        setHistoryExpanded(true);
      }, 300);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          p: 3
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="medium">
            {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DialogContent sx={{ p: 0, minHeight: '65vh', position: 'relative' }}>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Collapse in={detailsExpanded} timeout={300}>
            <Box>
              <Grid container spacing={2}>
                {/* First row */}
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Employee ID
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="1001"
                    value={employeeData.id}
                    onChange={(e) => handleChange('id', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="John Doe"
                    value={employeeData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>

                {/* Second row */}
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="john@abc.com"
                    type="email"
                    value={employeeData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>
                {/* Third row */}
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Mobile Number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="+16102441494"
                    value={employeeData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Basic Salary (USD)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="5000"
                    value={employeeData.salary}
                    onChange={(e) => handleChange('salary', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>

                {mode === 'edit' && (
                  <Grid /*xs={12} md={6}*/ size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium" mr={1}>
                        Account status :
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: employeeData.status === 'ACTV' ? '#ccf1ea' : employeeData.status === 'INAC' ? '#f5f5f5' : '#ffe6e6',
                          color: employeeData.status === 'ACTV' ? '#00b79a' : employeeData.status === 'INAC' ? '#666' : '#d32f2f',
                          display: 'inline-block',
                          px: 3,
                          py: 0.5,
                          borderRadius: 1,
                          minWidth: '80px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{employeeData.status === 'ACTV' ? 'Active' : employeeData.status === 'INAC' ? 'Inactive' : 'Blocked'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={employeeData.status === 'INAC' ? handleReactivate : handleDeactivate}
                        sx={{
                          borderRadius: '8px',
                          height: '2.2rem',
                          color: employeeData.status === 'INAC' ? '#00b79a' : '#e07a64',
                          borderColor: employeeData.status === 'INAC' ? '#00b79a' : '#e07a64',
                          '&:hover': {
                            borderColor: employeeData.status === 'INAC' ? '#009985' : '#d06954',
                            backgroundColor: employeeData.status === 'INAC' ? 'rgba(0, 183, 154, 0.04)' : 'rgba(224, 122, 100, 0.04)'
                          }
                        }}
                      >
                        {employeeData.status === 'INAC' ? 'Reactivate employee' : 'Deactivate employee'}
                      </Button>
                      {/* <Button
                        variant="outlined"
                        onClick={handleBlock}
                        sx={{
                          borderRadius: '8px',
                          height: '2.2rem',
                          color: employeeData.status === 'BLCK' ? '#00b79a' : '#e07a64',
                          borderColor: employeeData.status === 'BLCK' ? '#00b79a' : '#e07a64',
                          '&:hover': {
                            borderColor: employeeData.status === 'BLCK' ? '#009985' : '#d06954',
                            backgroundColor: employeeData.status === 'BLCK' ? 'rgba(0, 183, 154, 0.04)' : 'rgba(224, 122, 100, 0.04)'
                          }
                        }}
                      >
                        {employeeData.status === 'BLCK' ? 'Unblock employee' : 'Block employee'}
                      </Button> */}
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Bank Details Section */}
              <Typography variant="subtitle1" fontWeight="medium" mt={4} mb={2}>
                Bank Details
              </Typography>

              <Grid container spacing={3}>
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Account Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="John Doe"
                    value={employeeData.bankDetails.accountName}
                    onChange={(e) => handleBankDetailsChange('accountName', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Account Number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="1234567890123456"
                    value={employeeData.bankDetails.accountNumber}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid /*xs={12} md={6}*/ size={6}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Bank Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Bank of America"
                    value={employeeData.bankDetails.bankName}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid /*xs={12} md={6}*/ size={6}>
                  {/* <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Branch
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Sydney"
                    value={employeeData.bankDetails.branch}
                    onChange={(e) => handleBankDetailsChange('branch', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '3rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e6d1b5'
                        }
                      }
                    }}
                  /> */}
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          {/* History section for edit mode */}
          {mode === 'edit' && (
            <Box mt={showHistory ? 0 : 3}>
              <Box
                onClick={toggleHistory}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  backgroundColor: showHistory ? '#f8efe7' : 'transparent',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  height: '3rem',
                  width: 'fit-content',
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#f8efe7'
                  }
                }}
              >
                <IconButton size="small" sx={{ mr: 1 }}>
                  {showHistory ? <ArrowBackIcon fontSize="small" color="action" /> : <HistoryIcon fontSize="small" color="action" />}
                </IconButton>
                <Typography variant="subtitle1" fontWeight="medium">
                  {showHistory ? 'Back to Employee Details' : 'Transaction History'}
                </Typography>
              </Box>

              <Collapse in={historyExpanded} timeout={300}>
                <Box
                  sx={{
                    opacity: 1,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <TransactionHistory data={historyData} />
                </Box>
              </Collapse>
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                borderRadius: '8px',
                height: '3rem',
                backgroundColor: '#e07a64',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#d06954'
                },
                '&:disabled': {
                  backgroundColor: '#ccc'
                }
              }}
            >
              {loading ? 'Saving...' : mode === 'add' ? 'Save employee' : 'Update employee'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
