declare module 'swiss-pairing' {
  interface Participant {
    id: string | number;
    seed: number;
  }

  interface Match {
    round: number;
    home: { id: string | number; points: number };
    away: { id: string | number; points: number };
  }

  interface MatchPair {
    home: string | number;
    away: string | number;
  }

  function getMatchups(
    round: number,
    participants: Participant[],
    matches: Match[]
  ): MatchPair[];

  export default function swissPairing(): {
    getMatchups: typeof getMatchups;
    getStandings: any;
    getModifiedMedianScores: any;
  };
}
