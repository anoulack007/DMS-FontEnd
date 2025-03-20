import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  TablePagination,
  Chip,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { FollowDocumentModel } from "..";
import { getIconByType } from "../../manage-document";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import SearchIcon from "@mui/icons-material/Search";

interface DocumentTableProps {
  documents: FollowDocumentModel[];
  loading: boolean;
  onSearch: (query: string) => void;
  onExport: () => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  loading,
  onSearch,
  onExport,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate displayed rows based on pagination
  const displayedDocuments = documents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ p: 2, borderRadius: "12px" }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: 2, p: 2 }}
      >
        <Typography variant="h6" color="#838383" fontWeight={600}>
          ລາຍການເອກະສານ
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            variant="outlined"
            placeholder="ຄົ້ນຫາ..."
            size="small"
            sx={{ height: "60px", width: "250px" }}
            value={searchTerm}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                style: { height: "60px" },
              },
            }}
          />
          ;
          <Button
            variant="contained"
            sx={{ textTransform: "none" }}
            color="primary"
            onClick={onExport}
            startIcon={<SystemUpdateAltIcon />}
          >
            Export to Excel
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ຊື່ເອກະສານ</TableCell>
              <TableCell>ວັນທີສ້າງ</TableCell>
              <TableCell>ຊື່ຜູ້ໃຊ້</TableCell>
              <TableCell>ບໍລິສັດ</TableCell>
              <TableCell>ປະເພດ</TableCell>
              <TableCell>ຈັດການ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ borderBottom: "1px solid #E0E0E0" }}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : displayedDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">ບໍ່ມີຂໍ້ມູນ</Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {document.type && getIconByType(document.type)}
                      <Typography>{document.docName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {document.createdAt
                      ? new Date(document.createdAt).toLocaleDateString()
                      : "3/13/2025, 9:28:06 PM"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {document.ownerName}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {document.company}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {document.type || "Unknown Type"}
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    <Chip
                      label={document?.event}
                      color="success"
                      size="medium"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && documents.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={documents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="ແຖວຕໍ່ໜ້າ:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ຈາກ ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default DocumentTable;
