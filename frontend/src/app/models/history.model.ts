export interface History {
  id: number;
  name: string;
  date: string;
  game_name: string;
  event_type: string;
  tournament_type?: string;
  position?: number;
  points?: number;
}