import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TableSortLabel
} from '@mui/material';
import Pagination from './Pagination';

export interface Column<T> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
  width?: string | number;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (event: any, newPage: number) => void;
  onRowsPerPageChange?: (event: any) => void;
  emptyMessage?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
}

export default function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  totalCount = 0,
  page = 1,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage = "No records found.",
  sortBy,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress size={40} sx={{ color: '#0047b3' }} />
        </Box>
      ) : (
        <TableContainer 
          sx={{ 
            overflowX: 'auto', 
            border: '1px solid #f1f5f9', 
            borderRadius: '16px',
            bgcolor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            }
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align || 'left'}
                    sx={{ 
                      color: '#64748b', 
                      fontWeight: 700, 
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: 2,
                      width: col.width
                    }}
                  >
                    {col.sortable && onSort ? (
                      <TableSortLabel
                        active={sortBy === col.id}
                        direction={sortBy === col.id ? sortOrder : 'asc'}
                        onClick={() => onSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" color="text.secondary" fontWeight={600}>
                        {emptyMessage}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow 
                    key={row.id || index} 
                    hover 
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.2s ease',
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align || 'left'} sx={{ py: 1.5 }}>
                        {col.render ? col.render(row) : (row as any)[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && data.length > 0 && onPageChange && onRowsPerPageChange && (
        <Box sx={{ mt: 3 }}>
          <Pagination
            page={page}
            totalResults={totalCount}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>
      )}
    </Box>
  );
}
