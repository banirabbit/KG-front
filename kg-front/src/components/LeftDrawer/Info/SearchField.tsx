import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
interface ChildProps {
  inputValue:string;
  setInputValue: (newValue: string) => void;
}
const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#E0E3E7',
            '--TextField-brandBorderHoverColor': '#E0E3E7',
            '--TextField-brandBorderFocusedColor': '#E0E3E7',
            '& label.Mui-focused': {
              color: '#E0E3E7',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });

export default function SearchField({inputValue, setInputValue}:ChildProps) {
  const outerTheme = useTheme();

  return (
    <Box
      sx={{
            
        '& .MuiInputBase-input':{
            color: '#E0E3E7',
        },
        '& .MuiInputLabel-root':{
            color:'#E0E3E7',
        },
        
      }}
    >
      <ThemeProvider theme={customTheme(outerTheme)}>
        <TextField label="Search" variant="standard" value={inputValue} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }}/>
      </ThemeProvider>
    </Box>
  );
}