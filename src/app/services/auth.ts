import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';

interface User {
  id: number;
  name: string;
  username: string;
  is_verified: number;
  is_deposit_allowed: number;
  status: number;
  is_withdraw_allowed: number;
  mobile: string | null;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  error: string | null;
  isError: boolean;
  token: string;
  message: string;
  user: User;
}

interface LogoutResponse {
  message: string;
}

interface UserProfile {
  user: User;
  points: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  is_verified: number;
  is_deposit_allowed: number;
  is_withdraw_allowed: number;
  status: number;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://laxmi777-app.in/api';

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: LoginResponse = await response.json();

    if (data.isError) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', (error as Error).message);
    throw new Error('Login failed');
  }
};

export const logout = async (token: string): Promise<LogoutResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: LogoutResponse = await response.json();

    if (data.message.includes('Error : ')) {
      throw new Error('Error Occurred');
    }

    return data;
  } catch (error) {
    console.error('error:', (error as Error).message);
    throw new Error('Logout failed');
  }
};

export const profile = async (): Promise<UserProfile> => {
  try {
    const response = await fetch(`${BASE_URL}/user_profile_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({ id: getUserIdFromToken() }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: UserProfile = await response.json();

    if (!data.user) {
      throw new Error('Error Occurred');
    }

    return data;
  } catch (error) {
    console.error('error:', (error as Error).message);
    throw new Error('Call failed');
  }
};
