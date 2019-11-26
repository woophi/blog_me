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
  DRIVER = 'Driver',
  DRIVER_BASIC = 'Driver_Basic',
  DRIVER_VIP = 'Driver_VIP',

  CLIENT = 'Client',
  CLIENT_VIP = 'Client_VIP',

  TENANT = 'Tenant',
  TENANT_BASIC = 'Tenant_Basic',
  TENANT_VIP = 'Tenant_VIP',
};
