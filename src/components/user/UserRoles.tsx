import * as React from 'react';
import constant from '../../constant';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useTheme, useMediaQuery } from '@mui/material';
import { FaRegEdit } from 'react-icons/fa';
import { InputAdornment, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import AddUserRoleModal from './AddUserRole';
import type { RoleData } from './AddUserRole';
import { userService } from '../../services/userService';
import type { CorpUserRoleItem } from '../../types/api';

interface Column {
  id: 'name' | 'description' | 'roleStatus' | 'action';
  label: string;
  minWidth?: number;
  align?: 'center';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'NAME', minWidth: 170 },
  { id: 'description', label: 'DESCRIPTION', minWidth: 170 },
  { id: 'roleStatus', label: 'ROLE STATUS', minWidth: 170 },
  { id: 'action', label: 'ACTION', minWidth: 170 }
];

// Convert API response to RoleData format
const convertApiRoleToRoleData = (apiRole: CorpUserRoleItem): RoleData => {
  // Convert permissions string to access levels
  const permissions = apiRole.permissions.split(',').map((p) => p.trim());
  const accessLevels = {
    dashboard: permissions.includes('1'),
    userManagement: permissions.includes('2'),
    corporateManagement: permissions.includes('3'),
    report: permissions.includes('4')
  };

  return {
    id: apiRole.no.toString(),
    name: apiRole.name,
    description: apiRole.description,
    isActive: apiRole.status === constant.status.active,
    accessLevels
  };
};

const UserRoles: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = React.useState(1); // API uses 1-based pagination
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openRoleModal, setOpenRoleModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [selectedRole, setSelectedRole] = React.useState<RoleData | undefined>(undefined);
  const [rolesList, setRolesList] = React.useState<RoleData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pagination, setPagination] = React.useState({
    page: 1,
    total: 0,
    pages: 1
  });

  // Debounced search to avoid too many API calls
  const [searchDebounceTimer, setSearchDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);

  // Fetch roles from API
  const fetchRoles = React.useCallback(async (pageNum: number, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getCorpUserRoles({
        page: pageNum,
        search: search.trim() || undefined
      });

      const convertedRoles = response.roles.map(convertApiRoleToRoleData);
      setRolesList(convertedRoles);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user roles';
      const apiError = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(apiError || errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  React.useEffect(() => {
    fetchRoles(1, '');
  }, [fetchRoles]);

  // Handle search with debounce
  React.useEffect(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      // Reset to page 1 when searching
      setPage(1);
      fetchRoles(1, searchTerm);
    }, 500);

    setSearchDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, fetchRoles]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    const apiPage = newPage + 1; // Convert to 1-based pagination for API
    setPage(apiPage);
    fetchRoles(apiPage, searchTerm);
  };

  const handleOpenAddRoleModal = () => {
    setModalMode('add');
    setSelectedRole(undefined);
    setOpenRoleModal(true);
  };

  const handleOpenEditRoleModal = (role: RoleData) => {
    setModalMode('edit');
    setSelectedRole(role);
    setOpenRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
  };

  const handleSaveRole = async (_roleData: RoleData) => {
    // The API calls are now handled inside the AddUserRole modal
    // Just refresh the list after any save operation
    await fetchRoles(page, searchTerm);
    handleCloseRoleModal();
  };

  const handleDisableRole = async (_roleId: string) => {
    // The API call is now handled inside the AddUserRole modal
    // Just refresh the list after disable operation
    await fetchRoles(page, searchTerm);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: { xs: 2, md: 3 } }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        mb: 2,
        gap: { xs: 2, md: 0 }
      }}>
        <TextField
          placeholder="Search roles"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', md: '250px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#ffffff',
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IoMdSearch />
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="contained"
          startIcon={<IoAddCircleOutline />}
          onClick={handleOpenAddRoleModal}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#e07a64',
            fontSize: { xs: '0.875rem', md: '1rem' },
            '&:hover': {
              backgroundColor: '#d06954'
            }
          }}
        >
          Add new user role
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: { xs: '70vh', md: 'none' } }}>
          <Table stickyHeader aria-label="sticky table" size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#ffffff' } }}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : rolesList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No user roles found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rolesList.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: row.isActive ? '#ccf1ea' : '#fcd6d5',
                          color: row.isActive ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="body2">{row.isActive ? 'Active' : 'Inactive'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<FaRegEdit />}
                        onClick={() => handleOpenEditRoleModal(row)}
                        sx={{
                          color: '#e07a64',
                          borderColor: '#e07a64',
                          borderRadius: '10px',
                          padding: '6px 16px',
                          '&:hover': {
                            borderColor: '#d06954',
                            backgroundColor: 'rgba(224, 122, 100, 0.04)'
                          }
                        }}
                      >
                        View & Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            backgroundColor: '#fcf9f1',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '12px',
              color: '#888888',
              fontWeight: 400
            }}
          >
            Showing page {pagination.page} of {pagination.pages} (Total: {pagination.total} roles)
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              disabled={page === 1}
              onClick={(e) => handleChangePage(e, page - 2)} // Convert back to 0-based for handler
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                height: '32px',
                width: '32px',
                padding: 0,
                border: '1px solid #e9d9c2',
                borderRadius: '4px',
                color: '#000',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              &lt;
            </Button>
            <Button
              disabled={page >= pagination.pages}
              onClick={(e) => handleChangePage(e, page)} // Convert back to 0-based for handler
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                height: '32px',
                width: '32px',
                padding: 0,
                border: '1px solid #e9d9c2',
                borderRadius: '4px',
                color: '#000',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              &gt;
            </Button>
          </Box>
        </Box>
      </Paper>

      <AddUserRoleModal open={openRoleModal} onClose={handleCloseRoleModal} onSave={handleSaveRole} onDisable={handleDisableRole} mode={modalMode} roleData={selectedRole} />
    </Box>
  );
};

export default UserRoles;
