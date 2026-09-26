import type { Match, Team } from "./types";

export interface GeneratedMatch {
  round: number;
  slot: number;
  team_a_id: string | null;
  team_b_id: string | null;
  winner_id: string | null;
  is_bye: boolean;
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function nextPowerOfTwo(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/**
 * Randomly seeds a single-elimination bracket. Teams that draw a bye
 * (when the field isn't a power of two) auto-advance to round 2.
 */
export function generateBracket(teams: Team[]): GeneratedMatch[] {
  if (teams.length < 2) {
    throw new Error("Need at least 2 verified teams to generate a bracket.");
  }

  const shuffled = shuffle(teams);
  const bracketSize = nextPowerOfTwo(shuffled.length);
  const byeCount = bracketSize - shuffled.length;
  const totalRounds = Math.log2(bracketSize);

  const byeTeams = shuffled.slice(0, byeCount);
  const pairedTeams = shuffled.slice(byeCount);

  const matches: GeneratedMatch[] = [];
  const round1Size = bracketSize / 2;
  let byeIdx = 0;
  let pairIdx = 0;

  for (let slot = 0; slot < round1Size; slot++) {
    if (byeIdx < byeTeams.length) {
      const team = byeTeams[byeIdx++];
      matches.push({
        round: 1,
        slot,
        team_a_id: team.id,
        team_b_id: null,
        winner_id: team.id,
        is_bye: true,
      });
    } else {
      const a = pairedTeams[pairIdx++];
      const b = pairedTeams[pairIdx++];
      matches.push({
        round: 1,
        slot,
        team_a_id: a.id,
        team_b_id: b.id,
        winner_id: null,
        is_bye: false,
      });
    }
  }

  for (let round = 2; round <= totalRounds; round++) {
    const roundSize = bracketSize / Math.pow(2, round);
    for (let slot = 0; slot < roundSize; slot++) {
      matches.push({
        round,
        slot,
        team_a_id: null,
        team_b_id: null,
        winner_id: null,
        is_bye: false,
      });
    }
  }

  const byRoundSlot = new Map<string, GeneratedMatch>();
  matches.forEach((m) => byRoundSlot.set(`${m.round}:${m.slot}`, m));

  for (const m of matches) {
    if (m.winner_id && m.round < totalRounds) {
      const next = byRoundSlot.get(`${m.round + 1}:${Math.floor(m.slot / 2)}`);
      if (next) {
        if (m.slot % 2 === 0) next.team_a_id = m.winner_id;
        else next.team_b_id = m.winner_id;
      }
    }
  }

  return matches;
}

/**
 * Applies a winner selection to an existing bracket and cascades the
 * result forward. If this overwrites a previously-recorded winner,
 * any downstream advancement that depended on it is cleared so the
 * bracket never shows a stale team.
 */
export function applyWinner(
  allMatches: Match[],
  matchId: string,
  winnerId: string
): Match[] {
  const byId = new Map(allMatches.map((m) => [m.id, { ...m }]));
  const byRoundSlot = new Map(
    allMatches.map((m) => [`${m.round}:${m.slot}`, byId.get(m.id)!])
  );
  const totalRounds = Math.max(...allMatches.map((m) => m.round));

  const target = byId.get(matchId);
  if (!target) throw new Error("Match not found.");
  if (target.is_bye) throw new Error("Bye matches resolve automatically.");
  if (winnerId !== target.team_a_id && winnerId !== target.team_b_id) {
    throw new Error("Winner must be one of the two teams in this match.");
  }

  const changed = new Map<string, Match>();

  function clearWinner(m: Match) {
    m.winner_id = null;
    changed.set(m.id, m);
    if (m.round >= totalRounds) return;
    const next = byRoundSlot.get(`${m.round + 1}:${Math.floor(m.slot / 2)}`);
    if (!next) return;
    const side = m.slot % 2 === 0 ? "team_a_id" : "team_b_id";
    if (next[side]) {
      next[side] = null;
      changed.set(next.id, next);
      if (next.winner_id) clearWinner(next);
    }
  }

  function setWinner(m: Match, winner: string) {
    m.winner_id = winner;
    changed.set(m.id, m);
    if (m.round >= totalRounds) return;
    const next = byRoundSlot.get(`${m.round + 1}:${Math.floor(m.slot / 2)}`);
    if (!next) return;
    const side = m.slot % 2 === 0 ? "team_a_id" : "team_b_id";
    if (next[side] !== winner) {
      next[side] = winner;
      changed.set(next.id, next);
      if (next.winner_id) clearWinner(next);
    }
  }

  setWinner(target, winnerId);
  return Array.from(changed.values());
}

export function roundName(round: number, totalRounds: number): string {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semifinals";
  if (fromEnd === 2) return "Quarterfinals";
  return `Round ${round}`;
}
