"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Typography, Box, Button } from "@mui/material";
import React from "react";
import { Availability, Tournament, Week } from "@/lib/interfaces";
import ScheduleTable from "../../../../components/scheduleTable";
import Toaster from "@/components/common/Alert";

export default function TournamentPage({ params }: { params: { id: string } }) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [offRequests, setOffRequests] = useState<Availability[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [tournamentOffWeek, setTournamentOffWeek] = useState<number | null>(
    null
  );
  // Properly unwrap the params promise
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/tournaments/${id}`);
        console.log("response", response.data.offRequests);

        setTournament(response.data.tournament);
        setTournamentOffWeek(
          response.data.tournament.tournamentOffWeek || null
        );
        setAvailability(response.data.availability);
        setOffRequests(response.data.offRequests);
      } catch (err) {
        setLoading(false);
        setError("Failed to load tournament data");
      }
    };

    fetchData();
  }, [id]);

  if (!mounted) return null; // Prevent hydration mismatch
  if (error) return <Alert severity="error">{error}</Alert>;

  const createFixture = async () => {
    try {
      setLoading(true);
      await axios.post("/api/schedule", {
        availability,
        offRequests,
        id: +id,
        tournamentOffWeek,
      });
      setToast({
        open: true,
        message: "Fixture created successfully!",
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message: "Something went wrong!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
      <Box
        sx={{
          justifyContent: "space-between",
          display: "flex",
          width: "100%",
          alignItems: "center",
          marginY: 2,
        }}
      >
        {" "}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          {tournament?.name && `  ${tournament?.name} Schedule`}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={createFixture}
          sx={{ marginX: 2, bgcolor: "#d83030" }}
          disabled={
            !availability.length || !offRequests.length || !tournamentOffWeek
          }
        >
          Create Fixture
        </Button>
      </Box>

      <ScheduleTable
        tournament={tournament}
        availability={availability}
        setAvailability={setAvailability}
        offRequests={offRequests}
        setOffRequests={setOffRequests}
        weeks={weeks}
        setWeeks={setWeeks}
        loading={loading}
        setLoading={setLoading}
        tournamentOffWeek={tournamentOffWeek}
        setTournamentOffWeek={setTournamentOffWeek}
      />

      <Toaster
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
