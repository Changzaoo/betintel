import {
  TeamForm, HeadToHead, Lineup, Transfer,
  Prediction, PredictionTrend, ConfidenceLevel, RiskLevel,
  PREDICTION_WEIGHTS
} from '@betintel/shared';

interface PredictionInput {
  fixtureId: number;
  homeForm: TeamForm;
  awayForm: TeamForm;
  headToHead: HeadToHead;
  homeLineup?: Lineup['home'];
  awayLineup?: Lineup['away'];
  homeTransfers?: Transfer[];
  awayTransfers?: Transfer[];
}

export class PredictionEngine {
  calculate(input: PredictionInput): Prediction {
    const { fixtureId, homeForm, awayForm, headToHead } = input;
    const w = PREDICTION_WEIGHTS;

    // ---- Form scores (0-1) ----
    const homeFormScore = this.formScore(homeForm);
    const awayFormScore = this.formScore(awayForm);

    // ---- Attack/defense differential ----
    const homeAttack = Math.min(homeForm.last10.avgGoalsFor / 3, 1);
    const awayAttack = Math.min(awayForm.last10.avgGoalsFor / 3, 1);
    const homeDefense = Math.max(1 - homeForm.last10.avgGoalsAgainst / 3, 0);
    const awayDefense = Math.max(1 - awayForm.last10.avgGoalsAgainst / 3, 0);

    // ---- Home advantage ----
    const homeAdv = 0.6; // ~60% statistical home advantage baseline

    // ---- H2H bias ----
    const h2hHomeRate = headToHead.totalMatches > 0
      ? headToHead.teamAWins / headToHead.totalMatches
      : 0.35;
    const h2hDrawRate = headToHead.totalMatches > 0
      ? headToHead.draws / headToHead.totalMatches
      : 0.28;

    // ---- Lineup/injury penalty ----
    const homeInjuryPenalty = (input.homeLineup?.injured.length ?? 0) * 0.03;
    const awayInjuryPenalty = (input.awayLineup?.injured.length ?? 0) * 0.03;
    const homeSuspPenalty = (input.homeLineup?.suspended.length ?? 0) * 0.025;
    const awaySuspPenalty = (input.awayLineup?.suspended.length ?? 0) * 0.025;

    // ---- Raw strength scores ----
    const homeStrength =
      homeFormScore * w.recentForm +
      (homeAttack * 0.5 + homeDefense * 0.5) * w.attackDefense +
      homeAdv * w.homeAdvantage +
      h2hHomeRate * w.headToHead -
      homeInjuryPenalty - homeSuspPenalty;

    const awayStrength =
      awayFormScore * w.recentForm +
      (awayAttack * 0.5 + awayDefense * 0.5) * w.attackDefense +
      (1 - homeAdv) * w.homeAdvantage +
      (1 - h2hHomeRate - h2hDrawRate) * w.headToHead -
      awayInjuryPenalty - awaySuspPenalty;

    const drawStrength = h2hDrawRate * w.headToHead + 0.22;

    const total = homeStrength + awayStrength + drawStrength;

    const homeWin = Math.round((homeStrength / total) * 100 * 10) / 10;
    const awayWin = Math.round((awayStrength / total) * 100 * 10) / 10;
    const draw = Math.round(100 - homeWin - awayWin);

    // ---- Goals markets ----
    const avgExpectedGoals = (homeForm.last10.avgGoalsFor + awayForm.last10.avgGoalsFor + headToHead.avgGoals) / 3;
    const over15 = Math.min(Math.round(this.poissonOver(avgExpectedGoals, 1) * 1000) / 10, 97);
    const over25 = Math.min(Math.round(this.poissonOver(avgExpectedGoals, 2) * 1000) / 10, 92);
    const btts = Math.round(
      ((homeForm.last10.avgGoalsFor > 0.8 ? 0.6 : 0.4) + (awayForm.last10.avgGoalsFor > 0.8 ? 0.6 : 0.4) + headToHead.bttsRate) / 3 * 100
    );

    // ---- Trend comparisons ----
    const moreCorners = homeForm.last10.avgCorners > awayForm.last10.avgCorners ? 'home' : awayForm.last10.avgCorners > homeForm.last10.avgCorners ? 'away' : 'even';
    const moreFouls = homeForm.last10.avgFouls > awayForm.last10.avgFouls ? 'home' : 'away';
    const moreShotsOnTarget = homeForm.last10.avgShotsOnTarget > awayForm.last10.avgShotsOnTarget ? 'home' : 'away';
    const moreCards = homeForm.last10.avgYellowCards > awayForm.last10.avgYellowCards ? 'home' : 'away';

    // ---- Confidence ----
    const dataPoints = headToHead.totalMatches + (homeForm.last10.wins + homeForm.last10.draws + homeForm.last10.losses);
    const confidenceScore = Math.min(Math.round(40 + dataPoints * 2), 95);

    const riskLevel: RiskLevel = homeWin > 60 || awayWin > 60 ? 'conservative' : homeWin > 45 || awayWin > 45 ? 'moderate' : 'aggressive';

    // ---- Trends ----
    const trends = this.buildTrends(homeWin, awayWin, draw, over15, over25, btts, homeForm, awayForm, headToHead);

    return {
      fixtureId,
      generatedAt: new Date().toISOString(),
      confidenceScore,
      riskLevel,
      probabilities: {
        homeWin, draw, awayWin, over15Goals: over15, over25Goals: over25, btts,
        moreCorners: moreCorners as 'home' | 'away' | 'even',
        moreFouls: moreFouls as 'home' | 'away',
        moreShotsOnTarget: moreShotsOnTarget as 'home' | 'away',
        moreCards: moreCards as 'home' | 'away',
      },
      trends,
      summary: this.buildSummary(homeWin, awayWin, draw, over15, over25, btts, homeForm.team.name, awayForm.team.name),
      disclaimer: 'Esta análise é baseada exclusivamente em estatísticas históricas e tendências. Não constitui garantia de resultado. Aposte com responsabilidade.',
      sourceData: {
        homeFormLast5: homeForm.last5,
        awayFormLast5: awayForm.last5,
        headToHead,
        weights: PREDICTION_WEIGHTS,
      },
    };
  }

