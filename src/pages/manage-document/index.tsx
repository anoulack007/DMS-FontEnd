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
  Collapse,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import FoldeImage from "../../assets/Image/image 11.png";
import Invite_IC from "../../assets/logo/invite_ic.svg";
import Access_IC from "../../assets/logo/access_ic.svg";

//icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

//controllers
import UseMainController from "./controller";
import CustomMenu from "./components/custom-menu";
import { STATUS_ENUMS } from "../../enums/status-enum";

interface Document {
  id: string;
  name: string;
  path: string;
  documentId: string;
  modified: string;
  size: string;
  status: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "public":
      return "#03994D"; // Light red
    case "private":
      return "#91040B"; // Light orange
    default:
      return "transparent";
  }
};

type SortField = "name" | "modified" | "size" | "status";

const ManageDocumentPage = () => {
  const ctrl = UseMainController();

  // const handleFilter = (field: SortField, value: string) => {
  //   let filteredDocuments = [...ctrl?.documents];

  //   switch (field) {
  //     case "modified":
  //       // Implement date filtering logic
  //       break;
  //     case "fileSize":
  //       // Implement file size filtering logic
  //       break;
  //     case "status":
  //       filteredDocuments = ctrl?.documents.filter(
  //         (doc) => doc.status === value
  //       );
  //       break;
  //   }

  //   ctrl?.setDocuments(filteredDocuments);
  //   ctrl?.handleFilterClose(field);
  // };

  const getFilterMenuItems = (field: SortField) => {
    switch (field) {
      case "modified":
        return [
          <MenuItem
            key="today"
            onClick={() => ctrl?.handleFilter(field, "Today")}
          >
            Today
          </MenuItem>,
          <MenuItem
            key="this-week"
            onClick={() => ctrl?.handleFilter(field, "This week")}
          >
            This week
          </MenuItem>,
          <MenuItem
            key="this-month"
            onClick={() => ctrl?.handleFilter(field, "This month")}
          >
            This month
          </MenuItem>,
        ];
      case "status":
        return [
          <MenuItem
            key="private"
            onClick={() => ctrl?.handleFilter(field, "Confidential")}
          >
            Private
          </MenuItem>,
          <MenuItem
            key="public"
            onClick={() => ctrl.handleFilter(field, "Public")}
          >
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
      {ctrl?.selectedItems.length > 0 && (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          onDetailsClick={ctrl.handleDetailsClick}
          hanldeFolderRename={() => ctrl?.setRenameDialogOpen(true)}
          handleDelete={ctrl?.handleDeleteFolder}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 2,
          width: "100%",
        }}
      >
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
                  {renderSortableHeader("name", "Document Name")}
                  <TableCell>ID Document</TableCell>
                  {renderSortableHeader("modified", "Modified")}
                  {renderSortableHeader("size", "File Size")}
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
                          checkedIcon={
                            <CheckCircleIcon sx={{ color: "blue" }} />
                          }
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
                            color: "white",
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

        <Collapse
          in={ctrl.collapeOpen}
          timeout="auto"
          unmountOnExit
          sx={{ maxWidth: 350, width: "100%" }}
        >
          <Paper
            sx={{
              p: 3,
              backgroundColor: "white",
              boxShadow: 2,
              overflow: "auto",
              minHeight: 865, // Fixed height
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                gap: 2,
              }}
            >
              <img src={FoldeImage} alt="folder" />
              <Typography variant="h5">
                {ctrl?.selectedDocument?.name}
              </Typography>

              <Box sx={{ ml: "auto" }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    ctrl.setCollapseOpen(false);
                    ctrl.setSearchParams({});
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider />

            {ctrl.selectedDocument && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
              >
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Status
                  </Typography>
                  <FormControl fullWidth margin="normal" size="medium">
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      value={ctrl?.selectedDocument?.status ?? ''}
                      label="Status"
                      onChange={ctrl.handleChangeStatus}
                    >
                      {Object.values(STATUS_ENUMS).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ mt: 1 }}>
                    <Typography>Has access</Typography>

                    <Box sx={{ mt: 2, display: "flex" }}>
                      <IconButton>
                        <img src={Invite_IC} alt="invite" />
                      </IconButton>

                      <IconButton>
                        <img src={Access_IC} alt="access" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <Typography>Details</Typography>

                <Typography>
                  <strong>Name:</strong> {ctrl.selectedDocument.name}
                </Typography>
                <Typography>
                  <strong>Owner:</strong>
                </Typography>
                <Typography>
                  <strong>ID:</strong> {ctrl.selectedDocument?.documentId}
                </Typography>
                <Typography>
                  <strong>Created:</strong>{" "}
                  {ctrl?.selectedDocument?.createdAt
                    ? new Date(
                        ctrl?.selectedDocument?.createdAt
                      ).toLocaleString()
                    : "-"}
                </Typography>
                <Typography>
                  <strong>Size:</strong> {ctrl?.selectedDocument?.size}
                </Typography>
              </Box>
            )}
          </Paper>
        </Collapse>

        <Dialog
          open={ctrl?.renameDialogOpen}
          onClose={() => ctrl?.setRenameDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <form onSubmit={ctrl.handleRenameFolder}>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="New name"
                fullWidth
                value={ctrl?.newName}
                onChange={(e) => ctrl?.handleChangeName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={onClose} disabled={ctrl?.isSubmitting}>
                Cancel
              </Button> */}
              <Button
                type="submit"
                sx={{
                  bgcolor: "#2C3E50",
                  textTransform: "none",
                  color: "white",
                }}
              >
                {ctrl?.isSubmitting ? <CircularProgress size={24} /> : "Rename"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageDocumentPage;
