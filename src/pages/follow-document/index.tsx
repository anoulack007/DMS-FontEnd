import {
  Paper,
  Box,
  IconButton,
  Typography,
  Collapse,
  Divider,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";

//icons
import CloseIcon from "@mui/icons-material/Close";

//controllers
import UseMainController from "./controller";

//icons
import FoldeImage from "../../assets/Image/image 11.png";
import DocumentTable from "./components/table";
import { getEventChipColor } from "../../utils/constant/eventChipColor";
import EventFilter from "./components/input-eventFilter";
import { getIconByType } from "../../utils/functions/inconUtils";
import CustomMenu from "./components/custom-menu";

const FollowDocumentPage = () => {
  const ctrl = UseMainController();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography mb={5} color="#838383" variant="h5" fontWeight={700}>
          ຕິດຕາມເອກະສານ
        </Typography>

        <EventFilter
          eventFilter={ctrl.eventFilter}
          handleEventFilterChange={ctrl.handleEventFilterChange}
        />
      </Box>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={ctrl.activeTab} 
          onChange={ctrl.handleTabChange}
          aria-label="document tabs"
        >
          <Tab label="ທັງໝົດ" value="all" />
          <Tab label="ເອກະສານຂອງຂ້ອຍ" value="my" />
        </Tabs>
      </Box>

      {ctrl?.selectedItems.length > 0 && (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          onDetailsClick={ctrl.handleDetailsClick}
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
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ລາຍລະອຽດ
                </Typography>

                <Typography>
                  <strong>
                    ເຈົ້າຂອງເອກະສານ <br /> {ctrl.selectedDocument?.ownerName}
                  </strong>
                </Typography>
                <Typography>
                  <strong>
                    ບໍລິສັດ <br /> {ctrl.selectedDocument?.company}
                  </strong>
                </Typography>
                <Typography>
                  <strong>
                    ສ້າງໃນວັນທີ <br />
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
      </Box>
    </Box>
  );
};

export default FollowDocumentPage;