import { Box, Typography, Pagination as MuiPagination, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface CustomPaginationProps {
  page: number;
  totalResults: number;
  rowsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
  rowsPerPageOptions?: number[];
}

export default function Pagination({
  page,
  totalResults,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50]
}: CustomPaginationProps) {
  const totalPages = Math.ceil(totalResults / rowsPerPage);
  const startResult = (page - 1) * rowsPerPage + 1;
  const endResult = Math.min(page * rowsPerPage, totalResults);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Showing {totalResults === 0 ? 0 : startResult} to {endResult} of {totalResults} results
      </Typography>

      <MuiPagination 
        count={totalPages} 
        page={page} 
        onChange={onPageChange} 
        color="primary"
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 500,
          }
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          size="small"
          sx={{ 
            height: 32, 
            fontSize: '0.875rem',
            '& fieldset': { border: 'none' },
            bgcolor: 'transparent'
          }}
          IconComponent={() => <Box component="span" sx={{ px: 1, fontSize: '0.75rem', color: 'text.secondary' }}>▼</Box>}
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option} / page
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
}
