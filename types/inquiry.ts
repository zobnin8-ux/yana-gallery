export type Inquiry = {
  id: string;
  artworkId?: string | null;
  artworkTitle?: string | null;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "archived";
};
