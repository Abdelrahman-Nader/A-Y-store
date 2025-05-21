export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}
