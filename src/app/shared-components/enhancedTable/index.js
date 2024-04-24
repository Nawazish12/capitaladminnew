import PropTypes from "prop-types";
import { usePagination, useSortBy, useTable } from "react-table";
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { times } from "lodash";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { styled } from "@mui/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // [`&.${tableCellClasses.head}`]: {
  //   backgroundColor: theme.palette.background.default,
  //   color: theme.palette.common.white,
  // },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const EnhancedTable = ({
  columns,
  data,
  onRowClick,
  isLoading,
  hasPagination = false,
  setPageIndex,
  setPageSize,
  totalPages,
  pageSize,
  pageIndex,
}) => {
  const { getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const handleChangePage = (event, newPage) => {
    setPageIndex(Number(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <TableContainer>
      <FuseScrollbars>
        <Table {...getTableProps()} aria-label="customized table">
          <TableHead className="bg-[#1B2A3F]">
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <StyledTableCell
                    className="text-white text-[12px] uppercase font-600 py-[13px]"
                    key={idx}
                    sx={{ minWidth: "150px" }}
                    {...column.getSortByToggleProps()}
                  >
                    {column.render("Header")}
                    <TableSortLabel
                      sx={{ display: "inline-block" }}
                      active={column.isSorted}
                      direction={column.isSortedDesc ? "desc" : "asc"}
                    />
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          {isLoading ? (
            <TableBody>
              {times(10, String).map((val) => (
                <StyledTableRow key={val}>
                  {columns.map((_val, idx) => (
                    <StyledTableCell key={idx} className="px-10 py-[13px]">
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <StyledTableRow
                    hover
                    sx={{ cursor: "pointer" }}
                    {...row.getRowProps()}
                    onClick={(ev) => onRowClick && onRowClick(ev, row)}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <StyledTableCell
                          {...cell.getCellProps()}
                          component="th"
                          scope="row"
                          className="px-14 text-start py-10 font-normal"
                        >
                          {cell.render("Cell")}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </FuseScrollbars>
      {hasPagination && (
        <TablePagination
          component="div"
          classes={{
            root: "flex-shrink-0 border-t-1",
          }}
          rowsPerPageOptions={[
            5,
            10,
            25,
            { label: "All", value: data.length + 1 },
          ]}
          colSpan={5}
          count={totalPages * pageSize}
          rowsPerPage={pageSize}
          page={pageIndex}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: false,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  );
};

EnhancedTable.defaultProps = {
  onRowClick: () => {},
};

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  onRowClick: PropTypes.func,
};

export default EnhancedTable;
