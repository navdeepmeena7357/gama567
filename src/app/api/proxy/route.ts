import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const response = await fetch('https://api.ekqr.in/api/create_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + error },
      { status: 500 }
    );
  }
}
