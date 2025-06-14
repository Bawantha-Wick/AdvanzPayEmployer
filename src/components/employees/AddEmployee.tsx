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
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TransactionHistory from './TransactionHistory';

export interface EmployeeFormData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  salary: string;
  accountStatus?: boolean;
  approveStatus?: boolean;
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
  onDeactivate?: (employeeId: string) => void;
  onBlock?: (employeeId: string) => void;
  mode?: 'add' | 'edit';
  employeeData?: EmployeeFormData;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ open, onClose, onSave, onDeactivate, onBlock, mode = 'add', employeeData: initialEmployeeData }) => {
  const [employeeData, setEmployeeData] = React.useState<EmployeeFormData>({
    id: '',
    name: '',
    email: '',
    mobile: '',
    salary: '',
    accountStatus: true,
    approveStatus: true,
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

  // Initialize form with employee data when in edit mode
  React.useEffect(() => {
    if (mode === 'edit' && initialEmployeeData) {
      setEmployeeData({
        ...initialEmployeeData,
        // Ensure bankDetails exists
        bankDetails: initialEmployeeData.bankDetails || {
          accountName: '',
          accountNumber: '',
          bankName: '',
          branch: ''
        }
      });
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
        bankDetails: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          branch: ''
        }
      });
    }
  }, [mode, initialEmployeeData, open]);

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setEmployeeData({
      ...employeeData,
      [field]: value
    });
  };

  const handleBankDetailsChange = (field: keyof typeof employeeData.bankDetails, value: string) => {
    setEmployeeData({
      ...employeeData,
      bankDetails: {
        ...employeeData.bankDetails,
        [field]: value
      }
    });
  };

  // Mock transaction history data
  const historyData = [
    { date: '2023/10/02', referenceNo: '789845', accountNo: '12894', status: 'Active', amount: '900 USD' },
    { date: '2023/09/15', referenceNo: '789123', accountNo: '12894', status: 'Active', amount: '850 USD' },
    { date: '2023/08/20', referenceNo: '788956', accountNo: '12894', status: 'Active', amount: '900 USD' },
    { date: '2023/07/30', referenceNo: '787112', accountNo: '12894', status: 'Active', amount: '900 USD' },
    { date: '2023/06/25', referenceNo: '786540', accountNo: '12894', status: 'Active', amount: '850 USD' }
  ];

  const handleSave = () => {
    onSave(employeeData);
    onClose();
  };

  const handleDeactivate = () => {
    if (onDeactivate && employeeData.id) {
      onDeactivate(employeeData.id);
      onClose();
    }
  };

  const handleBlock = () => {
    if (onBlock && employeeData.id) {
      onBlock(employeeData.id);
      onClose();
    }
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
            {mode === 'add' ? 'Add new employee' : 'Edit Employee'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

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
                    placeholder="Enter employee id"
                    value={employeeData.id}
                    onChange={(e) => handleChange('id', e.target.value)}
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
                    placeholder="Enter name"
                    value={employeeData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
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
                    placeholder="Enter email"
                    type="email"
                    value={employeeData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
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
                    Mobile number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter mobile number"
                    value={employeeData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
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
                    Basic salary (USD)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter salary"
                    value={employeeData.salary}
                    onChange={(e) => handleChange('salary', e.target.value)}
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
                          backgroundColor: '#ccf1ea',
                          color: '#00b79a',
                          display: 'inline-block',
                          px: 3,
                          py: 0.5,
                          borderRadius: 1,
                          minWidth: '80px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">Active</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleDeactivate}
                        sx={{
                          borderRadius: '8px',
                          height: '2.2rem',
                          color: '#e07a64',
                          borderColor: '#e07a64',
                          '&:hover': {
                            borderColor: '#d06954',
                            backgroundColor: 'rgba(224, 122, 100, 0.04)'
                          }
                        }}
                      >
                        Deactivate employee
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleBlock}
                        sx={{
                          borderRadius: '8px',
                          height: '2.2rem',
                          color: '#e07a64',
                          borderColor: '#e07a64',
                          '&:hover': {
                            borderColor: '#d06954',
                            backgroundColor: 'rgba(224, 122, 100, 0.04)'
                          }
                        }}
                      >
                        Block employee
                      </Button>
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
                    Account name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="John Doe"
                    value={employeeData.bankDetails.accountName}
                    onChange={(e) => handleBankDetailsChange('accountName', e.target.value)}
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
                    Account number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="52898656"
                    value={employeeData.bankDetails.accountNumber}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
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
                    Bank name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Westpac"
                    value={employeeData.bankDetails.bankName}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
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
                    Branch
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Sydney"
                    value={employeeData.bankDetails.branch}
                    onChange={(e) => handleBankDetailsChange('branch', e.target.value)}
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
              sx={{
                borderRadius: '8px',
                height: '3rem',
                backgroundColor: '#e07a64',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#d06954'
                }
              }}
            >
              {mode === 'add' ? 'Save employee' : 'Update employee'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
