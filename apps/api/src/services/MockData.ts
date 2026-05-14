import {
  Fixture, TeamForm, HeadToHead, Lineup, Transfer,
  PlayerStats, Prediction, MatchAnalysis
} from '@betintel/shared';

const mockTeams = {
  flamengo: { id: 127, name: 'Flamengo', code: 'FLA', logo: 'https://media.api-sports.io/football/teams/127.png', country: 'Brazil' },
  palmeiras: { id: 121, name: 'Palmeiras', code: 'PAL', logo: 'https://media.api-sports.io/football/teams/121.png', country: 'Brazil' },
  manchester: { id: 33, name: 'Manchester United', code: 'MUN', logo: 'https://media.api-sports.io/football/teams/33.png', country: 'England' },
  liverpool: { id: 40, name: 'Liverpool', code: 'LIV', logo: 'https://media.api-sports.io/football/teams/40.png', country: 'England' },
  barcelona: { id: 529, name: 'Barcelona', code: 'BAR', logo: 'https://media.api-sports.io/football/teams/529.png', country: 'Spain' },
  realMadrid: { id: 541, name: 'Real Madrid', code: 'REA', logo: 'https://media.api-sports.io/football/teams/541.png', country: 'Spain' },
};

const mockLeagues = {
  brasileirao: { id: 71, name: 'Brasileirão Série A', type: 'League', logo: 'https://media.api-sports.io/football/leagues/71.png', country: { name: 'Brazil', code: 'BR', flag: 'https://media.api-sports.io/flags/br.svg' } },
  premierLeague: { id: 39, name: 'Premier League', type: 'League', logo: 'https://media.api-sports.io/football/leagues/39.png', country: { name: 'England', code: 'GB', flag: 'https://media.api-sports.io/flags/gb.svg' } },
  laLiga: { id: 140, name: 'La Liga', type: 'League', logo: 'https://media.api-sports.io/football/leagues/140.png', country: { name: 'Spain', code: 'ES', flag: 'https://media.api-sports.io/flags/es.svg' } },
};

function makeFixture(id: number, home: typeof mockTeams.flamengo, away: typeof mockTeams.palmeiras, league: typeof mockLeagues.brasileirao, hoursOffset = 2): Fixture {
  const date = new Date();
  date.setHours(date.getHours() + hoursOffset);
  return {
    id,
    timezone: 'America/Sao_Paulo',
    date: date.toISOString(),
    timestamp: Math.floor(date.getTime() / 1000),
    status: { long: 'Not Started', short: 'NS' },
    league: { ...league, season: { year: 2024, start: '2024-04-13', end: '2024-12-08', current: true } },
    teams: { home: { ...home, winner: undefined }, away: { ...away, winner: undefined } },
    goals: { home: null, away: null },
    venue: { name: 'Maracanã', city: 'Rio de Janeiro', capacity: 78838 },
  };
}

export const MOCK_FIXTURES: Fixture[] = [
  makeFixture(1001, mockTeams.flamengo, mockTeams.palmeiras, mockLeagues.brasileirao, 2),
  makeFixture(1002, mockTeams.manchester, mockTeams.liverpool, mockLeagues.premierLeague, 5),
  makeFixture(1003, mockTeams.barcelona, mockTeams.realMadrid, mockLeagues.laLiga, 8),
  makeFixture(1004, mockTeams.palmeiras, mockTeams.flamengo, mockLeagues.brasileirao, 26),
  makeFixture(1005, mockTeams.liverpool, mockTeams.manchester, mockLeagues.premierLeague, 30),
  makeFixture(1006, mockTeams.realMadrid, mockTeams.barcelona, mockLeagues.laLiga, 50),
];

function makeFormSummary(wins: number, draws: number, losses: number) {
  const total = wins + draws + losses;
  const gf = wins * 2 + draws * 1;
  const ga = losses * 2 + draws * 1;
  return {
    wins, draws, losses,
    goalsFor: gf, goalsAgainst: ga,
    avgGoalsFor: +(gf / total).toFixed(2),
    avgGoalsAgainst: +(ga / total).toFixed(2),
    avgCorners: 5.4, avgFouls: 12.1, avgShots: 13.5, avgShotsOnTarget: 5.2,
    avgYellowCards: 1.8, avgRedCards: 0.1,
    winRate: +((wins / total) * 100).toFixed(1),
    form: Array.from({ length: 5 }, (_, i) => (i < wins ? 'W' : i < wins + draws ? 'D' : 'L')).join(''),
    currentStreak: `W${wins}`,
  };
}

