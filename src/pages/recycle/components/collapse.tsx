import React from "react";
import {
  Box,
  Collapse,
  Paper,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RecycleBinDocument } from "../../../models/recycle-bin-model";
import FoldeImage from "../../../assets/Image/image 11.png";

interface DocumentDetailCollapseProps {
  ctrl: {
    collapeOpen: boolean;
    setCollapseOpen: (open: boolean) => void;
    selectedDocument: RecycleBinDocument | null;
    setSearchParams: (params: any) => void;
  };
  getIconByType: (type: string) => React.ReactNode;
}

const DocumentDetailCollapse: React.FC<DocumentDetailCollapseProps> = ({
  ctrl,
  getIconByType,
}) => {
  return (
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
            title={ctrl?.selectedDocument?.name}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 3 }}>
            <Typography>
              <strong>
                ເຈົ້າຂອງເອກະສານ <br /> {ctrl.selectedDocument?.owner?.name}
              </strong>
            </Typography>
            <Typography>
              <strong>
                ບໍລິສັດ <br /> {ctrl.selectedDocument?.owner?.company}
              </strong>
            </Typography>
            <Typography>
              <strong>
                ສ້າງໃນວັນທີ <br />
              </strong>
              {ctrl?.selectedDocument?.createdAt
                ? new Date(ctrl?.selectedDocument?.createdAt).toLocaleDateString(
                    "en-GB"
                  )
                : "-"}
            </Typography>
            <Typography>
              <strong>
                ລຶບໃນວັນທີ <br />{" "}
              </strong>{" "}
              {ctrl?.selectedDocument?.updatedAt
                ? new Date(ctrl?.selectedDocument?.updatedAt).toLocaleDateString(
                    "en-GB"
                  )
                : "-"}
            </Typography>
            <Typography>
              <strong>
                ລຶບໂດຍ <br /> {ctrl.selectedDocument?.owner?.name}
              </strong>
            </Typography>
          </Box>
        )}
      </Paper>
    </Collapse>
  );
};

export default DocumentDetailCollapse;
