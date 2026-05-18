import {
  Box,
  Typography,
  Pagination as MuiPagination,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface CustomPaginationProps {
  page: number;
  totalResults: number;
  rowsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onRowsPerPageChange?: (event: SelectChangeEvent<number>) => void;
  rowsPerPageOptions?: number[];
}

export default function Pagination({
  page,
  totalResults,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 15],
}: CustomPaginationProps) {
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.5,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Left aligned: Rows per page dropdown with options [5, 10, 15] */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight="700"
          sx={{ fontSize: "0.85rem" }}
        >
          Rows per page:
        </Typography>
        <Select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          size="small"
          variant="standard"
          sx={{
            fontSize: "0.85rem",
            fontWeight: "800",
            color: "#002855",
            "& .MuiSelect-select": { py: 0.5, pr: "20px !important" },
            "&:before, &:after": { display: "none" },
            bgcolor: "transparent",
          }}
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Right aligned: Numeric page and arrow buttons */}
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        color="primary"
        shape="rounded"
        size="small"
        siblingCount={0}
        boundaryCount={0}
        sx={{
          '& .MuiPaginationItem-ellipsis': {
            display: 'none'
          },
          "& .MuiPaginationItem-root": {
            fontWeight: 800,
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            "&.Mui-selected": {
              bgcolor: "#002855",
              color: "white",
              borderColor: "#002855",
              "&:hover": {
                bgcolor: "#001f40",
              },
            },
            "&:hover": {
              bgcolor: "#f1f5f9",
            },
          },
        }}
      />
    </Box>
  );
}