export function getMockTeamForm(teamId: number): TeamForm {
  const isFlamengo = teamId === 127;
  const team = isFlamengo ? mockTeams.flamengo : mockTeams.palmeiras;
  return {
    teamId,
    team,
    last5: makeFormSummary(3, 1, 1),
    last10: makeFormSummary(6, 2, 2),
    last15: makeFormSummary(9, 3, 3),
    homeRecord: { wins: 5, draws: 1, losses: 1, goalsFor: 12, goalsAgainst: 5 },
    awayRecord: { wins: 3, draws: 1, losses: 3, goalsFor: 8, goalsAgainst: 9 },
    recentMatches: [
      { fixtureId: 900, date: '2024-11-01T21:00:00Z', homeTeam: team, awayTeam: mockTeams.palmeiras, homeGoals: 2, awayGoals: 1, result: 'W', isHome: true, league: mockLeagues.brasileirao, stats: { corners: 6, fouls: 11, shots: 14, shotsOnTarget: 5, yellowCards: 2, redCards: 0 } },
      { fixtureId: 901, date: '2024-10-25T19:00:00Z', homeTeam: mockTeams.palmeiras, awayTeam: team, homeGoals: 0, awayGoals: 0, result: 'D', isHome: false, league: mockLeagues.brasileirao, stats: { corners: 4, fouls: 14, shots: 10, shotsOnTarget: 3, yellowCards: 3, redCards: 0 } },
      { fixtureId: 902, date: '2024-10-19T19:00:00Z', homeTeam: team, awayTeam: mockTeams.liverpool, homeGoals: 3, awayGoals: 1, result: 'W', isHome: true, league: mockLeagues.premierLeague, stats: { corners: 7, fouls: 10, shots: 17, shotsOnTarget: 7, yellowCards: 1, redCards: 0 } },
      { fixtureId: 903, date: '2024-10-05T17:00:00Z', homeTeam: mockTeams.liverpool, awayTeam: team, homeGoals: 2, awayGoals: 0, result: 'L', isHome: false, league: mockLeagues.premierLeague, stats: { corners: 3, fouls: 15, shots: 8, shotsOnTarget: 2, yellowCards: 2, redCards: 1 } },
      { fixtureId: 904, date: '2024-09-28T16:00:00Z', homeTeam: team, awayTeam: mockTeams.barcelona, homeGoals: 1, awayGoals: 0, result: 'W', isHome: true, league: mockLeagues.laLiga, stats: { corners: 5, fouls: 12, shots: 12, shotsOnTarget: 4, yellowCards: 2, redCards: 0 } },
    ],
  };
}

export function getMockHeadToHead(teamA: number, teamB: number): HeadToHead {
  const tA = teamA === 127 ? mockTeams.flamengo : mockTeams.palmeiras;
  const tB = teamB === 121 ? mockTeams.palmeiras : mockTeams.flamengo;
  return {
    teamA: tA, teamB: tB,
    totalMatches: 10, teamAWins: 4, draws: 3, teamBWins: 3,
    avgGoals: 2.4, avgCorners: 9.1, avgFouls: 24.5, bttsRate: 0.6, over15Rate: 0.8, over25Rate: 0.5,
    matches: [
      { fixtureId: 800, date: '2024-08-10T21:00:00Z', league: mockLeagues.brasileirao, homeTeam: tA, awayTeam: tB, homeGoals: 2, awayGoals: 1, winner: tA, stats: { corners: 8, fouls: 22, shots: 24, shotsOnTarget: 9, yellowCards: 3, redCards: 0 } },
      { fixtureId: 801, date: '2024-05-15T19:00:00Z', league: mockLeagues.brasileirao, homeTeam: tB, awayTeam: tA, homeGoals: 1, awayGoals: 1, stats: { corners: 10, fouls: 26, shots: 20, shotsOnTarget: 7, yellowCards: 4, redCards: 1 } },
      { fixtureId: 802, date: '2023-11-20T19:00:00Z', league: mockLeagues.brasileirao, homeTeam: tA, awayTeam: tB, homeGoals: 3, awayGoals: 2, winner: tA, stats: { corners: 11, fouls: 25, shots: 28, shotsOnTarget: 12, yellowCards: 5, redCards: 0 } },
    ],
  };
}

