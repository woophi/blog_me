export type AuthData = {
  token: string;
  roles: IROLES[];
  name: string;
  userId: string;
  fetching?: boolean;
};

export enum IROLES {
  GODLIKE = 'Godlike',
  ADMIN = 'Admin',
  COMMENT = 'Comment'
};
