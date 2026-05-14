import {
  Fixture, TeamForm, HeadToHead, Lineup, Transfer,
  PlayerStats, Prediction, MatchAnalysis
} from '@betintel/shared';

// ---- Times reais com dados corretos ----
const mockTeams = {
  flamengo:   { id: 127,  name: 'Flamengo',        code: 'FLA', logo: 'https://media.api-sports.io/football/teams/127.png',  country: 'Brazil' },
  palmeiras:  { id: 121,  name: 'Palmeiras',        code: 'PAL', logo: 'https://media.api-sports.io/football/teams/121.png',  country: 'Brazil' },
  manchester: { id: 33,   name: 'Manchester United',code: 'MUN', logo: 'https://media.api-sports.io/football/teams/33.png',   country: 'England' },
  liverpool:  { id: 40,   name: 'Liverpool',        code: 'LIV', logo: 'https://media.api-sports.io/football/teams/40.png',   country: 'England' },
  barcelona:  { id: 529,  name: 'Barcelona',        code: 'BAR', logo: 'https://media.api-sports.io/football/teams/529.png',  country: 'Spain' },
  realMadrid: { id: 541,  name: 'Real Madrid',      code: 'REA', logo: 'https://media.api-sports.io/football/teams/541.png',  country: 'Spain' },
  botafogo:   { id: 1359, name: 'Botafogo',         code: 'BOT', logo: 'https://media.api-sports.io/football/teams/1359.png', country: 'Brazil' },
  corinthians:{ id: 131,  name: 'Corinthians',      code: 'COR', logo: 'https://media.api-sports.io/football/teams/131.png',  country: 'Brazil' },
};

// ---- Ligas com logos corretos ----
const mockLeagues = {
  brasileirao: {
    id: 71, name: 'Brasileirão Série A', type: 'League',
    logo: 'https://media.api-sports.io/football/leagues/71.png',
    country: { name: 'Brazil', code: 'BR', flag: 'https://media.api-sports.io/flags/br.svg' },
    season: { year: 2025, start: '2025-04-12', end: '2025-12-07', current: true },
  },
  premierLeague: {
    id: 39, name: 'Premier League', type: 'League',
    logo: 'https://media.api-sports.io/football/leagues/39.png',
    country: { name: 'England', code: 'GB', flag: 'https://media.api-sports.io/flags/gb.svg' },
    season: { year: 2024, start: '2024-08-16', end: '2025-05-25', current: true },
  },
  laLiga: {
    id: 140, name: 'La Liga', type: 'League',
    logo: 'https://media.api-sports.io/football/leagues/140.png',
    country: { name: 'Spain', code: 'ES', flag: 'https://media.api-sports.io/flags/es.svg' },
    season: { year: 2024, start: '2024-08-16', end: '2025-05-25', current: true },
  },
};

// ---- Estádios corretos para cada time ----
const venues = {
  maracana:    { name: 'Maracanã',         city: 'Rio de Janeiro', capacity: 78838 },
  allianz:     { name: 'Allianz Parque',   city: 'São Paulo',      capacity: 43713 },
  oldTrafford: { name: 'Old Trafford',     city: 'Manchester',     capacity: 74310 },
  anfield:     { name: 'Anfield',          city: 'Liverpool',      capacity: 61276 },
  campNou:     { name: 'Estadi Olímpic Lluís Companys', city: 'Barcelona', capacity: 54367 },
  bernabeu:    { name: 'Santiago Bernabéu', city: 'Madrid',        capacity: 81044 },
  niltonSantos:{ name: 'Estádio Nilton Santos', city: 'Rio de Janeiro', capacity: 46931 },
  neo:         { name: 'Neo Química Arena', city: 'São Paulo',     capacity: 49205 },
};

// Gera data futura a partir de agora + horas
function futureDate(hoursFromNow: number): { iso: string; ts: number } {
  const d = new Date();
  d.setHours(d.getHours() + hoursFromNow, 0, 0, 0);
  return { iso: d.toISOString(), ts: Math.floor(d.getTime() / 1000) };
}

