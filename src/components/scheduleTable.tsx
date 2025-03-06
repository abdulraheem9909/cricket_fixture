import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Tournament } from "@/lib/interfaces";

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(isoWeek);

interface ScheduleTableProps {
  tournament: Tournament;
}

interface Week {
  weekNumber: number;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
}

interface Availability {
  teamId: number;
  weekNumber: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
}

export default function ScheduleTable({ tournament }: ScheduleTableProps) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [offRequests, setOffRequests] = useState<Availability[]>([]);
  const [serialMap, setSerialMap] = useState<Record<number, number>>({}); // Map serial number to teamId
  const [selectedSerial, setSelectedSerial] = useState<Record<number, number>>(
    {}
  ); /// For displaying the selected serial number

  console.log({ offRequests });
  console.log({ availability });

  // Generate weeks with start, end, and week number
  useEffect(() => {
    if (!tournament) return;

    const startDate = dayjs.utc(tournament.startDate);
    const endDate = dayjs.utc(tournament.endDate);

    const weeksArray: Week[] = [];
    let currentWeekStart = startDate.startOf("isoWeek");
    let weekNumber = 1;

    while (currentWeekStart.isBefore(endDate)) {
      const weekEnd = currentWeekStart.add(6, "days");
      weeksArray.push({
        weekNumber,
        start: currentWeekStart,
        end: weekEnd,
      });

      currentWeekStart = currentWeekStart.add(1, "week");
      weekNumber++;
    }

    setWeeks(weeksArray);
  }, [tournament]);

  // Generate serial number for each team in the tournament
  useEffect(() => {
    const newSerialMap: Record<number, number> = {};
    let counter = 1;
    tournament.divisions?.forEach((division) => {
      division.teams.forEach((team) => {
        newSerialMap[counter] = team.id; // Mapping serial number to teamId
        counter++;
      });
    });
    setSerialMap(newSerialMap);
  }, [tournament]);

  // Handle availability change (checkbox toggle)
  const handleAvailabilityChange = (teamId: number, week: Week) => {
    const { weekNumber, start, end } = week;

    // Check if the entry already exists in the availability array
    const existingEntryIndex = availability.findIndex(
      (entry) => entry.teamId === teamId && entry.weekNumber === weekNumber
    );

    if (existingEntryIndex === -1) {
      // If the entry doesn't exist, add it to the array (checkbox is checked)
      const newEntry = {
        teamId,
        weekNumber,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
      setAvailability((prev) => [...prev, newEntry]);
    } else {
      // If the entry exists, remove it from the array (checkbox is unchecked)
      setAvailability((prev) =>
        prev.filter((entry, index) => index !== existingEntryIndex)
      );
    }
  };

  // Handle serial number selection for off request
  const handleSerialNumberChange = (
    weekDate: string,
    serialNumber: number,
    week: Week
  ) => {
    const { weekNumber, start, end } = week;

    const teamId = serialMap[serialNumber]; // Get the teamId from serial number
    if (teamId) {
      const key = `${weekDate}`;
      // Check if the entry already exists in the availability array
      const existingEntryIndex = offRequests.findIndex(
        (entry) => entry.teamId === teamId && entry.weekNumber === weekNumber
      );

      if (existingEntryIndex === -1) {
        // If the entry doesn't exist, add it to the array (checkbox is checked)
        const newEntry = {
          teamId,
          weekNumber,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        };
        setOffRequests((prev) => [...prev, newEntry]);
      } else {
        // If the entry exists, remove it from the array (checkbox is unchecked)
        setOffRequests((prev) =>
          prev.filter((entry, index) => index !== existingEntryIndex)
        );
      }
      setSelectedSerial((prev) => ({
        ...prev,
        [key]: serialNumber,
      })); // Update the selected serial for display
    }
  };

  // Render table rows with teams and their availability
  const renderRows = () =>
    tournament.divisions?.flatMap((division) =>
      division.teams.map((team) => {
        const serialNumber = Object.keys(serialMap).find(
          (key) => serialMap[parseInt(key)] === team.id
        ); // Find serial number for the team
        return (
          <TableRow key={team.id}>
            <TableCell
              sx={{
                position: "sticky",
                left: 0,
                zIndex: 5,
                minWidth: 50,
                background: "white",
              }}
            >
              {serialNumber} {/* Display serial number */}
            </TableCell>

            <TableCell
              sx={{
                position: "sticky",
                left: 50,
                zIndex: 5,
                minWidth: 150,
                background: "white",
              }}
            >
              {team.name}
            </TableCell>

            <TableCell
              sx={{
                position: "sticky",
                left: 200,
                zIndex: 5,
                minWidth: 150,
                background: "white",
              }}
            >
              {team.homeGround}
            </TableCell>

            {/* Render Weeks columns with checkboxes for availability */}
            {weeks.map((week) => {
              const weekStr = week.start.format("YYYY-MM-DD");

              // Check if the team has availability data for this week
              const isChecked = availability.some(
                (entry) =>
                  entry.teamId === team.id &&
                  entry.weekNumber === week.weekNumber
              );

              return (
                <TableCell key={weekStr} align="center">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleAvailabilityChange(team.id, week)}
                    color="primary"
                  />
                </TableCell>
              );
            })}
          </TableRow>
        );
      })
    );

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "100vw",
        maxHeight: "750px", // Fixed height for scrolling
        overflowX: "auto",
        overflowY: "auto", // Vertical scrolling enabled
        boxShadow: 3,
      }}
    >
      <Table stickyHeader aria-label="schedule table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#D83030" }}>
            {/* Serial Number Column Header */}
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "#D83030",
                position: "sticky",
                left: 0,
                zIndex: 6,
                minWidth: 50,
              }}
            >
              #
            </TableCell>

            {/* Team Column Header */}
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "#D83030",
                position: "sticky",
                left: 50,
                zIndex: 6,
                minWidth: 150,
              }}
            >
              Team
            </TableCell>

            {/* Home Ground Column Header */}
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "#D83030",
                position: "sticky",
                left: 200,
                zIndex: 6,
                minWidth: 150,
              }}
            >
              Home Ground
            </TableCell>

            {/* Week Columns Header */}
            {weeks.map((week) => (
              <TableCell
                key={week.weekNumber}
                align="center"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#D83030",
                  minWidth: 200, // Increased width for better visibility
                }}
              >
                <Box>
                  <div>Week {week.weekNumber}</div>
                  <Typography variant="caption" display="block">
                    {week.start.format("MMM DD")} - {week.end.format("MMM DD")}
                  </Typography>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows()}

          {/* Off Request Row */}
          <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
            <TableCell
              colSpan={3}
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "#D83030",
                position: "sticky",
                bottom: 0,
                zIndex: 7,
                left: 0,
                minWidth: 150,
              }}
            >
              Off Requests
            </TableCell>
            {weeks.map((week) => {
              const weekStr = week.start.format("YYYY-MM-DD");
              return (
                <TableCell
                  key={weekStr}
                  align="center"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#D83030",
                    position: "sticky",
                    bottom: 0,
                    zIndex: 6,
                    minWidth: 150,
                  }}
                >
                  <FormControl>
                    <InputLabel sx={{ fontSize: "12px" }}>Off Team</InputLabel>
                    <Select
                      value={selectedSerial[weekStr] || ""}
                      onChange={(e) =>
                        handleSerialNumberChange(
                          weekStr,
                          parseInt(e.target.value, 10),
                          week
                        )
                      }
                      label="Off Team"
                      sx={{
                        backgroundColor: "white", // White background
                        fontSize: "12px", // Smaller font size
                        width: "120px", // Adjust width
                        height: "44px", // Adjust height
                        padding: "2px", // Reduce padding
                        borderRadius: "6px", // Optional: rounder edges
                        "& .MuiSelect-select": {
                          padding: "4px", // Smaller inner padding
                          minHeight: "unset", // Override default MUI height
                        },
                        "& fieldset": {
                          borderColor: "#ccc", // Default border color
                        },
                        "&:hover fieldset": {
                          borderColor: "#aaa", // Darker border on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white !important", // White border on focus (removes blue outline)
                        },
                      }}
                    >
                      {Object.keys(serialMap).map((serialNumber) => (
                        <MenuItem key={serialNumber} value={serialNumber}>
                          {serialNumber}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
