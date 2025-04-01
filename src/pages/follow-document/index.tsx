import {
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Typography,
  Collapse,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";

//icons
import CloseIcon from "@mui/icons-material/Close";

//controllers
import UseMainController from "./controller";

//icons
import FoldeImage from "../../assets/Image/image 11.png";
import CustomMenu from "../manage-document/components/custom-menu";
import DocumentTable from "./components/table";
import { getEventChipColor } from "../../utils/constant/eventChipColor";
import EventFilter from "./components/input-eventFilter";
import { getIconByType } from "../../utils/functions/inconUtils";

const FollowDocumentPage = () => {
  const ctrl = UseMainController();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography mb={5} color="#838383" variant="h5" fontWeight={700}>
          ຕິດຕາມເອກະສານ
        </Typography>

        <EventFilter
          eventFilter={ctrl.eventFilter}
          handleEventFilterChange={ctrl.handleEventFilterChange}
        />
      </Box>
      {ctrl?.selectedItems.length > 0 && (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          onDetailsClick={ctrl.handleDetailsClick}
          hanldeFolderRename={() => ctrl?.setRenameDialogOpen(true)}
          handleDelete={ctrl?.handleDeleteFolder}
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
          <DocumentTable
            documents={ctrl?.documents}
            loading={ctrl?.loading}
            error={ctrl?.error}
            selectedItems={ctrl?.selectedItems}
            onSelectItem={ctrl?.handleSelectItem}
            page={ctrl?.page}
            rowsPerPage={ctrl?.rowsPerPage}
            handleChangePage={ctrl?.handleChangePage}
            handleChangeRowsPerPage={ctrl?.handleChangeRowsPerPage}
            totalCount={ctrl?.totalCount}
          />
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
              {ctrl?.selectedDocument?.type ? (
                getIconByType(ctrl.selectedDocument.type)
              ) : (
                <img src={FoldeImage} alt="default" />
              )}
              <Typography
                variant="h5"
                title={ctrl?.selectedDocument?.docName}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {ctrl?.selectedDocument?.docName}
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
                sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 3 }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                  details
                </Typography>

                <Typography>
                  <strong>
                    Owner <br /> {ctrl.selectedDocument?.ownerName}
                  </strong>
                </Typography>
                <Typography>
                  <strong>
                    Company <br /> {ctrl.selectedDocument?.company}
                  </strong>
                </Typography>
                <Typography>
                  <strong>
                    Created <br />
                  </strong>
                  {ctrl?.selectedDocument?.createdAt
                    ? new Date(
                        ctrl?.selectedDocument?.createdAt
                      ).toLocaleString()
                    : "-"}
                </Typography>
                <Typography>
                  <strong>
                    Event <br />{" "}
                  </strong>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={ctrl?.selectedDocument?.event}
                      sx={{
                        width: 100,
                        backgroundColor: getEventChipColor(
                          ctrl?.selectedDocument?.event
                        ),
                        color:
                          ctrl?.selectedDocument.event === "Update"
                            ? "black"
                            : "white",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
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

export default FollowDocumentPage;
