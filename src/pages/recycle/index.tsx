import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Badge,
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
import DocumentTable from "./components/table";
import DocumentDetailCollapse from "./components/collapse";
import { getIconByType } from "../../utils/functions/inconUtils";

const RecyclePage = () => {
  const ctrl = UseMainController();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
          justifyContent: "space-between",
          gap: { xs: 2, md: 0 },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#4A4A4A"
            mb={{ xs: 1, md: 0 }}
          >
            ຖັງຂີ້ເຫຍື້ອ
          </Typography>
          <Badge
            badgeContent={ctrl?.documents.length || 0}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.8rem",
                height: "22px",
                minWidth: "22px",
                borderRadius: "50%",
                padding: "0 6px",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", md: "auto" },
            gap: { xs: 2, md: 3 },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexWrap="wrap"
              sx={{ width: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "nowrap",
                }}
              >
                <FilterAltIcon color="action" />
                <Typography variant="subtitle2" noWrap>
                  ການກັ່ນຕອງຕາມວັນທີ
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <DatePicker
                  label="ວັນທີເລີ່ມຕົ້ນ"
                  value={ctrl.dateFilter.startDate}
                  onChange={(newValue: any) =>
                    ctrl.handleDateFilterChange({
                      ...ctrl.dateFilter,
                      startDate: newValue,
                    })
                  }
                  format="YYYY/MM/DD"
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: { xs: "100%", sm: 170 },
                      },
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
                  format="YYYY/MM/DD"
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: { xs: "100%", sm: 170 },
                      },
                    },
                  }}
                />
              </Box>

              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                sx={{
                  textTransform: "none",
                  alignSelf: { xs: "flex-start", sm: "center" },
                }}
                onClick={ctrl.resetFilters}
                size="small"
              >
                ລ້າງຕົວກອງ
              </Button>
            </Stack>
          </LocalizationProvider>

          {!isSmall && (
            <Divider
              orientation={isMobile ? "horizontal" : "vertical"}
              flexItem
            />
          )}

          <TextField
            fullWidth={isMobile}
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
              width: { xs: "100%", md: "auto" },
              minWidth: { sm: "200px" },
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