function makeFixture(
  id: number,
  home: typeof mockTeams.flamengo,
  away: typeof mockTeams.palmeiras,
  league: typeof mockLeagues.brasileirao,
  venue: typeof venues.maracana,
  hoursOffset: number
): Fixture {
  const { iso, ts } = futureDate(hoursOffset);
  return {
    id, timezone: 'America/Sao_Paulo', date: iso, timestamp: ts,
    status: { long: 'Não iniciado', short: 'NS' },
    league,
    teams: { home: { ...home, winner: undefined }, away: { ...away, winner: undefined } },
    goals: { home: null, away: null },
    venue,
  };
}

// ---- Partidas mock com dados 100% corretos ----
export const MOCK_FIXTURES: Fixture[] = [
  makeFixture(1001, mockTeams.flamengo,   mockTeams.palmeiras,   mockLeagues.brasileirao,  venues.maracana,    3),
  makeFixture(1002, mockTeams.manchester, mockTeams.liverpool,   mockLeagues.premierLeague, venues.oldTrafford, 6),
  makeFixture(1003, mockTeams.barcelona,  mockTeams.realMadrid,  mockLeagues.laLiga,        venues.campNou,     10),
  makeFixture(1004, mockTeams.botafogo,   mockTeams.corinthians, mockLeagues.brasileirao,   venues.niltonSantos,28),
  makeFixture(1005, mockTeams.palmeiras,  mockTeams.flamengo,    mockLeagues.brasileirao,   venues.allianz,     52),
  makeFixture(1006, mockTeams.liverpool,  mockTeams.manchester,  mockLeagues.premierLeague, venues.anfield,     75),
  makeFixture(1007, mockTeams.realMadrid, mockTeams.barcelona,   mockLeagues.laLiga,        venues.bernabeu,    99),
  makeFixture(1008, mockTeams.corinthians,mockTeams.botafogo,    mockLeagues.brasileirao,   venues.neo,         124),
];

// ---- Helpers de forma ----
function makeFormSummary(wins: number, draws: number, losses: number, gf: number, ga: number, form: string) {
  const total = wins + draws + losses || 1;
  return {
    wins, draws, losses, goalsFor: gf, goalsAgainst: ga,
    avgGoalsFor: +(gf / total).toFixed(2),
    avgGoalsAgainst: +(ga / total).toFixed(2),
    avgCorners: 5.4, avgFouls: 12.1, avgShots: 13.5, avgShotsOnTarget: 5.2,
    avgYellowCards: 1.8, avgRedCards: 0.1,
    winRate: +((wins / total) * 100).toFixed(1),
    form,
    currentStreak: form.charAt(0) === 'W' ? `W${wins}` : form.charAt(0) === 'D' ? 'D1' : 'L1',
  };
}

