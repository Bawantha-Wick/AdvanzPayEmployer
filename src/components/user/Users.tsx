import * as React from 'react';
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
import { FaRegEdit } from 'react-icons/fa';
import { InputAdornment, TextField, CircularProgress, Alert } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useQueryClient } from '@tanstack/react-query';
import AddUser from './AddUser';
import type { UserFormData } from './AddUser';
import { useCorpUsers } from '../../hooks/useUsers';

interface Column {
  id: 'name' | 'email' | 'userRole' | 'isApproved' | 'action';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number | boolean) => string | boolean;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'NAME', minWidth: 170 },
  { id: 'email', label: 'EMAIL', minWidth: 170 },
  { id: 'userRole', label: 'USER ROLE', minWidth: 170 },
  { id: 'isApproved', label: 'APPROVE STATUS', minWidth: 170 },
  { id: 'action', label: 'ACTION', minWidth: 170 }
];

export default function Users() {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1); // API uses 1-based pagination
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const [addUserOpen, setAddUserOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = React.useState<UserFormData | undefined>(undefined);

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch corporate users data
  const {
    data: corpUsersData,
    isLoading,
    error
  } = useCorpUsers({
    page,
    search: debouncedSearchTerm
  });

  const users = corpUsersData?.data?.users || [];
  const pagination = corpUsersData?.data?.pagination || { page: '1', total: 0, pages: 1 };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1); // Convert 0-based to 1-based
  };

  const handleAddUser = () => {
    setEditMode('add');
    setSelectedUser(undefined);
    setAddUserOpen(true);
  };

  const handleEditUser = (userNo: number) => {
    // Find user by no and convert to UserFormData
    const user = users.find((u) => u.no === userNo);
    if (user) {
      const userFormData: UserFormData = {
        id: user.no.toString(),
        name: user.name,
        email: user.email,
        password: '', // Don't prefill password
        title: user.title,
        mobile: user.mobile,
        userRole: user.role.toString(), // Use role ID instead of roleLabel
        isActive: user.status === 'ACTV'
      };
      setSelectedUser(userFormData);
      setEditMode('edit');
      setAddUserOpen(true);
    }
  };

  const handleSaveUser = (_userData: UserFormData) => {
    // Close the modal
    setAddUserOpen(false);

    // Invalidate and refetch the corp-users query to update the table
    // This will invalidate all queries that start with ['corp-users']
    queryClient.invalidateQueries({
      queryKey: ['corp-users']
    });
  };

  // Handle search with debouncing
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (error) {
    return (
      <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: 3 }}>
        <Alert severity="error">Error loading users: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search mail"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: '250px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#ffffff'
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
          onClick={handleAddUser}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#e07a64',
            '&:hover': {
              backgroundColor: '#d06954'
            }
          }}
        >
          Add new user
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', borderRadius: 2 }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography>No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user.no} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell key="name">{user.name}</TableCell>
                    <TableCell key="email">{user.email}</TableCell>
                    <TableCell key="userRole">{user.roleLabel}</TableCell>
                    <TableCell key="isApproved">
                      <Box
                        sx={{
                          backgroundColor: user.status === 'ACTV' ? '#ccf1ea' : '#fcd6d5',
                          color: user.status === 'ACTV' ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{user.statusLabel}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell key="action">
                      <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<FaRegEdit />}
                        onClick={() => handleEditUser(user.no)}
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
            Showing {users.length > 0 ? 1 : 0}-{users.length} of {pagination.total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              disabled={page <= 1}
              onClick={(e) => handleChangePage(e, page - 2)} // Convert back to 0-based
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
              onClick={(e) => handleChangePage(e, page)} // Convert back to 0-based
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

      {/* Add User Modal */}
      <AddUser open={addUserOpen} onClose={() => setAddUserOpen(false)} onSave={handleSaveUser} mode={editMode} userData={selectedUser} />
    </Box>
  );
}
