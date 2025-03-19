import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import UseMainController from "./controllers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//icons

import CustomMenu from "./components/custom-menu";

import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getIconByType } from "../manage-document";
import DocumentTable from "./components/table";
import DocumentDetailCollapse from "./components/collapse";

const RecyclePage = () => {
  const ctrl = UseMainController();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          justifyContent: "space-between",
        }}
      >
        <Typography color="#838383" variant="h5" fontWeight={700}>
          ຖັງຂີ້ເຫຍື້ອ
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FilterAltIcon color="action" />
              <Typography variant="subtitle2">ການກັ່ນຕອງຕາມວັນທີ</Typography>

              <DatePicker
                label="ວັນທີເລີ່ມຕົ້ນ"
                value={ctrl.dateFilter.startDate}
                onChange={(newValue: any) =>
                  ctrl.handleDateFilterChange({
                    ...ctrl.dateFilter,
                    startDate: newValue,
                  })
                }
                format="MM/DD/YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 170 },
                  },
                }}
              />

              <DatePicker
                label="ວັນທີສິ້ນສຸດ"
                value={ctrl.dateFilter.endDate}
                onChange={(newValue: any) =>
                  ctrl.handleDateFilterChange({
                    ...ctrl.dateFilter,
                    endDate: newValue,
                  })
                }
                format="MM/DD/YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 170 },
                  },
                }}
              />

              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                sx={{ textTransform: "none" }}
                onClick={ctrl.resetFilters}
                size="small"
              >
                ລ້າງຕົວກອງ
              </Button>
            </Stack>
          </LocalizationProvider>

          <Divider orientation="vertical" flexItem />

          <TextField
            sx={{
              fontFamily: "NotoSansLao-Regular",
              borderRadius: 24,
              bgcolor: "#F6F6F6",
              "& .MuiOutlinedInput-root": {
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            placeholder="ຄົ້ນຫາເອກະສານ..."
            value={ctrl.searchTerm}
            onChange={(e) => ctrl.handleSearch(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 24,
                },
              },
            }}
          />
        </Box>
      </Box>

      {ctrl?.selectedItems.length > 0 && (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          onDetailsClick={ctrl.handleDetailsClick}
          handleDelete={ctrl?.handleDelete}
          handleRestore={ctrl?.handleRestore}
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
        <DocumentTable ctrl={ctrl} getIconByType={getIconByType} />

        <DocumentDetailCollapse ctrl={ctrl} getIconByType={getIconByType} />
      </Box>
    </Box>
  );
};

export default RecyclePage;
