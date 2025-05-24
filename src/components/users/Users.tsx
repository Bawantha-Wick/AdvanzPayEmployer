import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
  id: 'name' | 'code' | 'email' | 'userRole' | 'isApproved';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number | boolean) => string | boolean;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'NAME', minWidth: 170 },
  { id: 'email', label: 'EMAIL', minWidth: 170 },
  { id: 'userRole', label: 'USER ROLE', minWidth: 170 },
  { id: 'isApproved', label: 'APPROVE STATUS', minWidth: 170 }
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
  createData('001', 'India', 'IN', 'User', true),
  createData('001', 'China', 'CN', 'User', true),
  createData('001', 'Italy', 'IT', 'User', true),
  createData('001', 'United States', 'US', 'User', true),
  createData('001', 'Canada', 'CA', 'User', true),
  createData('001', 'Australia', 'AU', 'User', true),
  createData('001', 'Germany', 'DE', 'User', true),
  createData('001', 'Ireland', 'IE', 'User', true),
  createData('001', 'Mexico', 'MX', 'User', true),
  createData('001', 'Japan', 'JP', 'User', true),
  createData('001', 'France', 'FR', 'User', true),
  createData('001', 'United Kingdom', 'GB', 'User', true),
  createData('001', 'Russia', 'RU', 'User', true),
  createData('001', 'Nigeria', 'NG', 'User', true),
  createData('001', 'Brazil', 'BR', 'User', true)
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
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
    </Paper>
  );
}
