export interface Event {
  id: number;
  name: string;
  description: string;
  date?: string;
  start_time: string;
  address?: string;
  game_name: string;
  format?: string;
  event_type: string;
  tournament_type?: string;
  registration_fee?: number;
  max_participants?: number;
  visibility?: boolean;
  image_url?: string;
  duration?: number;
  contact_info?: string;
  age_restriction?: string;
  languages?: string;
  cancellation_policy?: string;
  internal_notes?: string;
  created_by: string;
  created_at?: string;
  participants: string[];


}