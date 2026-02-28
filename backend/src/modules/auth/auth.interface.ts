export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};

export type TAuthResponse = {
  token: string;
  refreshToken?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};