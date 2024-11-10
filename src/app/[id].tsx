import { useRouter } from 'next/router';
import React from 'react';

const MarketDetailPage = () => {
  const router = useRouter();
  const { id, name } = router.query;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Market Details</h1>
      <p>Market ID: {id}</p>
      <p>Market Name: {name}</p>
    </div>
  );
};

export default MarketDetailPage;
