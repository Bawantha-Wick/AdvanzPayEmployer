import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FaRegEdit } from 'react-icons/fa';

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
  createData('AU001', 'John Smith', 'john.smith@example.com.au', 'Admin', true),
  createData('AU002', 'Sarah Johnson', 'sarah.j@company.com.au', 'Admin', true),
  createData('AU003', 'Michael Wong', 'michael.w@business.net.au', 'Admin', false),
  createData('AU004', 'Emma Taylor', 'emma.t@example.com.au', 'Admin', true),
  createData('AU005', 'David Nguyen', 'david.n@company.com.au', 'Admin', true),
  createData('AU006', 'Olivia Chen', 'olivia.c@business.net.au', 'Admin', false),
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

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2">{row.isApproved ? 'Approved' : 'Declined'}</Typography>
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
      <TablePagination component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[]} />
    </Paper>
  );
}
