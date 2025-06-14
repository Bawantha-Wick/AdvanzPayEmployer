import * as React from 'react';
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

const AddUserRoleModal: React.FC<AddUserRoleModalProps> = ({ open, onClose, onSave, onDisable, mode = 'add', roleData }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [accessLevels, setAccessLevels] = React.useState({
    dashboard: false,
    userManagement: false,
    corporateManagement: false,
    report: false
  });

  // Initialize form with role data when in edit mode
  React.useEffect(() => {
    if (mode === 'edit' && roleData) {
      setName(roleData.name || '');
      setDescription(roleData.description || '');
      setAccessLevels(
        roleData.accessLevels || {
          dashboard: false,
          userManagement: false,
          corporateManagement: false,
          report: false
        }
      );
    }
  }, [mode, roleData, open]);

  const handleAccessLevelChange = (level: keyof typeof accessLevels) => {
    setAccessLevels({
      ...accessLevels,
      [level]: !accessLevels[level]
    });
  };

  const handleSave = () => {
    onSave({
      ...(roleData || {}),
      name,
      description,
      accessLevels
    });
    handleReset();
  };

  const handleDisable = () => {
    if (onDisable && roleData?.id) {
      onDisable(roleData.id);
      onClose();
    }
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setAccessLevels({
      dashboard: false,
      userManagement: false,
      corporateManagement: false,
      report: false
    });
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

          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            Access Level
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, maxWidth: '280px' }}>
              <Typography variant="body1">Dashboard</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Checkbox
                checked={accessLevels.dashboard}
                onChange={() => handleAccessLevelChange('dashboard')}
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

          {/* Disable role button - only visible in edit mode */}
          {mode === 'edit' && (
            <>
              <Divider sx={{ mt: 4, mb: 2 }} />
              <Button
                variant="outlined"
                onClick={handleDisable}
                sx={{
                  borderRadius: '8px',
                  borderColor: '#e6d1b5',
                  color: '#e07a64',
                  '&:hover': {
                    borderColor: '#d06954',
                    backgroundColor: 'rgba(224, 122, 100, 0.04)'
                  }
                }}
              >
                Disable user role
              </Button>
            </>
          )}

          <Box display="flex" justifyContent="flex-end" mt={mode === 'edit' ? 4 : 10}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                borderRadius: '8px',
                backgroundColor: '#f14c3c',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#d4372d'
                }
              }}
            >
              {mode === 'add' ? 'Save user role' : 'Save changes'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Default props are handled in the component parameters

export default AddUserRoleModal;
