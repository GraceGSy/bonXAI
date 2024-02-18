import * as React from 'react';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import SearchIcon from '@mui/icons-material/Search';

export const Search = ({setSearchStr}) => {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
        "& .MuiOutlinedInput-root": {"& fieldset":{"border-radius": "25px"}}
      }}
      noValidate
      autoComplete="off"
    >
      <TextField 
        InputProps={{
            startAdornment: <InputAdornment position="start"><IconButton><SearchIcon /></IconButton></InputAdornment>,
        }}
        size="small"
        id="outlined-basic"
        label="Search"
        variant="outlined"
        onChange={(event, newValue) => {
          setSearchStr(event.target.value);
        }}
        style={{"width":"350px"}} />
    </Box>
  );
}