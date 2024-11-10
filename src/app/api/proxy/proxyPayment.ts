import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paymentUrl = req.query.paymentUrl as string;

  if (!paymentUrl) {
    return res.status(400).json({ error: 'Payment URL is required' });
  }

  const response = await fetch(paymentUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const data = await response.text();
  res.send(data);
}
