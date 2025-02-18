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
} from "@mui/material";
import {
  PanoramaFishEye as PanoramaFishEyeIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { getIconByType } from "../../manage-document";
import NO_DATA_IC from "../../../assets/logo/NotData.svg";
import { FollowDocumentModel } from "../../../models/follow-document";
import { IconType } from "../../../enums/icon-enums";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { getEventChipColor } from "../../../utils/constant/eventChipColor";

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
  page: number;
  rowsPerPage: number;
  totalDocuments: number;
  selectedItems: string[];
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectItem: (id: string) => void;
}
const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  loading,
  error,
  page,
  rowsPerPage,
  totalDocuments,
  selectedItems,
  onPageChange,
  onRowsPerPageChange,
  onSelectItem,
}) => {
  const isSelected = (id: string) => selectedItems.includes(id);

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
              <TableCell width={500}>Document Name</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Event</TableCell>
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
                      {getIconByType(item.type)}
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
                      ? new Date(item.createdAt).toLocaleString()
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
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={documents.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        // Add these props to help with loading states
        disabled={loading}
        // Ensure we don't show -1 pages
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} of ${count !== -1 ? count : 'more than ' + to}`
        }
      />
    </>
  );
};

export default DocumentTable;
