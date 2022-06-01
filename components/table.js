import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import styles from "../styles/Table.module.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
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

export default function SpotTable({ spotted }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Triangle</StyledTableCell>
            <StyledTableCell align="right">Profit (%) </StyledTableCell>
            <StyledTableCell align="right">Fee Rate </StyledTableCell>
            <StyledTableCell align="right">Cross Rate </StyledTableCell>
            <StyledTableCell align="right">Order Path</StyledTableCell>
            <StyledTableCell align="right">Paths</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {spotted.map((row, index) => {
            let s; //style red or green
            let p = row.profitPercent;
            if (p > 0) s = true;
            if (p < 0) s = false;

            return (
              <StyledTableRow key={index + 1}>
                <StyledTableCell
                  className={s ? styles.profit : styles.loss}
                  component="th"
                  scope="row"
                >
                  {row.triangle.join(" • ")}
                </StyledTableCell>
                <StyledTableCell
                  className={s ? styles.profit : styles.loss}
                  align="right"
                >
                  {row.profitPercent}
                </StyledTableCell>
                <StyledTableCell
                  className={s ? styles.profit : styles.loss}
                  align="right"
                >
                  {row.feeRate}
                </StyledTableCell>
                <StyledTableCell
                  className={s ? styles.profit : styles.loss}
                  align="right"
                >
                  {row.crossRate}
                </StyledTableCell>
                <StyledTableCell
                  className={s ? styles.profit : styles.loss}
                  align="right"
                >
                  <Chip label={row.orderPath} variant="outlined" />
                </StyledTableCell>
                <StyledTableCell
                  className={s ? styles.profit : styles.loss}
                  align="right"
                >
                  <Chip label={row.paths} variant="outlined" />
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
