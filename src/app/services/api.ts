import { getTokenFromLocalStorage } from '@/utils/basic';

interface Bid {
  market_session: string;
  bet_digit: string;
  bet_amount: number;
  bet_type: string;
  user_id: number;
  market_id: number;
}

export interface PostBidsResponse {
  error_msg: string;
  response: 200;
  success: boolean;
}

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://matkafunapp.com/api/';

export interface Market {
  id: number;
  market_id: number;
  market_name: string;
  open_pana: string;
  close_pana: string;
  open_market_status: number;
  close_market_status: number;
  market_status: number;
  market_open_time: string;
  market_close_time: string;
  is_active: number;
  saturday_status: number;
  sunday_status: number;
}

export const getMarketInfo = async (id: number): Promise<Market> => {
  try {
    const response = await fetch(`${BASE_URL}/one_market_data_2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({ market_id: id }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: Market = await response.json();
    return data;
  } catch (error) {
    console.error('error:', (error as Error).message);
    throw new Error('Logout failed');
  }
};

export const postBids = async (bids: Bid[]): Promise<PostBidsResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/placeBids2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ bids }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: PostBidsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('error:', (error as Error).message);
    throw new Error('Logout failed');
  }
};

interface GameRates {
  id: number;
  market_name: string;
  market_rate: string;
}

export const getGameRates = async (): Promise<GameRates[]> => {
  try {
    const response = await fetch(`${BASE_URL}/game_rates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: GameRates[] = await response.json();
    return data;
  } catch (error) {
    console.error('error:', (error as Error).message);
    throw new Error('Something went wrong !');
  }
};

export interface BidsData {
  id: number;
  created_at: string;
  user_id: number;
  bet_type: string;
  is_win: number;
  bet_rate: number;
  bet_digit: string;
  market_id: number;
  bet_amount: number;
  market_session: string;
  bet_date: string;
  market_name: string;
}

export interface BidResponse {
  status: number;
  bidss: BidsData[];
}

interface CreateOrderRequest {
  key: string;
  client_txn_id: string;
  amount: string;
  p_info: string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  redirect_url: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
}

export interface CreateOrderResponse {
  status: boolean;
  msg: string;
  data: {
    order_id: number;
    payment_url: string;
    upi_id_hash: string;
    upi_intent?: {
      bhim_link?: string;
      phonepe_link?: string;
      paytm_link?: string;
      gpay_link?: string;
    };
  };
}

export async function createOrder(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.statusText}`);
  }

  return response.json();
}

interface DepositRequest {
  user_id: number;
  username: string;
  amount: number;
}

interface DepositResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    status: string;
    amount: number;
  };
}

export const createDepositRequest = async (
  data: DepositRequest
): Promise<DepositResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auto-deposit-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create deposit request');
    }

    return await response.json();
  } catch (error) {
    console.error('Deposit request error:', error);
    throw error;
  }
};
