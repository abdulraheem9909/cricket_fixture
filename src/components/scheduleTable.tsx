"use client";

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
  TextField,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Tournament } from "@/lib/interfaces";

dayjs.extend(weekOfYear);
interface ScheduleTableProps {
  tournament: Tournament;
}

export default function ScheduleTable({ tournament }: ScheduleTableProps) {
  const [weeks, setWeeks] = useState<dayjs.Dayjs[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [offRequests, setOffRequests] = useState<Record<string, string>>({});

  // Generate weeks using day.js
  useEffect(() => {
    if (!tournament) return;

    const start = dayjs(tournament.startDate);
    const end = dayjs(tournament.endDate);
    const weeksArray: dayjs.Dayjs[] = [];

    let currentWeek = start.startOf("week");
    while (currentWeek.isBefore(end.endOf("week"))) {
      weeksArray.push(currentWeek);
      currentWeek = currentWeek.add(1, "week");
    }

    setWeeks(weeksArray);
  }, [tournament]);

  // Handle availability changes with Axios
  const handleAvailabilityChange = async (teamId: number, weekDate: string) => {
    const key = `${teamId}-${weekDate}`;
    const newState = !availability[key];

    try {
      await axios.post("/api/availability", {
        teamId,
        date: weekDate,
        available: newState,
      });

      setAvailability((prev) => ({ ...prev, [key]: newState }));
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  // Render team rows
  const renderRows = () =>
    tournament.divisions?.flatMap((division) =>
      division.teams.map((team) => (
        <TableRow key={team.id}>
          <TableCell>{team.name}</TableCell>
          <TableCell>{team.homeGround}</TableCell>
          {weeks.map((week) => {
            const weekStr = week.format("YYYY-MM-DD");
            const isAvailable = team.homeGroundAvailabilities.some((av) =>
              dayjs(av.date).isSame(week, "week")
            );

            return (
              <TableCell key={weekStr} align="center">
                <Checkbox
                  checked={availability[`${team.id}-${weekStr}`] ?? isAvailable}
                  onChange={() => handleAvailabilityChange(team.id, weekStr)}
                  color="primary"
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))
    );

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: "100vw", overflowX: "auto" }}
    >
      <Table stickyHeader aria-label="schedule table">
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Home Ground</TableCell>
            {weeks.map((week, index) => (
              <TableCell key={index} align="center">
                <Box>
                  <div>{week.format("MMM DD")}</div>
                  <Typography sx={{fontWeight:"bold"}}>{index + 1}</Typography>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows()}
          <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
            <TableCell colSpan={2}>Off Requests</TableCell>
            {weeks.map((week) => {
              const weekStr = week.format("YYYY-MM-DD");
              return (
                <TableCell key={weekStr} align="center">
                  <TextField
                    value={offRequests[weekStr] || ""}
                    onChange={(e) =>
                      setOffRequests((prev) => ({
                        ...prev,
                        [weekStr]: e.target.value,
                      }))
                    }
                    inputProps={{
                      style: { textAlign: "center", width: "50px" },
                      pattern: "[0-9,]*",
                    }}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
