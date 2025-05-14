import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Checkbox,
  Chip,
  CircularProgress,
  Paper,
  TablePagination,
  TableFooter,
  IconButton,
  Tooltip,
} from "@mui/material";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NO_DATA_IC from "../../../assets/logo/NotData.svg";
import { getFileTypeFromName } from "../../../utils/functions/typefile";

interface DocumentTableProps {
  ctrl: any;
  isAnyItemSelected: boolean;
  getIconByType: (type: string) => React.ReactNode;
  formatFileSize: (size: number) => string;
  getStatusColor: (status: string) => string;
  getTextColor: (status: string) => string;
  handleUploadVersion?: (documentNumber: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  ctrl,
  isAnyItemSelected,
  getIconByType,
  formatFileSize,
  getStatusColor,
  getTextColor,
  handleUploadVersion,
}) => {
  // Get paginated data
  const paginatedData = ctrl.documents.slice(
    ctrl.page * ctrl.rowsPerPage,
    ctrl.page * ctrl.rowsPerPage + ctrl.rowsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <TableContainer
        sx={{
          boxShadow: 3,
          borderRadius: 3,
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              {isAnyItemSelected && (
                <TableCell padding="checkbox">
                  <Checkbox
                    icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                    checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                    indeterminate={
                      ctrl?.selectedItems.length > 0 &&
                      ctrl?.selectedItems.length < ctrl?.documents.length
                    }
                    checked={
                      ctrl?.documents.length > 0 &&
                      ctrl?.selectedItems.length === ctrl?.documents.length
                    }
                    onChange={ctrl?.handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ຊື່ເອກະສານ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ເວີຊັນ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ປະເພດ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ລະຫັດເອກະສານ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ວັນທີແກ້ໄຂ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ຂະໜາດໄຟລ໌</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ສະຖານະ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ຈັດການ</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ borderBottom: "1px solid #919EAB3D" }}>
            {ctrl?.loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : ctrl?.error ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {ctrl?.error}
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item: any) => (
                <TableRow
                  key={item?.id}
                  selected={ctrl?.isSelected(item.id)}
                  onClick={() => ctrl.handleSelectItem(item?.id)}
                  onDoubleClick={() => {
                    if (item.itemType === "folder") {
                      ctrl.handleFolderDoubleClick(item);
                    }
                  }}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      transition: "background-color 0.2s ease",
                    },
                    cursor: item.itemType === "folder" ? "pointer" : "default",
                  }}
                >
                  {(isAnyItemSelected || ctrl?.isSelected(item?.id)) && (
                    <TableCell sx={{ borderBottom: "none" }} padding="checkbox">
                      <Checkbox
                        icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                        checked={ctrl?.isSelected(item?.id)}
                        onChange={() => ctrl?.handleSelectItem(item?.id)}
                        checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      {getIconByType(
                        item.itemType === "file"
                          ? item.type || getFileTypeFromName(item.name)
                          : "folder"
                      )}
                      <Box>
                        <Typography>
                          {/* {(() => {
                            const version = item?.version;
                            const isV1OrHigher =
                              version &&
                              version.startsWith("v") &&
                              parseInt(version.slice(1)) >= 1;

                            const displayName = isV1OrHigher
                              ? item?.nameVersion ??
                                item?.fileMembers?.file?.nameVersion
                              : item?.name ?? item?.fileMembers?.file?.name;

                            return displayName;
                          })()}  */}

                          {item?.name ?? item?.fileMembers?.file?.name}

                          {item?.isShared && (
                            <span
                              style={{
                                color: "green",
                                marginLeft: "8px",
                                fontWeight: 700,
                              }}
                            >
                              (Shared)
                            </span>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.version ?? "N/A"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item.itemType === "file"
                      ? item.type || getFileTypeFromName(item.name)
                      : "folder"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.document
                      ? item?.documentNumber ?? item?.documentId
                      : item?.documentId}
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item.size ? formatFileSize(Number(item.size)) : "N/A"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Chip
                      label={item.status}
                      sx={{
                        backgroundColor: getStatusColor(item.status),
                        borderRadius: "4px",
                        fontWeight: "normal",
                        color: getTextColor(item.status),
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item.itemType === "file" && handleUploadVersion && (
                      <Tooltip title="ອັບໂຫຼດເວີຊັນໃໝ່">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row selection
                            const docNumber =
                              item?.documentNumber || item?.documentId;
                            handleUploadVersion(docNumber);
                          }}
                          size="small"
                        >
                          <UploadFileIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow sx={{ height: "200px" }}>
                <TableCell colSpan={8} align="center">
                  <img height={"100px"} src={NO_DATA_IC} alt="No Data" />
                  <p>ບໍ່ມີຂໍ້ມູນ</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} align="right">
                <TablePagination
                  component="div"
                  count={ctrl.documents.length}
                  page={ctrl.page}
                  onPageChange={ctrl.handleChangePage}
                  rowsPerPage={ctrl.rowsPerPage}
                  onRowsPerPageChange={ctrl.handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
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
