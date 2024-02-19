import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const SelectedTable = ({title="Queries",
                              selectedData=[],
                              testData=[],
                              testDataPrediction=[],
                              hover}) => {

  return (
    <div style={{"marginTop":"50px"}}>
      <p>{title}</p>
      <TableContainer component={Paper} sx={{"width":"650px"}} style={{ maxHeight: 500 }}>
        <Table sx={{ maxWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>text</TableCell>
              <TableCell>label</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{"maxHeight":"200px", "overflow":"scroll"}}>
            {selectedData.map((row, i) => (
              <TableRow
                key={`row${i}`}
                sx={{ backgroundColor:i == hover ? "#efefef" : "none", '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.text}
                </TableCell>
                <TableCell align="right">{row.label}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}