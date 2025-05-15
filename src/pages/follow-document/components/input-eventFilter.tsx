import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { getEventChipColor } from "../../../utils/constant/eventChipColor";

interface EventFilterProps {
  eventFilter: string;
  handleEventFilterChange: (value: string) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  eventFilter,
  handleEventFilterChange,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel id="event-filter-label">ກັ່ນຕອງຕາມ Events</InputLabel>
        <Select
          labelId="event-filter-label"
          id="event-filter"
          value={eventFilter || ""}
          label="ກັ່ນຕອງຕາມເຫດການ"
          onChange={(e: SelectChangeEvent) =>
            handleEventFilterChange(e.target.value)
          }
        >
          <MenuItem value="">
            <em style={{ fontWeight: 700 }}>All Events</em>
          </MenuItem>
          <MenuItem value="Create">Create</MenuItem>
          <MenuItem value="Upload">Upload</MenuItem>
          <MenuItem value="Update">Update</MenuItem>
          <MenuItem value="Delete">Delete</MenuItem>
          <MenuItem value="AddMember">AddMember</MenuItem>
          <MenuItem value="RemoveMember">RemoveMember</MenuItem>
          <MenuItem value="Restore">Restore</MenuItem>
          <MenuItem value="MoveFile">MoveFile</MenuItem>
          <MenuItem value="Download">Download</MenuItem>
        </Select>
      </FormControl>

      {eventFilter && (
        <Chip
          label={`Event: ${eventFilter}`}
          onDelete={() => handleEventFilterChange("")}
          sx={{
            backgroundColor: getEventChipColor(eventFilter),
            color: eventFilter === "Update" ? "black" : "white",
          }}
        />
      )}
    </Box>
  );
};

export default EventFilter;
