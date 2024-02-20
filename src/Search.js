import * as React from 'react';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import SearchIcon from '@mui/icons-material/Search';

export const Search = ({title="Search", width="350px", setSearchStr}) => {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
        "& .MuiOutlinedInput-root": {"& fieldset":{"borderRadius": "25px"}}
      }}
      noValidate
      autoComplete="off"
    >
      <TextField 
        InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
        }}
        size="small"
        id="outlined-basic"
        label={title}
        variant="outlined"
        onChange={(event) => {
          setSearchStr(event.target.value);
        }}
        style={{"width":width}} />
    </Box>
  );
}