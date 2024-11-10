import React from 'react';
import Image from 'next/image';
const NoResults: React.FC = () => {
  return (
    <div className="mt-4 flex flex-col text-center justify-center items-center">
      <div className="bg-gray-200 rounded-full w-[130px]">
        <Image
          className="p-6"
          src="/images/svg/no-results.svg"
          alt="no results found icon"
          height={154}
          width={154}
        />
      </div>
      <p className="mt-2 text-gray-500">No Records Found</p>
    </div>
  );
};

export default NoResults;
