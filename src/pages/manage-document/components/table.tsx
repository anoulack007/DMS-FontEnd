import React from 'react';
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
  Paper
} from '@mui/material';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface DocumentTableProps {
  ctrl: any; // Replace with more specific type if possible
  isAnyItemSelected: boolean;
  getIconByType: (type: string) => React.ReactNode;
  formatFileSize: (size: number) => string;
  getStatusColor: (status: string) => string;
  getTextColor: (status: string) => string;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  ctrl, 
  isAnyItemSelected, 
  getIconByType,
  formatFileSize,
  getStatusColor,
  getTextColor
}) => {
  return (
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      <TableContainer
        sx={{
          boxShadow: 3,
          borderRadius: 3,
          minHeight: "calc(100vh - 250px)",
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
                <p style={{ fontWeight: "bold" }}>ປະເພດ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ລະຫັດເອກະສານ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ວັນທີແກ້ໄຂ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ຂະໜາດຟໄຟລ໌</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ສະຖານະ</p>
              </TableCell>
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
            ) : ctrl?.documents.length > 0 ? (
              ctrl?.documents.map((item: any) => (
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
                    cursor: item.type === "folder" ? "pointer" : "default",
                  }}
                >
                  {(isAnyItemSelected || ctrl?.isSelected(item?.id)) && (
                    <TableCell
                      sx={{ borderBottom: "none" }}
                      padding="checkbox"
                    >
                      <Checkbox
                        icon={
                          <PanoramaFishEyeIcon sx={{ color: "gray" }} />
                        }
                        checked={ctrl?.isSelected(item?.id)}
                        onChange={() => ctrl?.handleSelectItem(item?.id)}
                        checkedIcon={
                          <CheckCircleIcon sx={{ color: "blue" }} />
                        }
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
                    {item?.id}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.createdAt
                      ? new Date(item?.createdAt).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item?.size ? formatFileSize(item.size) : "N/A"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Chip
                      label={item?.status}
                      sx={{
                        backgroundColor: getStatusColor(item?.status),
                        borderRadius: "4px",
                        fontWeight: "normal",
                        color: getTextColor(item?.status),
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No files or folders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DocumentTable;