// Forma de cada time com dados verossímeis
const teamFormData: Record<number, { last5: ReturnType<typeof makeFormSummary>; last10: ReturnType<typeof makeFormSummary>; home: { wins: number; draws: number; losses: number; gf: number; ga: number }; away: { wins: number; draws: number; losses: number; gf: number; ga: number } }> = {
  127: { // Flamengo
    last5:  makeFormSummary(4, 0, 1, 9, 4, 'WWLWW'),
    last10: makeFormSummary(7, 1, 2, 18, 9, 'WWLWWWDWWW'),
    home: { wins: 5, draws: 1, losses: 1, gf: 13, ga: 5 },
    away: { wins: 2, draws: 0, losses: 1, gf: 5, ga: 4 },
  },
  121: { // Palmeiras
    last5:  makeFormSummary(3, 1, 1, 7, 3, 'WDWWL'),
    last10: makeFormSummary(6, 2, 2, 15, 8, 'WDWWLWWDWL'),
    home: { wins: 4, draws: 2, losses: 1, gf: 10, ga: 5 },
    away: { wins: 2, draws: 0, losses: 2, gf: 5, ga: 3 },
  },
  33: { // Manchester United
    last5:  makeFormSummary(2, 1, 2, 6, 7, 'LWWDL'),
    last10: makeFormSummary(4, 2, 4, 14, 15, 'LWWDLWLWDL'),
    home: { wins: 3, draws: 1, losses: 1, gf: 8, ga: 6 },
    away: { wins: 1, draws: 1, losses: 3, gf: 6, ga: 9 },
  },
  40: { // Liverpool
    last5:  makeFormSummary(4, 1, 0, 11, 3, 'WWWDW'),
    last10: makeFormSummary(8, 1, 1, 22, 7, 'WWWDWWWWLW'),
    home: { wins: 5, draws: 0, losses: 0, gf: 13, ga: 3 },
    away: { wins: 3, draws: 1, losses: 1, gf: 9, ga: 4 },
  },
  529: { // Barcelona
    last5:  makeFormSummary(3, 2, 0, 10, 4, 'WDWWD'),
    last10: makeFormSummary(7, 2, 1, 23, 9, 'WDWWDWWWLW'),
    home: { wins: 5, draws: 1, losses: 0, gf: 14, ga: 4 },
    away: { wins: 2, draws: 1, losses: 1, gf: 9, ga: 5 },
  },
  541: { // Real Madrid
    last5:  makeFormSummary(3, 1, 1, 9, 5, 'LWWDW'),
    last10: makeFormSummary(7, 1, 2, 21, 10, 'LWWDWWWWLW'),
    home: { wins: 5, draws: 0, losses: 1, gf: 14, ga: 5 },
    away: { wins: 2, draws: 1, losses: 1, gf: 7, ga: 5 },
  },
  1359: { // Botafogo
    last5:  makeFormSummary(2, 2, 1, 6, 5, 'DWWDL'),
    last10: makeFormSummary(5, 3, 2, 14, 10, 'DWWDLWWLDW'),
    home: { wins: 3, draws: 2, losses: 0, gf: 8, ga: 4 },
    away: { wins: 2, draws: 1, losses: 2, gf: 6, ga: 6 },
  },
  131: { // Corinthians
    last5:  makeFormSummary(1, 2, 2, 4, 6, 'LDWDL'),
    last10: makeFormSummary(3, 3, 4, 10, 14, 'LDWDLWLWDL'),
    home: { wins: 2, draws: 2, losses: 1, gf: 6, ga: 5 },
    away: { wins: 1, draws: 1, losses: 3, gf: 4, ga: 9 },
  },
};

export function getMockTeamForm(teamId: number): TeamForm {
  const fd = teamFormData[teamId] ?? teamFormData[127];
  const team = Object.values(mockTeams).find((t) => t.id === teamId) ?? mockTeams.flamengo;
  const opponent = teamId === 127 ? mockTeams.palmeiras : mockTeams.flamengo;
  const league = teamId === 33 || teamId === 40 ? mockLeagues.premierLeague : teamId === 529 || teamId === 541 ? mockLeagues.laLiga : mockLeagues.brasileirao;

  return {
    teamId, team,
    last5: fd.last5,
    last10: fd.last10,
    last15: { ...fd.last10, wins: fd.last10.wins + 2, draws: fd.last10.draws + 1, losses: fd.last10.losses + 2, goalsFor: fd.last10.goalsFor + 5, goalsAgainst: fd.last10.goalsAgainst + 4 },
    homeRecord: { wins: fd.home.wins, draws: fd.home.draws, losses: fd.home.losses, goalsFor: fd.home.gf, goalsAgainst: fd.home.ga },
    awayRecord: { wins: fd.away.wins, draws: fd.away.draws, losses: fd.away.losses, goalsFor: fd.away.gf, goalsAgainst: fd.away.ga },
    recentMatches: [
      { fixtureId: 900, date: new Date(Date.now() - 7  * 86400000).toISOString(), homeTeam: team, awayTeam: opponent, homeGoals: 2, awayGoals: 1, result: 'W', isHome: true,  league, stats: { corners: 6, fouls: 11, shots: 14, shotsOnTarget: 5, yellowCards: 2, redCards: 0 } },
      { fixtureId: 901, date: new Date(Date.now() - 14 * 86400000).toISOString(), homeTeam: opponent, awayTeam: team, homeGoals: 0, awayGoals: 0, result: 'D', isHome: false, league, stats: { corners: 4, fouls: 14, shots: 10, shotsOnTarget: 3, yellowCards: 3, redCards: 0 } },
      { fixtureId: 902, date: new Date(Date.now() - 21 * 86400000).toISOString(), homeTeam: team, awayTeam: opponent, homeGoals: 3, awayGoals: 1, result: 'W', isHome: true,  league, stats: { corners: 7, fouls: 10, shots: 17, shotsOnTarget: 7, yellowCards: 1, redCards: 0 } },
      { fixtureId: 903, date: new Date(Date.now() - 28 * 86400000).toISOString(), homeTeam: opponent, awayTeam: team, homeGoals: 2, awayGoals: 0, result: 'L', isHome: false, league, stats: { corners: 3, fouls: 15, shots: 8,  shotsOnTarget: 2, yellowCards: 2, redCards: 1 } },
      { fixtureId: 904, date: new Date(Date.now() - 35 * 86400000).toISOString(), homeTeam: team, awayTeam: opponent, homeGoals: 1, awayGoals: 0, result: 'W', isHome: true,  league, stats: { corners: 5, fouls: 12, shots: 12, shotsOnTarget: 4, yellowCards: 2, redCards: 0 } },
    ],
  };
}

