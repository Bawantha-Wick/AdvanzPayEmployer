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
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { userService } from '../../services/userService';

export interface RoleData {
  id?: string;
  name: string;
  description: string;
  isActive?: boolean;
  accessLevels: {
    dashboard: boolean;
    userManagement: boolean;
    corporateManagement: boolean;
    report: boolean;
  };
}

interface AddUserRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (roleData: RoleData) => void;
  onDisable?: (roleId: string) => void;
  mode?: 'add' | 'edit';
  roleData?: RoleData;
}

const AddUserRoleModal: React.FC<AddUserRoleModalProps> = ({ open, onClose, onSave, onDisable: _onDisable, mode = 'add', roleData }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [accessLevels, setAccessLevels] = React.useState({
    dashboard: false,
    userManagement: false,
    corporateManagement: false,
    report: false
  });
  const [isRoleActive, setIsRoleActive] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Permission mapping for API
  const permissionMapping = {
    dashboard: '1',
    userManagement: '2',
    corporateManagement: '3',
    report: '4'
  };

  // Initialize form with role data when in edit mode
  React.useEffect(() => {
    if (open) {
      setError(null);
      if (mode === 'edit' && roleData) {
        setName(roleData.name || '');
        setDescription(roleData.description || '');
        setIsRoleActive(roleData.isActive ?? true);
        setAccessLevels(
          roleData.accessLevels || {
            dashboard: false,
            userManagement: false,
            corporateManagement: false,
            report: false
          }
        );
      } else if (mode === 'add') {
        handleReset();
      }
    }
  }, [mode, roleData, open]);

  const handleAccessLevelChange = (level: keyof typeof accessLevels) => {
    setAccessLevels({
      ...accessLevels,
      [level]: !accessLevels[level]
    });
  };

  const handleSave = async () => {
    try {
      setError(null);
      setLoading(true);

      // Validate required fields
      if (!name.trim()) {
        setError('Name is required');
        return;
      }

      // Convert access levels to permission string
      const selectedPermissions = Object.entries(accessLevels)
        .filter(([, isSelected]) => isSelected)
        .map(([key]) => permissionMapping[key as keyof typeof permissionMapping])
        .join(',');

      if (mode === 'add') {
        // Call the new corp-user-role API
        const newRole = await userService.createCorpUserRole({
          name: name.trim(),
          description: description.trim(),
          permissions: selectedPermissions
        });

        // Call the original onSave callback with transformed data
        onSave({
          id: newRole.id,
          name: newRole.name,
          description: newRole.description,
          accessLevels
        });
      } else {
        // For edit mode, call the PUT API
        if (!roleData?.id) {
          setError('Role ID is required for editing');
          return;
        }

        await userService.updateCorpUserRole({
          no: parseInt(roleData.id),
          name: name.trim(),
          description: description.trim(),
          permissions: selectedPermissions,
          status: isRoleActive ? constant.status.active : constant.status.inactive
        });

        // Call the original onSave callback with updated data
        onSave({
          ...(roleData || {}),
          name,
          description,
          isActive: isRoleActive,
          accessLevels
        });
      }

      handleReset();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user role';
      const apiError = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(apiError || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = () => {
    // Toggle the local state instead of calling API immediately
    setIsRoleActive(!isRoleActive);
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setIsRoleActive(true);
    setAccessLevels({
      dashboard: false,
      userManagement: false,
      corporateManagement: false,
      report: false
    });
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          p: 6
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="medium">
            {mode === 'add' ? 'Add new user role' : 'Edit user role'}
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
          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            Name<span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            required
            fullWidth
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isRoleActive}
            margin="normal"
            sx={{
              mt: 0,
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
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

          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            Description
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isRoleActive}
            margin="normal"
            multiline
            rows={4}
            sx={{
              mt: 0,
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
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

          <Typography
            variant="subtitle1"
            fontWeight="medium"
            mb={1}
            sx={{
              color: !isRoleActive ? '#999' : 'inherit'
            }}
          >
            Access Level
          </Typography>

          <Box
            sx={{
              mb: 2,
              opacity: !isRoleActive ? 0.6 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, maxWidth: '280px' }}>
              <Typography variant="body1">Dashboard</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Checkbox
                checked={accessLevels.dashboard}
                onChange={() => handleAccessLevelChange('dashboard')}
                disabled={!isRoleActive}
                sx={{
                  padding: '2px',
                  marginLeft: '8px',
                  '&.MuiCheckbox-root': {
                    color: '#e6d1b5'
                  },
                  '& .MuiSvgIcon-root': {
                    borderRadius: '4px',
                    border: '2px solid #e6d1b5',
                    color: 'transparent'
                  },
                  '&.Mui-checked .MuiSvgIcon-root': {
                    color: '#f14c3c',
                    border: '2px solid #f14c3c',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    backgroundImage: 'none'
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, maxWidth: '280px' }}>
              <Typography variant="body1">User Management</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Checkbox
                checked={accessLevels.userManagement}
                onChange={() => handleAccessLevelChange('userManagement')}
                disabled={!isRoleActive}
                sx={{
                  padding: '2px',
                  marginLeft: '8px',
                  '&.MuiCheckbox-root': {
                    color: '#e6d1b5'
                  },
                  '& .MuiSvgIcon-root': {
                    borderRadius: '4px',
                    border: '2px solid #e6d1b5',
                    color: 'transparent'
                  },
                  '&.Mui-checked .MuiSvgIcon-root': {
                    color: '#f14c3c',
                    border: '2px solid #f14c3c',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    backgroundImage: 'none'
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, maxWidth: '280px' }}>
              <Typography variant="body1">Corporate Management</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Checkbox
                checked={accessLevels.corporateManagement}
                onChange={() => handleAccessLevelChange('corporateManagement')}
                disabled={!isRoleActive}
                sx={{
                  padding: '2px',
                  marginLeft: '8px',
                  '&.MuiCheckbox-root': {
                    color: '#e6d1b5'
                  },
                  '& .MuiSvgIcon-root': {
                    borderRadius: '4px',
                    border: '2px solid #e6d1b5',
                    color: 'transparent'
                  },
                  '&.Mui-checked .MuiSvgIcon-root': {
                    color: '#f14c3c',
                    border: '2px solid #f14c3c',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    backgroundImage: 'none'
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '280px' }}>
              <Typography variant="body1">Report</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Checkbox
                checked={accessLevels.report}
                onChange={() => handleAccessLevelChange('report')}
                disabled={!isRoleActive}
                sx={{
                  padding: '2px',
                  marginLeft: '8px',
                  '&.MuiCheckbox-root': {
                    color: '#e6d1b5'
                  },
                  '& .MuiSvgIcon-root': {
                    borderRadius: '4px',
                    border: '2px solid #e6d1b5',
                    color: 'transparent'
                  },
                  '&.Mui-checked .MuiSvgIcon-root': {
                    color: '#f14c3c',
                    border: '2px solid #f14c3c',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    backgroundImage: 'none'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Toggle role status button - only visible in edit mode */}
          {mode === 'edit' && (
            <>
              <Divider sx={{ mt: 4, mb: 2 }} />
              <Button
                variant="outlined"
                onClick={handleToggleStatus}
                sx={{
                  borderRadius: '8px',
                  borderColor: isRoleActive ? '#e6d1b5' : '#4caf50',
                  color: isRoleActive ? '#e07a64' : '#4caf50',
                  '&:hover': {
                    borderColor: isRoleActive ? '#d06954' : '#45a049',
                    backgroundColor: isRoleActive ? 'rgba(224, 122, 100, 0.04)' : 'rgba(76, 175, 80, 0.04)'
                  }
                }}
              >
                {isRoleActive ? 'Disable user role' : 'Enable user role'}
              </Button>
            </>
          )}

          <Box display="flex" justifyContent="flex-end" mt={mode === 'edit' ? 4 : 10}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                borderRadius: '8px',
                backgroundColor: '#f14c3c',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#d4372d'
                },
                '&:disabled': {
                  backgroundColor: '#ccc'
                }
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : mode === 'add' ? 'Save user role' : 'Save changes'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Default props are handled in the component parameters

export default AddUserRoleModal;
