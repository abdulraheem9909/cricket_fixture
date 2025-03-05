"use client";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";

const steps = ["Tournament Details", "Divisions", "Teams & Home Ground"];

export default function CreateFixture() {
  const [activeStep, setActiveStep] = useState(0);
  const [tournament, setTournament] = useState({
    name: "",
    startDate: dayjs(),
    weeks: "",
  });
  const [numDivisions, setNumDivisions] = useState(0);
  const [divisions, setDivisions] = useState<
    { name: string; numTeams: number }[]
  >([]);
  const [createdDivisions, setCreatedDivisions] = useState<
    { id: string; name: string; numTeams: number }[]
  >([]);
  const [teams, setTeams] = useState<
    { name: string; homeGround: string; divisionId: string }[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateTournament = () => {
    const newErrors: Record<string, string> = {};
    if (!tournament.name.trim()) newErrors.name = "Tournament name is required";
    if (!tournament.weeks || Number(tournament.weeks) <= 0)
      newErrors.weeks = "Number of weeks must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDivisions = () => {
    const newErrors: Record<string, string> = {};

    // Validate number of divisions
    if (numDivisions <= 0) {
      newErrors.numDivisions = "Enter at least 1 division";
    }

    // Validate divisions array matches numDivisions
    if (divisions.length !== numDivisions) {
      newErrors.general = "Division count mismatch - please refresh the form";
      setErrors(newErrors);
      return false;
    }

    // Validate each division
    for (let index = 0; index < numDivisions; index++) {
      const division = divisions[index];

      if (!division) {
        newErrors[`div-${index}-name`] = "Division configuration missing";
        continue;
      }

      if (!division.name.trim()) {
        newErrors[`div-${index}-name`] = "Division name required";
      }

      if (!division.numTeams || division.numTeams <= 0) {
        newErrors[`div-${index}-teams`] = "Must have at least 1 team";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTeams = () => {
    const newErrors: Record<string, string> = {};

    createdDivisions.forEach((division) => {
      const divisionTeams = teams.filter((t) => t.divisionId === division.id);

      divisionTeams.forEach((team, teamIndex) => {
        if (!team.name.trim()) {
          newErrors[`team-${division.id}-${teamIndex}-name`] =
            "Team name required";
        }
        if (!team.homeGround.trim()) {
          newErrors[`team-${division.id}-${teamIndex}-ground`] =
            "Home ground required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step handlers
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Submission handlers
  const handleTournamentSubmit = async () => {
    if (activeStep === 0 && !validateTournament()) return;
    handleNext();
  };

  const handleDivisionSubmit = async () => {
    if (activeStep === 1 && !validateDivisions()) return;
    try {
      // Create tournament
      const tournamentResponse = await axios.post("/api/tournaments", {
        ...tournament,
        weeks: +tournament.weeks,
      });

      // Create divisions
      const divisionsData = divisions.map((division) => ({
        ...division,
        tournamentId: tournamentResponse.data.id,
      }));

      const divisionResponse = await axios.post(
        "/api/divisions",
        divisionsData
      );
      const newDivisions = divisionResponse.data.divisions;
      setCreatedDivisions(newDivisions);

      // Initialize teams with division IDs
      const initialTeams = newDivisions.flatMap(
        (division: { id: string; name: string; numTeams: number }) =>
          Array.from({ length: division.numTeams }, () => ({
            name: "",
            homeGround: "",
            divisionId: division.id,
          }))
      );
      setTeams(initialTeams);

      handleNext();
    } catch (error) {
      console.error("Error creating divisions:", error);
    }
  };

  const handleTeamsSubmit = async () => {
    if (activeStep === 2 && !validateTeams()) return;
    try {
      const response = await axios.post("/api/teams", { teams });
      console.log("Teams created:", response.data);
      alert(`${response.data.count} teams created successfully!`);
    } catch (error) {
      console.error("Error creating teams:", error);
    }
  };
  const handleSetNumDivisions = (value: number) => {
    setErrors((prev) => ({
      ...prev,
      numDivisions: "",
    }));
    setNumDivisions(value);

    // Reset or truncate divisions array
    if (value < divisions.length) {
      setDivisions(divisions.slice(0, value));
    } else {
      setDivisions([
        ...divisions,
        ...Array.from({ length: value - divisions.length }, () => ({
          name: "",
          numTeams: 0,
        })),
      ]);
    }
  };

  console.log("errors", errors);

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        sx={{
          mt: 5,
          background: "#d83030",
          color: "white",
          paddingY: 2,
          paddingX: 3,
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        Create Fixture
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Tournament Details */}
      {activeStep === 0 && (
        <Box>
          <Typography variant="h5" sx={{ marginY: 2 }}>
            Tournament Details
          </Typography>
          <Card
            sx={{ padding: 2, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}
          >
            <CardContent>
              <TextField
                label="Tournament Name"
                fullWidth
                margin="normal"
                value={tournament.name}
                onChange={(e) => {
                  setTournament({ ...tournament, name: e.target.value });
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                error={!!errors.name}
                helperText={errors.name}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  sx={{ width: "100%", mt: 2 }}
                  label="Start Date"
                  value={tournament.startDate}
                  onChange={(newValue) =>
                    setTournament({
                      ...tournament,
                      startDate: newValue || dayjs(),
                    })
                  }
                />
              </LocalizationProvider>
              <TextField
                type="number"
                label="Number of Weeks"
                fullWidth
                margin="normal"
                value={tournament.weeks}
                onChange={(e) => {
                  setTournament({ ...tournament, weeks: e.target.value });
                  setErrors((prev) => ({ ...prev, weeks: "" }));
                }}
                error={!!errors.weeks}
                helperText={errors.weeks}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  sx={{ mt: 2, background: "#d83030" }}
                  onClick={handleTournamentSubmit}
                >
                  Next
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Step 2: Divisions */}
      {activeStep === 1 && (
        <Box>
          <Typography variant="h5" sx={{ marginY: 2 }}>
            Add Divisions
          </Typography>
          <Card
            sx={{ padding: 2, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}
          >
            <CardContent>
              <TextField
                type="number"
                label="Number of Divisions"
                fullWidth
                margin="normal"
                value={numDivisions}
                onChange={(e) => handleSetNumDivisions(+e.target.value)}
                error={!!errors.numDivisions}
                helperText={errors.numDivisions}
              />
              {Array.from({ length: numDivisions }).map((_, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 1, padding: "0px 16px" }}
                >
                  <TextField
                    variant="standard"
                    label={`Division ${index + 1} Name`}
                    fullWidth
                    margin="normal"
                    value={divisions[index]?.name || ""}
                    onChange={(e) => {
                      setErrors((prev) => ({
                        ...prev,
                        [`div-${index}-name`]: "",
                      }));
                      const updated = [...divisions];
                      updated[index] = {
                        ...updated[index],
                        name: e.target.value,
                      };
                      setDivisions(updated);
                    }}
                    error={!!errors[`div-${index}-name`]}
                    helperText={errors[`div-${index}-name`]}
                  />
                  <TextField
                    variant="standard"
                    type="number"
                    label="Number of Teams"
                    fullWidth
                    margin="normal"
                    value={divisions[index]?.numTeams || ""}
                    onChange={(e) => {
                      setErrors((prev) => ({
                        ...prev,
                        [`div-${index}-teams`]: "",
                      }));
                      const updated = [...divisions];
                      updated[index] = {
                        ...updated[index],
                        numTeams: +e.target.value,
                      };
                      setDivisions(updated);
                    }}
                    error={!!errors[`div-${index}-teams`]}
                    helperText={errors[`div-${index}-teams`]}
                  />
                </Box>
              ))}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, color: "#d83030", borderColor: "#d83030" }}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{ mt: 2, background: "#d83030" }}
                  onClick={handleDivisionSubmit}
                >
                  Next
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Step 3: Teams & Home Ground */}
      {activeStep === 2 && (
        <Box>
          <Typography variant="h5" sx={{ marginY: 2 }}>
            Teams & Home Ground
          </Typography>
          {createdDivisions.map((division) => (
            <Card
              key={division.id}
              sx={{
                padding: 2,
                marginBottom: 2,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {division.name}
              </Typography>

              {Array.from({ length: division.numTeams }).map((_, teamIndex) => {
                
                const team = teams.find(
                  (t, idx) =>
                    t.divisionId === division.id &&
                    idx ===
                      teams.findIndex((t) => t.divisionId === division.id) +
                        teamIndex
                );
                console.log("teams",teams);
                console.log("team",team);


                return (
                  <Box
                    key={`${division.id}-${teamIndex}`}
                    sx={{ display: "flex", gap: 1, padding: "0px 16px" }}
                  >
                    <TextField
                      variant="standard"
                      label={`Team ${teamIndex + 1}`}
                      fullWidth
                      margin="normal"
                      value={team?.name || ""}
                      onChange={(e) => {
                        const updated = teams.map((t) =>
                          t.divisionId === division.id &&
                          teams.indexOf(t) ===
                            teams.findIndex(
                              (t) => t.divisionId === division.id
                            ) +
                              teamIndex
                            ? { ...t, name: e.target.value }
                            : t
                        );
                        setTeams(updated);
                        setErrors((prev) => ({
                          ...prev,
                          [`team-${division.id}-${teamIndex}-name`]: "",
                        }));
                      }}
                      error={!!errors[`team-${division.id}-${teamIndex}-name`]}
                      helperText={
                        errors[`team-${division.id}-${teamIndex}-name`]
                      }
                    />
                    <TextField
                      variant="standard"
                      label="Ground name"
                      fullWidth
                      margin="normal"
                      value={team?.homeGround || ""}
                      onChange={(e) => {
                        const updated = teams.map((t) =>
                          t.divisionId === division.id &&
                          teams.indexOf(t) ===
                            teams.findIndex(
                              (t) => t.divisionId === division.id
                            ) +
                              teamIndex
                            ? { ...t, homeGround: e.target.value }
                            : t
                        );
                        setTeams(updated);
                        // Clear specific error
                        setErrors((prev) => ({
                          ...prev,
                          [`team-${division.id}-${teamIndex}-ground`]: "",
                        }));
                      }}
                      error={
                        !!errors[`team-${division.id}-${teamIndex}-ground`]
                      }
                      helperText={
                        errors[`team-${division.id}-${teamIndex}-ground`]
                      }
                    />
                  </Box>
                );
              })}
            </Card>
          ))}

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              sx={{ mt: 2, color: "#d83030", borderColor: "#d83030" }}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 2, background: "#d83030" }}
              onClick={handleTeamsSubmit}
            >
              Finish
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
