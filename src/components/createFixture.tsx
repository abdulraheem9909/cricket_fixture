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
  MenuItem,
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
  const [teams, setTeams] = useState<
    { name: string; homeGround: string; division: string }[]
  >([]);
  const [errors, setErrors] = useState({} as Record<string, string>);

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
    if (numDivisions <= 0) newErrors.numDivisions = "Enter at least 1 division";
    divisions.forEach((division, index) => {
      if (!division.name.trim()) newErrors[`div-${index}-name`] = "Required";
      if (!division.numTeams || division.numTeams <= 0)
        newErrors[`div-${index}-teams`] = "Must be greater than 0";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTeams = () => {
    const newErrors: Record<string, string> = {};
    teams.forEach((team, index) => {
      if (!team.name.trim())
        newErrors[`team-${index}-name`] = "Team name is required";
      if (!team.homeGround.trim())
        newErrors[`team-${index}-ground`] = "Home ground is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateTournament()) return;
    if (activeStep === 1 && !validateDivisions()) return;
    if (activeStep === 2 && !validateTeams()) return;
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleTournamentSubmit = async () => {
    // const response = await axios.post("/api/tournaments", {
    //   ...tournament,
    //   weeks: +tournament.weeks,
    // });
    // console.log("Tournament Created:", response.data);
    handleNext();
  };

  const handleDivisionSubmit = async () => {
    try {
      // Submit tournament creation request
      const tournamentResponse = await axios.post("/api/tournaments", {
        ...tournament,
        weeks: +tournament.weeks,
      });
      const tournamentId = tournamentResponse.data.id; // Assuming the response includes the `id`

      console.log("Tournament Created:", tournamentResponse.data);

      // Now submit the divisions with the tournamentId
      const divisionsData = divisions.map((division) => ({
        ...division,
        tournamentId, // Attach the tournamentId to each division
      }));

      console.log(divisionsData);

      const divisionResponse = await axios.post(
        "/api/divisions",
        divisionsData
      );
      console.log("Divisions Created:", divisionResponse.data);

      // Proceed to next step
      handleNext();
    } catch (error) {
      console.error("Error creating tournament or divisions:", error);
    }
  };
  const handleTeamsSubmit = async () => {
    if (!validateTeams()) return;
    try {
      await axios.post("/api/teams", { teams });
      alert("Tournament Setup Completed!");
    } catch (error) {
      console.error("Error creating teams:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 5 }}>
        Create Fixture
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Typography variant="h5">Tournament Details</Typography>
          <Card
            sx={{
              marginY: "16px",
            }}
          >
            <CardContent>
              <TextField
                label="Tournament Name"
                fullWidth
                margin="normal"
                value={tournament.name}
                onChange={(e) => {
                  setTournament({ ...tournament, name: e.target.value });
                  setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
                }}
                error={!!errors.name}
                helperText={errors.name}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  sx={{ width: "100%", mt: 2 }}
                  label="Start Date"
                  value={tournament.startDate}
                  onChange={(newValue) => {
                    setTournament({
                      ...tournament,
                      startDate: newValue || dayjs(),
                    });
                  }}
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
                  setErrors((prevErrors) => ({ ...prevErrors, weeks: "" }));
                }}
                error={!!errors.weeks}
                helperText={errors.weeks}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleTournamentSubmit}
              >
                Next
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Typography variant="h5">Add Divisions</Typography>
          <Card
            sx={{
              marginY: "16px",
            }}
          >
            <CardContent>
              <TextField
                type="number"
                label="Number of Divisions"
                fullWidth
                margin="normal"
                value={numDivisions}
                onChange={(e) => setNumDivisions(+e.target.value)}
                error={!!errors.numDivisions}
                helperText={errors.numDivisions}
              />
              {Array.from({ length: numDivisions }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    padding: "0px 16px",
                  }}
                >
                  <TextField
                    variant="standard"
                    label={`Division ${index + 1} Name`}
                    fullWidth
                    margin="normal"
                    value={divisions[index]?.name || ""}
                    onChange={(e) => {
                      const updatedDivisions = [...divisions];
                      updatedDivisions[index] = {
                        ...updatedDivisions[index],
                        name: e.target.value,
                      };
                      setDivisions(updatedDivisions);
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
                      const updatedDivisions = [...divisions];
                      updatedDivisions[index] = {
                        ...updatedDivisions[index],
                        numTeams: +e.target.value,
                      };
                      setDivisions(updatedDivisions);
                    }}
                    error={!!errors[`div-${index}-teams`]}
                    helperText={errors[`div-${index}-teams`]}
                  />
                </Box>
              ))}

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleDivisionSubmit}
              >
                Next
              </Button>
              <Button
                variant="outlined"
                sx={{ mt: 2, mr: 2 }}
                onClick={handleBack}
              >
                Back
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeStep === 2 && (
        <Box>
          <Typography variant="h5">Add Teams & Home Ground</Typography>
          {divisions.map((division, divIndex) =>
            Array.from({ length: division.numTeams }).map((_, teamIndex) => {
              const index = divIndex * 10 + teamIndex;
              return (
                <div key={index}>
                  <TextField
                    label={`Team ${teamIndex + 1} Name`}
                    fullWidth
                    margin="normal"
                    value={teams[index]?.name || ""}
                    onChange={(e) => {
                      const updatedTeams = [...teams];
                      updatedTeams[index] = {
                        ...updatedTeams[index],
                        name: e.target.value,
                        division: division.name,
                      };
                      setTeams(updatedTeams);
                    }}
                    error={!!errors[`team-${index}-name`]}
                    helperText={errors[`team-${index}-name`]}
                  />
                  <TextField
                    label="Home Ground"
                    fullWidth
                    margin="normal"
                    value={teams[index]?.homeGround || ""}
                    onChange={(e) => {
                      const updatedTeams = [...teams];
                      updatedTeams[index] = {
                        ...updatedTeams[index],
                        homeGround: e.target.value,
                      };
                      setTeams(updatedTeams);
                    }}
                    error={!!errors[`team-${index}-ground`]}
                    helperText={errors[`team-${index}-ground`]}
                  />
                </div>
              );
            })
          )}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleTeamsSubmit}
          >
            Finish
          </Button>
          <Button variant="outlined" sx={{ mt: 2, mr: 2 }} onClick={handleBack}>
            Back
          </Button>
        </Box>
      )}
    </Container>
  );
}
