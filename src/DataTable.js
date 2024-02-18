// Adapted from https://mui.com/material-ui/react-table/

import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import { visuallyHidden } from '@mui/utils';

import { HistogramVis } from "./HistogramVis.js";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead({variables=[], data=[], dataTypes={}, currentFilters, handleFilter, onRequestSort, order, orderBy, rowCount}) {

  function createSortHandler(property) {
    return (e) => {onRequestSort(e, property)}
  }

  return (
    <TableHead>
      <TableRow>
        {variables.map((v) => (
          <TableCell
            key={v}
            padding='normal'
            sortDirection={orderBy === v.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === v}
              direction={orderBy === v ? order : 'asc'}
              onClick={createSortHandler(v)}
            >
              <p style={{"margin":"0 0 0 5px"}}>{v}<span style={{"margin":"0 0 0 10px", "color":"gray"}}><i>{`- ${dataTypes[v].type == "string" ? "string (length)" : dataTypes[v].type}`}</i></span></p>
              {orderBy === v ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
            <HistogramVis data={data} dataTypes={dataTypes} variable={v} currentFilters={currentFilters} handleFilter={handleFilter} />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export const DataTable = ({data=[], filteredData=[], dataTypes={}, variables=[], currentFilters, handleFilter}) => {

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  function handleRequestSort(e, property) {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredData.length == 0 ? data : filteredData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, data, filteredData],
  );

  React.useEffect(() => {
    setPage(0)
  }, [filteredData])

  return (
    <Box>
      <Paper sx={{ mb: 2 }}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size='small'>
            <EnhancedTableHead
              data={data}
              dataTypes={dataTypes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              variables={variables}
              currentFilters={currentFilters}
              handleFilter={handleFilter}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}>
                    {variables.map((v, i) => <TableCell>{row[v]}</TableCell>)}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={filteredData.length == 0 ? data.length : filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}