  private formScore(form: TeamForm): number {
    const s = form.last10;
    const total = s.wins + s.draws + s.losses || 1;
    return (s.wins * 3 + s.draws) / (total * 3);
  }

  private poissonOver(lambda: number, k: number): number {
    // P(X > k) using Poisson distribution
    let prob = 0;
    let factK = 1;
    for (let i = 0; i <= k; i++) {
      if (i > 0) factK *= i;
      prob += (Math.pow(lambda, i) * Math.exp(-lambda)) / factK;
    }
    return Math.max(0, Math.min(1, 1 - prob));
  }

  private confidence(prob: number): ConfidenceLevel {
    if (prob >= 70) return 'high';
    if (prob >= 50) return 'medium';
    return 'low';
  }

  private risk(prob: number): RiskLevel {
    if (prob >= 70) return 'conservative';
    if (prob >= 50) return 'moderate';
    return 'aggressive';
  }

  private buildTrends(
    homeWin: number, awayWin: number, draw: number,
    over15: number, over25: number, btts: number,
    homeForm: TeamForm, awayForm: TeamForm, h2h: HeadToHead
  ): PredictionTrend[] {
    const trends: PredictionTrend[] = [];

    if (over15 >= 55) {
      trends.push({
        market: 'over15', label: `Tendência: Over 1.5 gols`, probability: over15,
        confidence: this.confidence(over15), risk: this.risk(over15),
        reasoning: `Média combinada de gols esperados: ${((homeForm.last10.avgGoalsFor + awayForm.last10.avgGoalsFor) / 2).toFixed(1)} por time`,
        dataPoints: [
          `${homeForm.team.name}: ${homeForm.last10.avgGoalsFor} gols/jogo (últ. 10)`,
          `${awayForm.team.name}: ${awayForm.last10.avgGoalsFor} gols/jogo (últ. 10)`,
          `H2H: ${h2h.over15Rate * 100}% dos confrontos tiveram +1.5 gols`,
          `Média H2H: ${h2h.avgGoals} gols/jogo`,
        ],
      });
    }

    if (over25 >= 45) {
      trends.push({
        market: 'over25', label: `Tendência: Over 2.5 gols`, probability: over25,
        confidence: this.confidence(over25), risk: this.risk(over25),
        reasoning: 'Análise do modelo de Poisson aplicado à média de gols esperados',
        dataPoints: [
          `H2H: ${h2h.over25Rate * 100}% dos confrontos tiveram +2.5 gols`,
          `Média de gols nos últimos H2H: ${h2h.avgGoals}`,
        ],
      });
    }

    if (btts >= 50) {
      trends.push({
        market: 'btts', label: 'Ambas marcam: Sim', probability: btts,
        confidence: this.confidence(btts), risk: this.risk(btts),
        reasoning: `${homeForm.team.name} marca em média ${homeForm.last10.avgGoalsFor} gols/jogo. ${awayForm.team.name} marca ${awayForm.last10.avgGoalsFor} gols/jogo`,
        dataPoints: [
          `Taxa BTTS H2H: ${h2h.bttsRate * 100}%`,
          `${homeForm.team.name} em casa: ataque produtivo`,
          `${awayForm.team.name} fora: mantém capacidade ofensiva`,
        ],
      });
    }

    const winnerProb = Math.max(homeWin, awayWin);
    const winner = homeWin > awayWin ? homeForm.team.name : awayForm.team.name;
    if (winnerProb >= 45) {
      trends.push({
        market: homeWin > awayWin ? 'homeWin' : 'awayWin',
        label: `${winner} favorito`,
        probability: winnerProb,
        confidence: this.confidence(winnerProb), risk: this.risk(winnerProb),
        reasoning: `Combinação de forma recente, histórico H2H e estatísticas ofensivas/defensivas`,
        dataPoints: [
          `Aproveitamento recente: ${homeWin > awayWin ? homeForm.last10.winRate : awayForm.last10.winRate}%`,
          `H2H: ${homeWin > awayWin ? h2h.teamAWins : h2h.teamBWins} vitórias nos últimos ${h2h.totalMatches} confrontos`,
        ],
      });
    }

    if (draw >= 25) {
      trends.push({
        market: 'draw', label: 'Empate possível', probability: draw,
        confidence: 'low', risk: 'aggressive',
        reasoning: 'Histórico H2H e equilíbrio atual dos times elevam probabilidade de empate',
        dataPoints: [`Empates H2H: ${h2h.draws} de ${h2h.totalMatches} jogos`],
      });
    }

    return trends;
  }

  private buildSummary(homeWin: number, awayWin: number, draw: number, over15: number, over25: number, btts: number, home: string, away: string): string {
    const fav = homeWin > awayWin ? home : away;
    const favProb = Math.max(homeWin, awayWin);
    const goalsStr = over25 >= 50 ? 'O modelo projeta boa produção de gols (Over 2.5).' : over15 >= 70 ? 'O modelo projeta ao menos 2 gols na partida (Over 1.5).' : 'Jogo tende a ser mais equilibrado e fechado taticamente.';

    return `${fav} aparece como favorito estatístico com ${favProb}% de probabilidade de vitória. ${goalsStr} ${btts >= 55 ? 'Alta probabilidade de ambos os times marcarem.' : ''} Empate calculado em ${draw}%. Análise baseada em forma recente, histórico H2H e estatísticas ofensivas/defensivas.`;
  }
}