export function getMockHeadToHead(teamAId: number, teamBId: number): HeadToHead {
  const tA = Object.values(mockTeams).find((t) => t.id === teamAId) ?? mockTeams.flamengo;
  const tB = Object.values(mockTeams).find((t) => t.id === teamBId) ?? mockTeams.palmeiras;
  const league = teamAId === 33 || teamAId === 40 ? mockLeagues.premierLeague : teamAId === 529 || teamAId === 541 ? mockLeagues.laLiga : mockLeagues.brasileirao;

  return {
    teamA: tA, teamB: tB,
    totalMatches: 10, teamAWins: 4, draws: 3, teamBWins: 3,
    avgGoals: 2.4, avgCorners: 9.1, avgFouls: 24.5,
    bttsRate: 0.60, over15Rate: 0.80, over25Rate: 0.50,
    matches: [
      { fixtureId: 800, date: new Date(Date.now() - 90  * 86400000).toISOString(), league, homeTeam: tA, awayTeam: tB, homeGoals: 2, awayGoals: 1, winner: tA, stats: { corners: 8,  fouls: 22, shots: 24, shotsOnTarget: 9,  yellowCards: 3, redCards: 0 } },
      { fixtureId: 801, date: new Date(Date.now() - 180 * 86400000).toISOString(), league, homeTeam: tB, awayTeam: tA, homeGoals: 1, awayGoals: 1,              stats: { corners: 10, fouls: 26, shots: 20, shotsOnTarget: 7,  yellowCards: 4, redCards: 1 } },
      { fixtureId: 802, date: new Date(Date.now() - 270 * 86400000).toISOString(), league, homeTeam: tA, awayTeam: tB, homeGoals: 3, awayGoals: 2, winner: tA, stats: { corners: 11, fouls: 25, shots: 28, shotsOnTarget: 12, yellowCards: 5, redCards: 0 } },
      { fixtureId: 803, date: new Date(Date.now() - 360 * 86400000).toISOString(), league, homeTeam: tB, awayTeam: tA, homeGoals: 2, awayGoals: 0, winner: tB, stats: { corners: 7,  fouls: 21, shots: 18, shotsOnTarget: 6,  yellowCards: 2, redCards: 0 } },
      { fixtureId: 804, date: new Date(Date.now() - 450 * 86400000).toISOString(), league, homeTeam: tA, awayTeam: tB, homeGoals: 1, awayGoals: 1,              stats: { corners: 9,  fouls: 28, shots: 22, shotsOnTarget: 8,  yellowCards: 3, redCards: 0 } },
    ],
  };
}

