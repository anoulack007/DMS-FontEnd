import { Input } from './Input';
import { TextFieldProps } from '@mui/material';
import { MenuItem } from '@mui/material';
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface InputSelectProps extends Omit<TextFieldProps, 'select'> {
  options?: Option[];
  children?: React.ReactNode;
}

const InputSelect = ({ options = [], children, ...props }: InputSelectProps) => {
  return (
    <Input
      select
      fullWidth
      size="small"
      sx={{
        '& .MuiInputBase-root': {
          height: '50px',
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiInputBase-input': {
          padding: '0 14px',
          height: '100%',
          boxSizing: 'border-box',
        },
        '& .MuiInputLabel-root': {
          lineHeight: '50px',
        },
        '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
          transform: 'translate(14px, 0) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
          transform: 'translate(14px, -18px) scale(0.75)',
        },
      }}
      {...props}
    >
      {children || 
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))
      }
    </Input>
  );
};

export default InputSelect;