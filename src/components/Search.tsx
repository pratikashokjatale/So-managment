import { TextField, InputAdornment } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type SearchProps = TextFieldProps & {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Search({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  sx, 
  ...props 
}: SearchProps) {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        sx: { 
          borderRadius: '8px', 
          bgcolor: '#ffffff', 
          '& fieldset': { border: '1px solid #e0e0e0' },
          '&:hover fieldset': { border: '1px solid #bdbdbd' },
          '&.Mui-focused fieldset': { border: '1px solid #1976d2' },
          ...sx 
        }
      }}
      {...props}
    />
  );
}
