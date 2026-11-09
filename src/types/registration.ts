export interface Registration {
  id: string;
  event_id: string;
  participant_name: string;
  email: string;
  created_at: string;
}

export interface RegistrationInput {
  participant_name: string;
  email: string;
}