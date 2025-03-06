export interface HomeGroundAvailability {
  id: number;
  week: number;
  teamId: number;
}

export interface Team {
  id: number;
  name: string;
  homeGround: string;
  divisionId: number;
  homeGroundAvailabilities: HomeGroundAvailability[];
}

export interface Division {
  id: number;
  name: string;
  tournamentId: number;
  numTeams: number;
  teams: Team[];
}

export interface Tournament {
  id: number;
  name: string;
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  weeks: number;
  divisions: Division[];
}

export interface homeGroundAvailabilities {
  homeGroundAvailabilities: Array<{ date: string }>;
}
