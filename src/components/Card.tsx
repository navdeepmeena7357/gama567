import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white m-1 p-2 rounded-md card-shadow">{children}</div>
  );
};

export default Card;
