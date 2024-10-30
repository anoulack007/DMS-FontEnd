import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  MenuItem,
  Chip,
  Typography,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useState } from "react";
import UseMainController from "./controllers";

//icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import FoldeImage from "../../assets/Image/image 11.png";

// Interface for document type
interface Document {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  size: string;
  type: string;
}

const SearchDocumentPage = () => {
  const ctrl = UseMainController();

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const statusOptions = [
    { value: "private", label: "Private" },
    { value: "public", label: "Public" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "PDF", label: "PDF" },
    { value: "DOC", label: "DOC" },
    { value: "XLS", label: "XLS" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "public":
        return "#FFA726";
      case "private":
        return "#66BB6A";
      default:
        return "#90A4AE";
    }
  };


  return (
    <Box>
      {/* Search and Filter Section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search documents..."
          value={ctrl?.searchTerm}
          onChange={(e) => ctrl.handleSearch(e.target.value)}
          sx={{ flexGrow: 1, bgcolor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="medium"
        />

        <TextField
          select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150, bgcolor: "white" }}
          size="medium"
          label="Status"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ minWidth: 150, bgcolor: "white" }}
          size="medium"
          label="Type"
        >
          {typeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          startIcon={<FilterIcon />}
          // onClick={handleSearch}
          sx={{ height: 50 }}
        >
          Apply Filters
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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

                <TableCell>ID Document</TableCell>

                <TableCell>Actions</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
                ctrl?.documents.map((doc) => (
                  <TableRow
                    key={doc?.id}
                    selected={ctrl?.isSelected(doc.id)}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)", // Light gray hover color
                        transition: "background-color 0.2s ease", // Smooth transition effect
                      },
                      cursor: "pointer", // Changes cursor to pointer on hover
                    }}
                    onDoubleClick={(e) => ctrl.handleFolderClick(e, doc)}
                  >
                    {/* Rest of your TableRow content remains the same */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                        checked={ctrl?.isSelected(doc?.id)}
                        onChange={() => ctrl?.handleSelectItem(doc?.id)}
                        checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                        }}
                      >
                        <img src={FoldeImage} alt="folder" />
                        <Box>
                          <Typography>{doc?.name}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{doc?.documentId}</TableCell>
                    <TableCell>
                      {doc?.createdAt
                        ? new Date(doc?.createdAt).toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell>{doc?.size}</TableCell>
                    <TableCell>
                      <Chip
                        label={doc?.status}
                        sx={{
                          backgroundColor: getStatusColor(doc?.status),
                          borderRadius: "4px",
                          fontWeight: "normal",
                          color: "black",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No documents found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SearchDocumentPage;
