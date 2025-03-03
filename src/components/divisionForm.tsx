import { useState } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import axios from "axios";

export default function DivisionForm({ tournamentId }: { tournamentId: string }) {
  const [division, setDivision] = useState({ name: "" });
  const [teams, setTeams] = useState([{ name: "", homeGround: "", weekOff: null, homeDates: [] }]);

  const handleDivisionSubmit = async () => {
    const response = await axios.post("/api/divisions", { ...division, tournamentId });
    console.log("Created Division:", response.data);
  };

  const handleTeamSubmit = async (index: number) => {
    await axios.post("/api/teams", { ...teams[index], divisionId: "division-id-placeholder" });
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mt: 5 }}>Add Divisions</Typography>
      <TextField label="Division Name" fullWidth margin="normal" onChange={(e) => setDivision({ name: e.target.value })} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleDivisionSubmit}>Create Division</Button>

      <Typography variant="h5" sx={{ mt: 5 }}>Add Teams</Typography>
      {teams.map((team, index) => (
        <Container key={index} sx={{ mb: 2 }}>
          <TextField label="Team Name" fullWidth margin="normal" onChange={(e) => {
            const updatedTeams = [...teams];
            updatedTeams[index].name = e.target.value;
            setTeams(updatedTeams);
          }} />
          <TextField label="Home Ground" fullWidth margin="normal" onChange={(e) => {
            const updatedTeams = [...teams];
            updatedTeams[index].homeGround = e.target.value;
            setTeams(updatedTeams);
          }} />
          <Button variant="contained" onClick={() => handleTeamSubmit(index)}>Add Team</Button>
        </Container>
      ))}
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setTeams([...teams, { name: "", homeGround: "", weekOff: null, homeDates: [] }])}>Add More Teams</Button>
    </Container>
  );
}
