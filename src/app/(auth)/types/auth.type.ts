export type SignUpPayload = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: string;
}

export type SignUpResponse = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string | null;
  gender: boolean;
  role: string;
};

export type SignInPayload = {
  email: string;
  password: string;
}
export type SignInResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthday: string;
    avatar: string;
    gender: boolean;
    role: string;
  };
  token: string;
};