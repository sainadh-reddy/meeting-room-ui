import React from 'react';
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { BlueChevronIcon } from '../theme';

const CustomSelect = ({ label, value, onChange, options, name, fullWidth = true, ...props }) => {
  return (
    <FormControl fullWidth={fullWidth} variant="outlined" size="small" {...props}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={onChange}
        label={label}
        name={name}
        IconComponent={BlueChevronIcon}
        sx={{
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1F3C92',
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