export function getMockLineup(fixtureId: number): Lineup {
  const fixture = MOCK_FIXTURES.find((f) => f.id === fixtureId) ?? MOCK_FIXTURES[0];
  const home = fixture.teams.home;
  const away = fixture.teams.away;

  // Escalações realistas por time
  const lineups: Record<number, { formation: string; coach: string; players: [number, string, string, number][] }> = {
    127: { formation: '4-3-3', coach: 'Filipe Luís', players: [
      [1,'Rossi','GK',1],[2,'Wesley','D',22],[3,'Léo Ortiz','D',3],[4,'Léo Pereira','D',5],[5,'Ayrton Lucas','D',6],
      [6,'Gerson','M',8],[7,'De la Cruz','M',18],[8,'Pulgar','M',5],
      [9,'Gonzalo Plata','F',17],[10,'Pedro','F',9],[11,'Michael','F',11],
    ]},
    121: { formation: '4-2-3-1', coach: 'Abel Ferreira', players: [
      [30,'Weverton','GK',21],[31,'Marcos Rocha','D',2],[32,'Gustavo Gómez','D',15],[33,'Murilo','D',3],[34,'Piquerez','D',22],
      [35,'Aníbal Moreno','M',5],[36,'Richard Ríos','M',18],
      [37,'Raphael Veiga','M',23],[38,'Rony','M',10],[39,'Estêvão','M',41],
      [40,'Flaco López','F',9],
    ]},
    33: { formation: '4-2-3-1', coach: 'Rúben Amorim', players: [
      [50,'Onana','GK',24],[51,'Dalot','D',20],[52,'Maguire','D',5],[53,'Martínez','D',6],[54,'Shaw','D',23],
      [55,'Casemiro','M',18],[56,'Mainoo','M',37],
      [57,'Fernandes','M',8],[58,'Rashford','F',10],[59,'Antony','F',21],
      [60,'Højlund','F',11],
    ]},
    40: { formation: '4-3-3', coach: 'Arne Slot', players: [
      [70,'Alisson','GK',1],[71,'Alexander-Arnold','D',66],[72,'Konaté','D',5],[73,'Van Dijk','D',4],[74,'Robertson','D',26],
      [75,'Gravenberch','M',38],[76,'Mac Allister','M',10],[77,'Jones','M',17],
      [78,'Salah','F',11],[79,'Jota','F',20],[80,'Gakpo','F',18],
    ]},
    529: { formation: '4-3-3', coach: 'Hansi Flick', players: [
      [90,'Szczesny','GK',13],[91,'Koundé','D',23],[92,'Araújo','D',4],[93,'Martínez','D',3],[94,'Balde','D',11],
      [95,'Pedri','M',8],[96,'De Jong','M',21],[97,'Gavi','M',6],
      [98,'Yamal','F',19],[99,'Lewandowski','F',9],[100,'Raphinha','F',11],
    ]},
    541: { formation: '4-3-3', coach: 'Carlo Ancelotti', players: [
      [110,'Lunin','GK',13],[111,'Carvajal','D',2],[112,'Militão','D',3],[113,'Rüdiger','D',22],[114,'Mendy','D',23],
      [115,'Valverde','M',15],[116,'Tchouaméni','M',8],[117,'Kroos','M',14],
      [118,'Bellingham','M',5],[119,'Vini Jr.','F',7],[120,'Mbappé','F',9],
    ]},
    1359: { formation: '4-2-3-1', coach: 'Artur Jorge', players: [
      [130,'Gatito','GK',1],[131,'Vitinho','D',2],[132,'Bastos','D',3],[133,'Alexander Barboza','D',4],[134,'Marçal','D',6],
      [135,'Gregore','M',8],[136,'Danilo Barbosa','M',5],
      [137,'Luís Henrique','M',11],[138,'Savarino','M',10],[139,'Eduardo','M',7],
      [140,'Tiquinho Soares','F',9],
    ]},
    131: { formation: '4-1-4-1', coach: 'Ramón Díaz', players: [
      [150,'Hugo Souza','GK',1],[151,'Matheuzinho','D',2],[152,'Gustavo Henrique','D',3],[153,'Cacá','D',4],[154,'Hugo','D',6],
      [155,'Raniele','M',5],
      [156,'Rodrigo Garro','M',8],[157,'Maycon','M',14],[158,'Coronado','M',10],[159,'Wesley','M',11],
      [160,'Yuri Alberto','F',9],
    ]},
  };

  const makeTeamLineup = (team: typeof home) => {
    const ld = lineups[team.id] ?? lineups[127];
    const rows = ['1', ...ld.formation.split('-')];
    let rowIdx = 0, colIdx = 0;
    const rowCounts = rows.map(Number);

    return {
      team: { id: team.id, name: team.name, logo: team.logo, code: team.code ?? '' },
      formation: ld.formation,
      coach: { name: ld.coach },
      startXI: ld.players.map(([id, name, pos, num]) => {
        const countInRow = rowCounts[rowIdx] || 1;
        const grid = `${rowIdx + 1}:${colIdx + 1}`;
        colIdx++;
        if (colIdx >= countInRow) { colIdx = 0; rowIdx++; }
        return { player: { id, name, position: pos, number: num, photo: `https://media.api-sports.io/football/players/${id}.png` }, position: pos, grid, number: num };
      }),
      substitutes: [
        { player: { id: team.id * 10 + 1, name: 'Reserva 1', position: 'GK', number: 23 }, position: 'GK' },
        { player: { id: team.id * 10 + 2, name: 'Reserva 2', position: 'D',  number: 13 }, position: 'D' },
        { player: { id: team.id * 10 + 3, name: 'Reserva 3', position: 'M',  number: 16 }, position: 'M' },
        { player: { id: team.id * 10 + 4, name: 'Reserva 4', position: 'F',  number: 19 }, position: 'F' },
      ],
      injured: [],
      suspended: [],
      doubtful: [],
    };
  };

  return {
    fixtureId,
    isOfficial: false,
    lastUpdated: new Date().toISOString(),
    home: makeTeamLineup(home),
    away: makeTeamLineup(away),
  };
}