export function getMockLineup(fixtureId: number): Lineup {
  const mockPlayer = (id: number, name: string, pos: string, num: number, grid?: string) => ({
    player: { id, name, position: pos, number: num, photo: `https://media.api-sports.io/football/players/${id}.png` },
    position: pos, grid, number: num,
  });
  return {
    fixtureId, isOfficial: false, lastUpdated: new Date().toISOString(),
    home: {
      team: mockTeams.flamengo,
      formation: '4-3-3',
      coach: { id: 1, name: 'Filipe Luís', photo: '' },
      startXI: [
        mockPlayer(1, 'Rossi', 'GK', 1, '1:1'),
        mockPlayer(2, 'Wesley', 'D', 22, '2:1'), mockPlayer(3, 'Léo Ortiz', 'D', 3, '2:2'), mockPlayer(4, 'Léo Pereira', 'D', 5, '2:3'), mockPlayer(5, 'Ayrton Lucas', 'D', 6, '2:4'),
        mockPlayer(6, 'Gerson', 'M', 8, '3:1'), mockPlayer(7, 'De la Cruz', 'M', 18, '3:2'), mockPlayer(8, 'Pulgar', 'M', 5, '3:3'),
        mockPlayer(9, 'Gonzalo Plata', 'F', 17, '4:1'), mockPlayer(10, 'Pedro', 'F', 9, '4:2'), mockPlayer(11, 'Michael', 'F', 11, '4:3'),
      ],
      substitutes: [
        mockPlayer(12, 'Matheus Cunha', 'GK', 23), mockPlayer(13, 'Varela', 'D', 14), mockPlayer(14, 'Fabrício Bruno', 'D', 4),
        mockPlayer(15, 'Evertton Araújo', 'M', 16), mockPlayer(16, 'Lorran', 'M', 20), mockPlayer(17, 'Arrascaeta', 'M', 14),
        mockPlayer(18, 'Carlinhos', 'F', 19),
      ],
      injured: [{ player: { id: 99, name: 'Everton Cebolinha', position: 'F', number: 7 }, position: 'F' }],
      suspended: [],
      doubtful: [{ player: { id: 98, name: 'Matías Viña', position: 'D', number: 15 }, position: 'D' }],
    },
    away: {
      team: mockTeams.palmeiras,
      formation: '4-2-3-1',
      coach: { id: 2, name: 'Abel Ferreira', photo: '' },
      startXI: [
        mockPlayer(30, 'Weverton', 'GK', 21, '1:1'),
        mockPlayer(31, 'Marcos Rocha', 'D', 2, '2:1'), mockPlayer(32, 'Gustavo Gómez', 'D', 15, '2:2'), mockPlayer(33, 'Murilo', 'D', 3, '2:3'), mockPlayer(34, 'Piquerez', 'D', 22, '2:4'),
        mockPlayer(35, 'Aníbal Moreno', 'M', 5, '3:1'), mockPlayer(36, 'Richard Ríos', 'M', 18, '3:2'),
        mockPlayer(37, 'Raphael Veiga', 'M', 23, '4:1'), mockPlayer(38, 'Rony', 'M', 10, '4:2'), mockPlayer(39, 'Estêvão', 'M', 41, '4:3'),
        mockPlayer(40, 'Flaco López', 'F', 9, '5:1'),
      ],
      substitutes: [
        mockPlayer(41, 'Marcelo Lomba', 'GK', 1), mockPlayer(42, 'Michel', 'D', 13), mockPlayer(43, 'Vitor Reis', 'D', 26),
        mockPlayer(44, 'Gabriel Menino', 'M', 25), mockPlayer(45, 'Felipe Anderson', 'M', 77), mockPlayer(46, 'Bruno Rodrigues', 'F', 29),
      ],
      injured: [],
      suspended: [{ player: { id: 97, name: 'Zé Rafael', position: 'M', number: 8 }, position: 'M' }],
      doubtful: [],
    },
  };
}

export function getMockPlayerStats(playerId: number): PlayerStats {
  return {
    playerId, season: 2024,
    player: { id: playerId, name: 'Pedro', position: 'Atacante', number: 9, photo: `https://media.api-sports.io/football/players/${playerId}.png` },
    team: mockTeams.flamengo, league: mockLeagues.brasileirao,
    games: { appearences: 28, lineups: 26, minutes: 2200, position: 'F', rating: '7.8' },
    substitutes: { in: 2, out: 5, bench: 3 },
    shots: { total: 72, on: 38 },
    goals: { total: 18, conceded: 0, assists: 7 },
    passes: { total: 580, key: 45, accuracy: 78 },
    tackles: { total: 12, blocks: 3, interceptions: 5 },
    duels: { total: 140, won: 68 },
    dribbles: { attempts: 42, success: 24 },
    fouls: { drawn: 36, committed: 18 },
    cards: { yellow: 3, yellowred: 0, red: 0 },
    penalty: { scored: 4, missed: 1 },
  };
}

