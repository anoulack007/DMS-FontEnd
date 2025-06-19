import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  Chip,
  Checkbox,
  CircularProgress,
  TableFooter,
} from "@mui/material";
import {
  PanoramaFishEye as PanoramaFishEyeIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import NO_DATA_IC from "../../../assets/logo/NotData.svg";

import { FollowDocumentModel } from "../../../models/follow-document";
import { IconType } from "../../../enums/icon-enums";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { getEventChipColor } from "../../../utils/constant/eventChipColor";
import { getIconByType } from "../../../utils/functions/inconUtils";
import FoldeImage from "../../../assets/Image/image 11.png";

interface Document {
  id: string;
  name: string;
  path: string;
  documentId: string;
  modified: string;
  size: string;
  type: IconType;
  itemType: string;
  status: STATUS_ENUMS;
  url: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  event: string;
  followDocument: FollowDocumentModel;
  docName: string;
  ownerName: string;
  company: string;
}

interface DocumentTableProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  page: number;
  rowsPerPage: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalCount: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  loading,
  error,
  selectedItems,
  onSelectItem,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  totalCount,
}) => {
  const isSelected = (id: string) => selectedItems.includes(id);

  // Function to get the appropriate icon based on event type
  const getEventIcon = (item: Document) => {
    if (item.event === "Create") {
      return <img src={FoldeImage} style={{ width: "40px", height: "40px" }} />;
    }
    return getIconByType(item.type);
  };

  return (
    <>
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
              <TableCell width={500}>ຊື່ເອກະສານ</TableCell>
              <TableCell>ວັນທີ</TableCell>
              <TableCell>ຊື່ຜູ້ໃຊ້</TableCell>
              <TableCell>ບໍລິສັດ</TableCell>
              <TableCell>ເຫດການ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ borderBottom: "1px solid #919EAB3D" }}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : documents.length > 0 ? (
              documents.map((item) => (
                <TableRow
                  key={item.id}
                  selected={isSelected(item.id)}
                  onClick={() => onSelectItem(item.id)}
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
                >
                  <TableCell
                    padding="checkbox"
                    sx={{
                      borderBottom: "none",
                      "& .MuiCheckbox-root": {
                        transition: "opacity 0.2s, visibility 0.2s",
                        opacity: isSelected(item.id) ? 1 : 0,
                        visibility: isSelected(item.id) ? "visible" : "hidden",
                      },
                    }}
                    className="checkbox-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checked={isSelected(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectItem(item.id);
                      }}
                      checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
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
                      {getEventIcon(item)}
                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Typography>{item.docName}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item.ownerName}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {item.company}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Chip
                      label={item.event}
                      sx={{
                        backgroundColor: getEventChipColor(item.event),
                        color: item.event === "Update" ? "black" : "white",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box
                    sx={{
                      minHeight: 500,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={NO_DATA_IC} alt="data" />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} align="right">
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default DocumentTable;