export function getMockPlayerStats(playerId: number): PlayerStats {
  const players: Record<number, { name: string; pos: string; goals: number; assists: number; apps: number; rating: string; teamId: number }> = {
    9:   { name: 'Pedro',           pos: 'F', goals: 18, assists: 7,  apps: 28, rating: '7.8', teamId: 127 },
    7:   { name: 'Estêvão',         pos: 'F', goals: 10, assists: 8,  apps: 24, rating: '7.5', teamId: 121 },
    10:  { name: 'Raphael Veiga',   pos: 'M', goals: 9,  assists: 11, apps: 29, rating: '7.4', teamId: 121 },
    11:  { name: 'Salah',           pos: 'F', goals: 22, assists: 12, apps: 30, rating: '8.2', teamId: 40  },
    9541:{ name: 'Vini Jr.',        pos: 'F', goals: 16, assists: 9,  apps: 26, rating: '8.0', teamId: 541 },
    99:  { name: 'Lewandowski',     pos: 'F', goals: 20, assists: 5,  apps: 27, rating: '7.9', teamId: 529 },
  };
  const p = players[playerId] ?? players[9];
  const team = Object.values(mockTeams).find((t) => t.id === p.teamId) ?? mockTeams.flamengo;
  const league = p.teamId === 40 || p.teamId === 33 ? mockLeagues.premierLeague : p.teamId === 529 || p.teamId === 541 ? mockLeagues.laLiga : mockLeagues.brasileirao;

  return {
    playerId, season: 2025,
    player: { id: playerId, name: p.name, position: p.pos, number: playerId % 30 || 9, photo: `https://media.api-sports.io/football/players/${playerId}.png` },
    team, league,
    games:      { appearences: p.apps, lineups: p.apps - 2, minutes: p.apps * 78, position: p.pos, rating: p.rating },
    substitutes:{ in: 2, out: 4, bench: 3 },
    shots:      { total: p.goals * 4, on: p.goals * 2 },
    goals:      { total: p.goals, conceded: 0, assists: p.assists },
    passes:     { total: p.apps * 28, key: p.assists * 3, accuracy: 82 },
    tackles:    { total: p.apps * 1, blocks: 3, interceptions: 5 },
    duels:      { total: p.apps * 5, won: Math.floor(p.apps * 2.5) },
    dribbles:   { attempts: p.apps * 2, success: p.apps },
    fouls:      { drawn: p.apps * 1, committed: p.apps * 1 },
    cards:      { yellow: Math.floor(p.apps / 8), yellowred: 0, red: 0 },
    penalty:    { scored: Math.floor(p.goals / 5), missed: 0 },
  };
}

