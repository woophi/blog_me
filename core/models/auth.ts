export type AuthData = {
  token: string;
  roles: IROLES[];
  name: string;
  userId: string;
  email: string;
  gravatarPhotoUrl?: string;
  fetching?: boolean;
};

export enum IROLES {
  GODLIKE = 'Godlike',
  ADMIN = 'Admin',
  COMMENT = 'Comment'
};
