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
import { InputAdornment, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import AddUserRoleModal from './AddUserRoleModal';
import type { RoleData } from './AddUserRoleModal';

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

function createData(id: string, name: string, description: string, isActive: boolean): RoleData {
  return {
    id,
    name,
    description,
    isActive,
    accessLevels: {
      dashboard: true,
      userManagement: true,
      corporateManagement: true,
      report: false
    }
  };
}

const rows = [
  createData('R001', 'Christine Brooks', 'Description goes to here', true),
  createData('R002', 'Christine Brooks', 'Description goes to here', false),
  createData('R003', 'Christine Brooks', 'Description goes to here', true),
  createData('R004', 'Christine Brooks', 'Description goes to here', true),
  createData('R005', 'Christine Brooks', 'Description goes to here', true),
  createData('R006', 'Christine Brooks', 'Description goes to here', true)
];

const UserRoles: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(6);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openRoleModal, setOpenRoleModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [selectedRole, setSelectedRole] = React.useState<RoleData | undefined>(undefined);
  const [rolesList, setRolesList] = React.useState<RoleData[]>(rows);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
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

  const handleSaveRole = (roleData: RoleData) => {
    if (modalMode === 'add') {
      // Generate a new ID for the role
      const newRole = {
        ...roleData,
        id: `R${String(rolesList.length + 1).padStart(3, '0')}`,
        isActive: true
      };
      setRolesList([...rolesList, newRole]);
    } else {
      // Update existing role
      setRolesList(rolesList.map((role) => (role.id === roleData.id ? roleData : role)));
    }

    handleCloseRoleModal();
  };

  const handleDisableRole = (roleId: string) => {
    setRolesList(rolesList.map((role) => (role.id === roleId ? { ...role, isActive: false } : role)));
  };

  const filteredRoles = rolesList.filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()) || role.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search mail"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '250px',
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
            '&:hover': {
              backgroundColor: '#d06954'
            }
          }}
        >
          Add new user role
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
              {filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
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
                );
              })}
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
            Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredRoles.length)} of {filteredRoles.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              disabled={page === 0}
              onClick={(e) => handleChangePage(e, page - 1)}
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
              disabled={page >= Math.ceil(filteredRoles.length / rowsPerPage) - 1}
              onClick={(e) => handleChangePage(e, page + 1)}
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