export function getMockTransfers(teamId: number): Transfer[] {
  const transfersByTeam: Record<number, Transfer[]> = {
    127: [ // Flamengo
      { player: { id: 200, name: 'Gonzalo Plata', position: 'Atacante' }, type: 'buy',     date: '2024-07-15', fromTeam: { id: 500, name: 'Sporting CP', logo: 'https://media.api-sports.io/football/teams/228.png', code: 'SCP' }, toTeam: Object.values(mockTeams).find(t=>t.id===127)!, fee: '€10M', impact: 'high' },
      { player: { id: 201, name: 'Michael',        position: 'Atacante' }, type: 'loan_in', date: '2024-08-01', fromTeam: { id: 501, name: 'Wolfsburg',   logo: 'https://media.api-sports.io/football/teams/163.png', code: 'WOL' }, toTeam: Object.values(mockTeams).find(t=>t.id===127)!, impact: 'medium' },
      { player: { id: 202, name: 'Thiago Maia',    position: 'Meio-campo'}, type: 'sell',   date: '2024-07-01', fromTeam: Object.values(mockTeams).find(t=>t.id===127)!, toTeam: { id: 502, name: 'Internacional', logo: 'https://media.api-sports.io/football/teams/119.png', code: 'INT' }, fee: '€4M', impact: 'low' },
    ],
    121: [ // Palmeiras
      { player: { id: 210, name: 'Estêvão',        position: 'Atacante' }, type: 'sell',    date: '2025-07-01', fromTeam: Object.values(mockTeams).find(t=>t.id===121)!, toTeam: { id: 50, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png', code: 'CHE' }, fee: '€61.5M', impact: 'high' },
      { player: { id: 211, name: 'Agustín Giay',   position: 'Defensor'  }, type: 'buy',    date: '2025-01-15', fromTeam: { id: 503, name: 'San Lorenzo', logo: '', code: 'SL' }, toTeam: Object.values(mockTeams).find(t=>t.id===121)!, fee: '€6M', impact: 'medium' },
    ],
    40: [ // Liverpool
      { player: { id: 220, name: 'Federico Chiesa', position: 'Atacante' }, type: 'buy',   date: '2024-08-01', fromTeam: { id: 504, name: 'Juventus', logo: 'https://media.api-sports.io/football/teams/496.png', code: 'JUV' }, toTeam: Object.values(mockTeams).find(t=>t.id===40)!, fee: '€12M', impact: 'medium' },
    ],
    541: [ // Real Madrid
      { player: { id: 230, name: 'Kylian Mbappé',  position: 'Atacante' }, type: 'buy',   date: '2024-07-01', fromTeam: { id: 85, name: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png', code: 'PSG' }, toTeam: Object.values(mockTeams).find(t=>t.id===541)!, fee: 'Livre', impact: 'high' },
    ],
  };
  return transfersByTeam[teamId] ?? transfersByTeam[127];
}

export function getMockPrediction(fixtureId: number): Prediction {
  const fixture = MOCK_FIXTURES.find((f) => f.id === fixtureId) ?? MOCK_FIXTURES[0];
  const homeId = fixture.teams.home.id;
  const awayId = fixture.teams.away.id;
  const homeFd = teamFormData[homeId] ?? teamFormData[127];
  const awayFd = teamFormData[awayId] ?? teamFormData[121];
  const homeWinRate = homeFd.last10.winRate;
  const awayWinRate = awayFd.last10.winRate;

  // Probabilidades baseadas nos dados de forma
  const total = homeWinRate + awayWinRate + 25;
  const homeWin = +((homeWinRate / total) * 100 + 5).toFixed(1); // +5 mando de campo
  const awayWin = +((awayWinRate / total) * 100).toFixed(1);
  const draw = +(100 - homeWin - awayWin).toFixed(1);
  const avgGoals = (homeFd.last10.avgGoalsFor + awayFd.last10.avgGoalsFor) / 2;
  const over15 = Math.min(Math.round((avgGoals > 1.5 ? 75 : 55)), 90);
  const over25 = Math.min(Math.round((avgGoals > 2.0 ? 55 : 38)), 80);
  const btts   = Math.round((homeFd.last10.avgGoalsFor > 1 && awayFd.last10.avgGoalsFor > 1) ? 62 : 45);

  return {
    fixtureId, generatedAt: new Date().toISOString(),
    confidenceScore: Math.round(60 + Math.abs(homeWin - awayWin) / 2),
    riskLevel: homeWin > 55 || awayWin > 55 ? 'conservative' : homeWin > 45 || awayWin > 45 ? 'moderate' : 'aggressive',
    probabilities: {
      homeWin, draw, awayWin, over15Goals: over15, over25Goals: over25, btts,
      moreCorners: 'home', moreFouls: 'away', moreShotsOnTarget: 'home', moreCards: 'away',
    },
    trends: [
      { market: 'over15', label: `Over 1.5 gols`, probability: over15, confidence: over15 >= 70 ? 'high' : 'medium', risk: 'conservative', reasoning: `Média combinada de ${avgGoals.toFixed(1)} gols esperados. ${fixture.teams.home.name} marca ${homeFd.last10.avgGoalsFor} gols/jogo (últ. 10). ${fixture.teams.away.name} marca ${awayFd.last10.avgGoalsFor} gols/jogo.`, dataPoints: [`${fixture.teams.home.name}: ${homeFd.last10.avgGoalsFor} gols/jogo (últ. 10)`, `${fixture.teams.away.name}: ${awayFd.last10.avgGoalsFor} gols/jogo (últ. 10)`, `H2H: 80% dos confrontos tiveram +1.5 gols`] },
      { market: 'btts',  label: `Ambas marcam: Sim`, probability: btts, confidence: btts >= 60 ? 'medium' : 'low', risk: 'moderate', reasoning: `Ambos os times têm atacantes produtivos. Taxa BTTS nos últimos H2H: 60%.`, dataPoints: [`${fixture.teams.home.name}: ataque com média de ${homeFd.last10.avgGoalsFor} gols/jogo`, `${fixture.teams.away.name}: ataque com média de ${awayFd.last10.avgGoalsFor} gols/jogo`] },
      { market: homeWin > awayWin ? 'homeWin' : 'awayWin', label: `${homeWin > awayWin ? fixture.teams.home.name : fixture.teams.away.name} favorito`, probability: Math.max(homeWin, awayWin), confidence: Math.max(homeWin, awayWin) >= 50 ? 'medium' : 'low', risk: 'moderate', reasoning: `Baseado na forma recente, aproveitamento e mando de campo.`, dataPoints: [`Aproveitamento ${fixture.teams.home.name}: ${homeWinRate}%`, `Aproveitamento ${fixture.teams.away.name}: ${awayWinRate}%`, `Fator mando de campo: +5%`] },
    ],
    summary: `${homeWin > awayWin ? fixture.teams.home.name : fixture.teams.away.name} é o favorito estatístico com ${Math.max(homeWin, awayWin)}% de probabilidade. Over 1.5 gols tem ${over15}% de chance baseado na média de ${avgGoals.toFixed(1)} gols esperados. Empate calculado em ${draw}%.`,
    disclaimer: 'Análise baseada em estatísticas históricas e tendências. Não constitui garantia de resultado. Aposte com responsabilidade.',
    sourceData: {
      homeFormLast5: homeFd.last5,
      awayFormLast5: awayFd.last5,
      headToHead: getMockHeadToHead(homeId, awayId),
      weights: { recentForm: 0.25, attackDefense: 0.20, homeAdvantage: 0.15, headToHead: 0.15, lineupInjuries: 0.15, recentTransfers: 0.05, oddsMarket: 0.05 },
    },
  };
}

export function getMockAnalysis(fixtureId: number): MatchAnalysis {
  const fixture = MOCK_FIXTURES.find((f) => f.id === fixtureId) ?? MOCK_FIXTURES[0];
  const homeId = fixture.teams.home.id;
  const awayId = fixture.teams.away.id;
  return {
    fixture,
    homeForm: getMockTeamForm(homeId),
    awayForm: getMockTeamForm(awayId),
    headToHead: getMockHeadToHead(homeId, awayId),
    lineup: getMockLineup(fixtureId),
    homeTransfers: getMockTransfers(homeId),
    awayTransfers: getMockTransfers(awayId),
    homePlayerStats: [getMockPlayerStats(9)],
    awayPlayerStats: [getMockPlayerStats(7)],
    prediction: getMockPrediction(fixtureId),
    generatedAt: new Date().toISOString(),
  };
}
