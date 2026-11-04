export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactMessagePayload {
  id: string;
  created_at: string;
  is_read: boolean;
  reply_text: string | null;
  responded_at: string | null;
}
