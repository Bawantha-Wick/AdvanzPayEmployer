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

interface Column {
  id: 'name' | 'code' | 'email' | 'userRole' | 'isApproved' | 'action';
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

interface Data {
  code: string;
  name: string;
  email: string;
  userRole: string;
  isApproved: boolean;
}

function createData(code: string, name: string, email: string, userRole: string, isApproved: boolean): Data {
  return { code, name, email, userRole, isApproved };
}

const rows = [
  createData('AU001', 'Christine Brooks', 'brooks@gmail.com', 'Admin', true),
  createData('AU002', 'Christine Brooks', 'brooks@gmail.com', 'Admin', false),
  createData('AU003', 'Christine Brooks', 'brooks@gmail.com', 'Admin', true),
  createData('AU004', 'Christine Brooks', 'brooks@gmail.com', 'Admin', true),
  createData('AU005', 'Christine Brooks', 'brooks@gmail.com', 'Admin', true),
  createData('AU006', 'Christine Brooks', 'brooks@gmail.com', 'Admin', true),
  createData('AU007', 'James Wilson', 'james.w@example.com.au', 'Admin', true),
  createData('AU008', 'Sophie Brown', 'sophie.b@company.com.au', 'Admin', true),
  createData('AU009', 'William Lee', 'william.l@business.net.au', 'Admin', false),
  createData('AU010', 'Charlotte Davis', 'charlotte.d@example.com.au', 'Admin', true),
  createData('AU011', 'Thomas Martin', 'thomas.m@company.com.au', 'Admin', true),
  createData('AU012', 'Isabella White', 'isabella.w@business.net.au', 'Admin', true),
  createData('AU013', 'Benjamin Harris', 'benjamin.h@example.com.au', 'Admin', false),
  createData('AU014', 'Amelia Clark', 'amelia.c@company.com.au', 'Admin', true),
  createData('AU015', 'Lucas Turner', 'lucas.t@business.net.au', 'Admin', true)
];

export default function Users() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell key="name">{row.name}</TableCell>
                    <TableCell key="email">{row.email}</TableCell>
                    <TableCell key="userRole">{row.userRole}</TableCell>
                    <TableCell key="isApproved">
                      <Box
                        sx={{
                          backgroundColor: row.isApproved ? '#ccf1ea' : '#fcd6d5',
                          color: row.isApproved ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{row.isApproved ? 'Active' : 'Inactive'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell key="action">
                      <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<FaRegEdit />}
                        onClick={() => console.log(`Edit user ${row.code}`)}
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
            Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}
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
              disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
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
    </Box>
  );
}
