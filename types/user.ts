export type User = {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserContextType = {
  user: User | null;
};
