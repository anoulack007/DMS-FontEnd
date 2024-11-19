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
  InputAdornment,
} from "@mui/material";

import Invite_IC from "../../assets/logo/invite_ic.svg";
import Access_IC from "../../assets/logo/access_ic.svg";
import Person_IC from "../../assets/logo/Person.svg";

//icons
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

//controllers
import UseMainController from "./controller";
import CustomMenu from "./components/custom-menu";
import { STATUS_ENUMS } from "../../enums/status-enum";

//icons
import FoldeImage from "../../assets/Image/image 11.png";
import ZipImage from "../../assets/logo/zip_ic.svg";
import PngImage from "../../assets/logo/png.svg";
import DocsImage from "../../assets/logo/doc_ic.svg";
import XlsxImage from "../../assets/logo/excel_ic.svg";
import ImageImage from "../../assets/logo/image_ic.svg";
import JpegImage from "../../assets/logo/jpg.svg.svg";
import PptImage from "../../assets/logo/ptt_ic.svg";
import Mp3Image from "../../assets/logo/music_ic.svg";
import VideoImage from "../../assets/logo/video_ic.svg";
import PdfImage from "../../assets/logo/pdf_ic.svg";
import TxtImage from "../../assets/logo/txt.svg.svg";
import SvgImage from "../../assets/logo/svg.svg.svg";
import ExeImage from "../../assets/logo/exe.svg.svg";

import { IconType } from "../../enums/icon-enums";
import DialogInviteMember from "./components/dialog-inviteMember";

const getIconByType = (type: string) => {
  switch (type) {
    case IconType.FOLDER:
      return <img src={FoldeImage} alt="folder" />;
    case IconType.ZIP:
      return <img src={ZipImage} alt="zip" />;
    case IconType.PNG:
      return <img height={45} src={PngImage} alt="png" />;
    case IconType.DOCS:
      return <img src={DocsImage} alt="docs" />;
    case IconType.XLSX:
      return <img src={XlsxImage} alt="xlsx" />;
    case IconType.IMAGE:
      return <img src={ImageImage} alt="image" />;
    case IconType.JPG:
      return <img height={45} src={JpegImage} alt="jpeg" />;
    case IconType.PPT:
      return <img src={PptImage} alt="ppt" />;
    case IconType.MP3:
      return <img src={Mp3Image} alt="mp3" />;
    case IconType.MP4:
      return <img src={VideoImage} alt="video" />;
    case IconType.PDF:
      return <img src={PdfImage} alt="pdf" />;
    case IconType.TXT:
      return <img height={45} src={TxtImage} alt="txt" />;
    case IconType.SVG:
      return <img height={45} src={SvgImage} alt="svg" />;
    case IconType.EXE:
      return <img height={45} src={ExeImage} alt="exe" />;
    default:
      return <img src={FoldeImage} alt="folder" />;
  }
};

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

  const formatFileSize = (sizeInBytes: any) => {
    if (sizeInBytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return `${(sizeInBytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

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
          handleShare={() => ctrl?.setShareDialogOpen(true)}
          handleDownload={ctrl?.handleDownload}
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
                  <TableCell>Type</TableCell>
                  <TableCell>ID Document</TableCell>
                  {renderSortableHeader("modified", "Modified")}
                  {renderSortableHeader("size", "File Size")}
                  {renderSortableHeader("status", "Status")}
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
                  ctrl?.documents.map((item) => (
                    <TableRow
                      key={item?.id}
                      selected={ctrl?.isSelected(item.id)}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          transition: "background-color 0.2s ease",
                        },
                        cursor: "pointer",
                      }}
                      // onDoubleClick={(e) =>
                      //   item.type === "folder"
                      //     ? ctrl.handleFolderClick(e, item)
                      //     : ctrl.handleFileClick(e, item)
                      // }
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                          checked={ctrl?.isSelected(item?.id)}
                          onChange={() => ctrl?.handleSelectItem(item?.id)}
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
                          {getIconByType(item?.type)}
                          <Box>
                            <Typography>{item?.name}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{item?.type}</TableCell>
                      <TableCell>{item?.id}</TableCell>
                      <TableCell>
                        {item?.createdAt
                          ? new Date(item?.createdAt).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        {item?.size ? formatFileSize(item.size) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item?.status}
                          sx={{
                            backgroundColor: getStatusColor(item?.status),
                            borderRadius: "4px",
                            fontWeight: "normal",
                            color: "white",
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
              minHeight: 1200,
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
              <Typography
                variant="h5"
                title={ctrl?.selectedDocument?.name}
                sx={{
                  whiteSpace: "nowrap", // Prevents text from wrapping to the next line
                  overflow: "hidden", // Hides overflowing text
                  textOverflow: "ellipsis", // Adds ellipsis at the end of the truncated text
                  maxWidth: "100%", // Ensures the element has a maximum width to trigger truncation
                }}
              >
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
                      value={ctrl?.selectedDocument?.status ?? ""}
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
                      <IconButton
                        onClick={() => ctrl?.setInviteDialogOpen(true)}
                      >
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
                  <strong>Size:</strong>{" "}
                  {ctrl?.selectedDocument?.size
                    ? formatFileSize(ctrl.selectedDocument.size)
                    : "N/A"}
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

        <Dialog
          open={ctrl?.shareDialogOpen}
          onClose={ctrl.handleCloseShareDialog}
          maxWidth="xs"
          fullWidth
        >
          <form>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={ctrl.handleCloseShareDialog}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Share "Documents"
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a name or email"
                InputProps={{
                  style: { borderRadius: 20 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={Person_IC} alt="person" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 2, borderRadius: 20 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                startIcon={<SendIcon />}
                sx={{
                  backgroundColor: "maroon",
                  color: "white",
                  textTransform: "none",
                  maxWidth: 100,
                  height: 40,
                  borderRadius: 3,
                }}
              >
                Send
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <DialogInviteMember
          open={ctrl?.inviteDialogOpen}
          onClose={() => ctrl?.setInviteDialogOpen(false)}
          handleInviteMember={ctrl.handleIviteMember}
          email={ctrl?.email}
          setEmail={ctrl?.handleChangeEmail}
        />
      </Box>
    </Box>
  );
};

export default ManageDocumentPage;
