import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  FilterAlt as FilterAltIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import { Dayjs } from "dayjs";

const DateRangeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "white",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

interface DateFilterType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface DateRangeHeaderProps {
  dateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
  resetFilters: () => void;
}

const DateRangeHeader: React.FC<DateRangeHeaderProps> = ({
  dateFilter,
  onDateFilterChange,
  resetFilters,
}) => {
  const handleDateFilterChange = (newFilter: DateFilterType) => {
    onDateFilterChange(newFilter);
  };

  return (
    <DateRangeContainer sx={{ borderRadius: "12px" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterAltIcon color="action" />

          <DatePicker
            label="ວັນທີເລີ່ມຕົ້ນ"
            value={dateFilter.startDate}
            onChange={(newValue: any) =>
              handleDateFilterChange({
                ...dateFilter,
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
            value={dateFilter.endDate}
            onChange={(newValue: any) =>
              handleDateFilterChange({
                ...dateFilter,
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
            onClick={resetFilters}
            size="small"
          >
            ລ້າງຕົວກອງ
          </Button>

          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            (ເດືອນ/ວັນ/ປີ)
          </Typography>
        </Stack>
      </LocalizationProvider>
    </DateRangeContainer>
  );
};

export default DateRangeHeader;
