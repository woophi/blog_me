export enum ROLES {
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

export type Claims = {
  id?: string;
  roles?: Array<ROLES>
}

export const oneDay = 86400;
export const tenDays = '10d';

export const tenDaysInMS = 10 * 24 * 60 * 60 * 1000;
