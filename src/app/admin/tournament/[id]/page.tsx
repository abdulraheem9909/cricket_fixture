"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Alert, Typography, Box } from "@mui/material";
import React from "react";
import { Tournament } from "@/lib/interfaces";
import ScheduleTable from "../../../../components/scheduleTable";

export default function TournamentPage({ params }: { params: { id: string } }) {
  // Properly unwrap the params promise
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/tournaments/${id}`);
        setTournament(response.data);
      } catch (err) {
        setError("Failed to load tournament data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Use the unwrapped id in dependencies

  if (!mounted) return null; // Prevent hydration mismatch
  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!tournament)
    return <Alert severity="warning">Tournament not found</Alert>;

  return (
    <Box>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            margin: 4,
            background: "#d83030",
            color: "white",
            paddingY: 2,
            paddingX: 3,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 2,
            width: "100%",
          }}
          maxWidth="lg"
        >
          Team Availablity
        </Typography>
      </Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        {tournament.name} Schedule
      </Typography>
      <ScheduleTable tournament={tournament} />
    </Box>
  );
}
