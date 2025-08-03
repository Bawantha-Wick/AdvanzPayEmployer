import * as React from 'react';
import constant from '../../constant';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { userService } from '../../services/userService';
import type { CorpUserRoleDropdownItem } from '../../types/api';

export interface UserFormData {
  id?: string;
  name: string;
  email: string;
  password: string;
  title: string;
  mobile: string;
  userRole: string;
  isActive?: boolean;
}

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  mode?: 'add' | 'edit';
  userData?: UserFormData;
}

const AddUser: React.FC<AddUserProps> = ({ open, onClose, onSave, mode = 'add', userData: initialUserData }) => {
  const [userData, setUserData] = React.useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    title: '',
    mobile: '',
    userRole: '',
    isActive: true
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [userRoles, setUserRoles] = React.useState<CorpUserRoleDropdownItem[]>([]);
  const [loadingRoles, setLoadingRoles] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch user roles for dropdown
  React.useEffect(() => {
    const fetchUserRoles = async () => {
      if (open) {
        setLoadingRoles(true);
        setError(null);
        try {
          const response = await userService.getCorpUserRolesDropdown();
          setUserRoles(response.data.roles);
        } catch (error) {
          console.error('Failed to fetch user roles:', error);
          setUserRoles([]);
          setError('Failed to load user roles');
        } finally {
          setLoadingRoles(false);
        }
      }
    };

    fetchUserRoles();
  }, [open]);

  // Initialize form with user data when in edit mode
  React.useEffect(() => {
    if (open) {
      setError(null);
      if (mode === 'edit' && initialUserData) {
        setUserData({
          ...initialUserData,
          password: '' // Don't prefill password in edit mode
        });
      } else if (mode === 'add') {
        // Reset form for add mode
        setUserData({
          name: '',
          email: '',
          password: '',
          title: '',
          mobile: '',
          userRole: '',
          isActive: true
        });
      }
    }
  }, [mode, initialUserData, open]);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setUserData({
      ...userData,
      [field]: value
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setLoading(true);

      // Validate required fields
      if (!userData.name.trim()) {
        setError('Name is required');
        return;
      }
      if (!userData.email.trim()) {
        setError('Email is required');
        return;
      }
      if (!userData.mobile.trim()) {
        setError('Mobile is required');
        return;
      }
      if (!userData.userRole) {
        setError('User role is required');
        return;
      }

      if (mode === 'add') {
        if (!userData.password.trim()) {
          setError('Password is required');
          return;
        }

        // Call the create corp user API
        await userService.createCorpUser({
          name: userData.name.trim(),
          email: userData.email.trim(),
          password: userData.password,
          title: userData.title.trim(),
          mobile: userData.mobile.trim(),
          role: parseInt(userData.userRole)
        });
      } else {
        // For edit mode, call the update API
        if (!userData.id) {
          setError('User ID is required for editing');
          return;
        }

        const updateData: {
          no: number;
          name: string;
          email: string;
          title: string;
          mobile: string;
          role: number;
          status: string;
          password?: string;
        } = {
          no: parseInt(userData.id),
          name: userData.name.trim(),
          email: userData.email.trim(),
          title: userData.title.trim(),
          mobile: userData.mobile.trim(),
          role: parseInt(userData.userRole),
          status: userData.isActive ? constant.status.active : constant.status.inactive
        };

        // Only include password if it's provided
        if (userData.password.trim()) {
          updateData.password = userData.password;
        }

        await userService.updateCorpUser(updateData);
      }

      // Call the original onSave callback
      onSave(userData);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user';
      const apiError = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(apiError || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = () => {
    // Toggle the local state instead of calling API immediately
    setUserData({
      ...userData,
      isActive: !userData.isActive
    });
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
            {mode === 'add' ? 'Add new user' : 'Edit User'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* First row */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Name<span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                required
                fullWidth
                placeholder="Enter full name"
                value={userData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!userData.isActive}
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Email<span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                required
                fullWidth
                placeholder="Enter email address"
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!userData.isActive}
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Password<span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                required
                fullWidth
                placeholder={mode === 'edit' ? 'Enter new password (leave empty to keep current)' : 'Enter password'}
                type={showPassword ? 'text' : 'password'}
                value={userData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                disabled={!userData.isActive}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Title
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter job title"
                value={userData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                disabled={!userData.isActive}
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Mobile<span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                required
                fullWidth
                placeholder="Enter mobile number"
                value={userData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                disabled={!userData.isActive}
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                User Role<span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  required
                  value={userData.userRole}
                  onChange={(e) => handleChange('userRole', e.target.value)}
                  displayEmpty
                  disabled={loadingRoles || !userData.isActive}
                  sx={{
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
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>{loadingRoles ? 'Loading roles...' : 'Select user role'}</em>
                  </MenuItem>
                  {loadingRoles ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                      <Typography sx={{ ml: 1 }}>Loading...</Typography>
                    </MenuItem>
                  ) : (
                    userRoles.map((role) => (
                      <MenuItem key={role.no} value={role.no.toString()}>
                        {role.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {mode === 'edit' && (
              <>
                <Divider sx={{ mt: 4, mb: 2 }} />
                <Grid size={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium" mr={1}>
                      Account status :
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: userData.isActive ? '#ccf1ea' : '#fcd6d5',
                        color: userData.isActive ? '#00b79a' : '#ee3827',
                        display: 'inline-block',
                        px: 3,
                        py: 0.5,
                        borderRadius: 1,
                        minWidth: '80px',
                        textAlign: 'center'
                      }}
                    >
                      {userData.isActive ? 'Active' : 'Inactive'}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleToggleStatus}
                      sx={{
                        borderRadius: '8px',
                        height: '2.2rem',
                        borderColor: userData.isActive ? '#e6d1b5' : '#4caf50',
                        color: userData.isActive ? '#e07a64' : '#4caf50',
                        '&:hover': {
                          borderColor: userData.isActive ? '#d06954' : '#45a049',
                          backgroundColor: userData.isActive ? 'rgba(224, 122, 100, 0.04)' : 'rgba(76, 175, 80, 0.04)'
                        }
                      }}
                    >
                      {userData.isActive ? 'Disable user' : 'Enable user'}
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={mode === 'edit' ? 4 : 4}>
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
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : mode === 'add' ? 'Save user' : 'Update user'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