export function getMockTransfers(teamId: number): Transfer[] {
  const team = teamId === 127 ? mockTeams.flamengo : mockTeams.palmeiras;
  return [
    { player: { id: 200, name: 'Gonzalo Plata', position: 'Atacante' }, type: 'buy', date: '2024-07-15', fromTeam: { id: 500, name: 'Sporting CP', logo: '', code: 'SCP' }, toTeam: team, fee: '€10M', impact: 'high' },
    { player: { id: 201, name: 'Michael', position: 'Atacante' }, type: 'loan_in', date: '2024-08-01', fromTeam: { id: 501, name: 'Wolfsburg', logo: '', code: 'WOL' }, toTeam: team, impact: 'medium' },
    { player: { id: 202, name: 'Thiago Maia', position: 'Meio-campo' }, type: 'sell', date: '2024-07-01', fromTeam: team, toTeam: { id: 502, name: 'Internacional', logo: '', code: 'INT' }, fee: '€4M', impact: 'low' },
  ];
}

export function getMockPrediction(fixtureId: number): Prediction {
  return {
    fixtureId, generatedAt: new Date().toISOString(),
    confidenceScore: 72, riskLevel: 'moderate',
    probabilities: {
      homeWin: 48.5, draw: 26.2, awayWin: 25.3,
      over15Goals: 78.4, over25Goals: 52.1, btts: 58.6,
      moreCorners: 'home', moreFouls: 'away', moreShotsOnTarget: 'home', moreCards: 'away',
    },
    trends: [
      { market: 'over15', label: 'Tendência: Over 1.5 gols', probability: 78.4, confidence: 'high', risk: 'conservative', reasoning: 'As duas equipes marcaram em média 2.1 gols por jogo nos últimos 10 confrontos', dataPoints: ['Média H2H: 2.4 gols/jogo', 'Flamengo: 1.9 gols/jogo (últimos 5)', 'Palmeiras: 1.7 gols/jogo (últimos 5)', '80% dos H2H tiveram +1.5 gols'] },
      { market: 'btts', label: 'Ambas marcam: Sim', probability: 58.6, confidence: 'medium', risk: 'moderate', reasoning: 'Palmeiras marcou em 7 dos últimos 10 jogos fora de casa. Flamengo sofreu gols em 6 dos últimos 10.', dataPoints: ['Palmeiras fora: 70% das partidas marcou', 'Flamengo em casa: concedeu em 60% dos jogos', 'H2H: 60% ambas marcaram'] },
      { market: 'homeWin', label: 'Vitória do Mandante', probability: 48.5, confidence: 'medium', risk: 'moderate', reasoning: 'Flamengo tem melhor aproveitamento em casa (71%) e histórico favorável no H2H recente', dataPoints: ['Aproveitamento Flamengo em casa: 71%', 'H2H: Flamengo venceu 4 dos últimos 10', 'Palmeiras tem desempenho irregular fora'] },
      { market: 'corners', label: 'Mais escanteios para o Mandante', probability: 62.0, confidence: 'medium', risk: 'moderate', reasoning: 'Flamengo tem média de 6.2 escanteios em casa vs 4.1 do Palmeiras fora', dataPoints: ['Flamengo em casa: 6.2 escanteios/jogo', 'Palmeiras fora: 4.1 escanteios/jogo'] },
    ],
    summary: 'Partida com histórico de jogos disputados e com gols. Mandante tem ligeira vantagem estatística dado o fator campo e aproveitamento recente. Over 1.5 gols é a tendência com maior confiança baseada em dados históricos.',
    disclaimer: 'Esta análise é baseada exclusivamente em estatísticas históricas e tendências. Não é garantia de resultado. Aposte com responsabilidade.',
    sourceData: {
      homeFormLast5: makeFormSummary(3, 1, 1),
      awayFormLast5: makeFormSummary(2, 2, 1),
      headToHead: getMockHeadToHead(127, 121),
      weights: { recentForm: 0.25, attackDefense: 0.20, homeAdvantage: 0.15, headToHead: 0.15, lineupInjuries: 0.15, recentTransfers: 0.05, oddsMarket: 0.05 },
    },
  };
}

export function getMockAnalysis(fixtureId: number): MatchAnalysis {
  const fixture = MOCK_FIXTURES.find(f => f.id === fixtureId) ?? MOCK_FIXTURES[0];
  return {
    fixture,
    homeForm: getMockTeamForm(fixture.teams.home.id),
    awayForm: getMockTeamForm(fixture.teams.away.id),
    headToHead: getMockHeadToHead(fixture.teams.home.id, fixture.teams.away.id),
    lineup: getMockLineup(fixtureId),
    homeTransfers: getMockTransfers(fixture.teams.home.id),
    awayTransfers: getMockTransfers(fixture.teams.away.id),
    homePlayerStats: [getMockPlayerStats(9)],
    awayPlayerStats: [getMockPlayerStats(40)],
    prediction: getMockPrediction(fixtureId),
    generatedAt: new Date().toISOString(),
  };
}
