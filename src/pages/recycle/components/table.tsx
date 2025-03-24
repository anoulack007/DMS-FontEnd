import React from "react";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Typography,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { RecycleBinDocument } from "../../../models/recycle-bin-model";
import NoData from "../../../assets/logo/NotData.svg";

interface DocumentTableProps {
  ctrl: {
    loading: boolean;
    error: string | null;
    getPaginatedData: () => RecycleBinDocument[];
    isSelected: (id: string) => boolean;
    handleSelectItem: (id: string) => void;
    filteredDocuments: RecycleBinDocument[];
    page: number;
    handleChangePage: (_event: unknown, newPage: number) => void;
    rowsPerPage: number;
    handleChangeRowsPerPage: (
      event: React.ChangeEvent<HTMLInputElement>
    ) => void;
    searchTerm: string;
    dateFilter: {
      startDate: Date | null;
      endDate: Date | null;
    };
  };
  getIconByType: (type: string) => React.ReactNode;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  ctrl,
  getIconByType,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TableContainer
        sx={{
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>ຊື່ເອກະສານ</TableCell>
              <TableCell>ປະເພດ</TableCell>
              <TableCell>ລະຫັດເອກະສານ</TableCell>
              <TableCell>ຊື່ຜູ້ລົບ</TableCell>
              <TableCell>ລົບໃນວັນທິ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ borderBottom: "1px solid #919EAB3D" }}>
            {ctrl?.loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : ctrl?.error ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {ctrl?.error}
                </TableCell>
              </TableRow>
            ) : ctrl.getPaginatedData().length > 0 ? (
              ctrl.getPaginatedData().map((item) => (
                <TableRow
                  key={item?.id}
                  selected={ctrl?.isSelected(item.id)}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      transition: "background-color 0.2s ease",
                      "& .checkbox-cell": {
                        opacity: 1,
                        visibility: "visible",
                      },
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => ctrl?.handleSelectItem(item?.id)}
                >
                  <TableCell
                    padding="checkbox"
                    sx={{
                      borderBottom: "none",
                      "& .MuiCheckbox-root": {
                        transition: "opacity 0.2s, visibility 0.2s",
                        opacity: ctrl?.isSelected(item?.id) ? 1 : 0,
                        visibility: ctrl?.isSelected(item?.id)
                          ? "visible"
                          : "hidden",
                      },
                    }}
                    className="checkbox-cell"
                  >
                    <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checked={ctrl?.isSelected(item?.id)}
                      checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {getIconByType(item?.type)}
                      <Box>
                        <Typography>{item?.name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.type ? item?.type : "folder"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.documentId}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.owner?.name}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.updatedAt
                      ? new Date(item?.updatedAt).toLocaleString()
                      : ""}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box
                    sx={{
                      minHeight: 500,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <img src={NoData} alt="data" />
                    <Typography color="textSecondary">
                      {ctrl.searchTerm ||
                      ctrl.dateFilter.startDate ||
                      ctrl.dateFilter.endDate
                        ? "ບໍ່ພົບເອກະສານທີ່ກົງກັນ. ລອງເລືອກຕົວກອງຂອງທ່ານໃໝ່."
                        : "ບໍ່ມີຂໍ້ມູນໃນຖັງຂີ້ເຫຍື້ອ."}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} align="right">
                <TablePagination
                  component="div"
                  count={ctrl?.filteredDocuments.length}
                  page={ctrl.page}
                  onPageChange={ctrl.handleChangePage}
                  rowsPerPage={ctrl.rowsPerPage}
                  onRowsPerPageChange={ctrl.handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DocumentTable;
