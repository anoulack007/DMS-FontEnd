import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Checkbox,
  Typography,
  Chip,
  TableSortLabel,
  Menu,
  MenuItem,
  Drawer,
} from "@mui/material";
import FoldeImage from "../../assets/Image/image 11.png";

//icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//controllers
import UseMainController from "./controller";

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "highly confidential":
      return "#FFCCCB"; // Light red
    case "confidential":
      return "#FFE5B4"; // Light orange
    case "internal":
      return "#E0F0FF"; // Light blue
    case "public":
      return "#E0FFE0"; // Light green
    default:
      return "transparent";
  }
};

type SortField = "name" | "modified" | "fileSize" | "status";

const ManageDocumentPage = () => {
  const ctrl = UseMainController();

  const handleFilter = (field: SortField, value: string) => {
    let filteredDocuments = [...ctrl?.documents];

    switch (field) {
      case "modified":
        // Implement date filtering logic
        break;
      case "fileSize":
        // Implement file size filtering logic
        break;
      case "status":
        filteredDocuments = ctrl?.documents.filter(
          (doc) => doc.status === value
        );
        break;
    }

    ctrl?.setDocuments(filteredDocuments);
    ctrl?.handleFilterClose(field);
  };

  const getFilterMenuItems = (field: SortField) => {
    switch (field) {
      case "modified":
        return [
          <MenuItem key="today" onClick={() => handleFilter(field, "Today")}>
            Today
          </MenuItem>,
          <MenuItem
            key="this-week"
            onClick={() => handleFilter(field, "This week")}
          >
            This week
          </MenuItem>,
          <MenuItem
            key="this-month"
            onClick={() => handleFilter(field, "This month")}
          >
            This month
          </MenuItem>,
        ];
      case "status":
        return [
          <MenuItem
            key="highly-confidential"
            onClick={() => handleFilter(field, "Highly Confidential")}
          >
            Highly Confidential
          </MenuItem>,
          <MenuItem
            key="confidential"
            onClick={() => handleFilter(field, "Confidential")}
          >
            Confidential
          </MenuItem>,
          <MenuItem
            key="internal"
            onClick={() => handleFilter(field, "Internal")}
          >
            Internal
          </MenuItem>,
          <MenuItem key="public" onClick={() => handleFilter(field, "Public")}>
            Public
          </MenuItem>,
        ];
      default:
        return [];
    }
  };

  const renderSortableHeader = (field: SortField, label: string) => (
    <TableCell>
      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <TableSortLabel
          active={ctrl?.sortField === field}
          direction={ctrl?.sortField === field ? ctrl?.sortOrder : "asc"}
          onClick={() => ctrl?.handleSort(field)}
        >
          {label}
        </TableSortLabel>
        <IconButton
          size="small"
          onClick={(e) => ctrl?.handleFilterClick(e, field)}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={ctrl?.filterAnchorEl[field]}
        open={Boolean(ctrl?.filterAnchorEl[field])}
        onClose={() => ctrl?.handleFilterClose(field)}
      >
        {getFilterMenuItems(field)}
      </Menu>
    </TableCell>
  );

  return (
    <Box>
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
              {renderSortableHeader("name", "Document Name")}
              <TableCell>ID Document</TableCell>
              {renderSortableHeader("modified", "Modified")}
              {renderSortableHeader("fileSize", "File Size")}
              {renderSortableHeader("status", "Status")}
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
                  key={doc.id}
                  selected={ctrl?.isSelected(doc.id)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checked={ctrl?.isSelected(doc.id)}
                      onChange={() => ctrl?.handleSelectItem(doc.id)}
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
                      <Box onClick={(e) => ctrl.handleFolderClick(e, doc)}>
                        <img src={FoldeImage} alt="folder" />
                      </Box>
                      <Box onClick={(e) => ctrl.handleDocumentClick(e, doc)}>
                        <Typography>{doc.name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{doc.idDocument}</TableCell>
                  <TableCell>{doc.modified}</TableCell>
                  <TableCell>{doc.fileSize}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status}
                      sx={{
                        backgroundColor: getStatusColor(doc.status),
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

      <Drawer
        anchor="right"
        open={ctrl?.drawerOpen}
        onClose={ctrl?.handleDrawerClose}
      >
        {ctrl?.selectedDocument && (
          <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6">{ctrl?.selectedDocument.name}</Typography>
            <Typography>ID: {ctrl?.selectedDocument.idDocument}</Typography>
            <Typography>Modified: {ctrl?.selectedDocument.modified}</Typography>
            <Typography>
              File Size: {ctrl?.selectedDocument.fileSize}
            </Typography>
            <Chip
              label={ctrl?.selectedDocument.status}
              sx={{
                backgroundColor: getStatusColor(ctrl?.selectedDocument.status),
                borderRadius: "4px",
                fontWeight: "normal",
                color: "black",
                mt: 1,
              }}
            />
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default ManageDocumentPage;
