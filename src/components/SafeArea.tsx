import React, { ReactNode } from 'react';

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
}

const SafeArea: React.FC<SafeAreaProps> = ({ children, className }) => {
  return <div className={`mt-14 p-2 ${className}`}>{children}</div>;
};

export default SafeArea;
