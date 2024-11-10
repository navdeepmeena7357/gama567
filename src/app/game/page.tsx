'use client';

import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const GamePage: NextPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const openStatus = searchParams.get('open_status');

  console.log(`ID : ${id}, Name :  ${name} , Open Status : ${openStatus}`);

  const handleNavigation = (key: string) => {
    router.push(`/game/${key}?id=${id}&name=${name}`);
  };

  return (
    <div className="mt-12 h-screen">
      <div className="grid grid-cols-2 justify-items-center items-center divide-gray-300 border-gray-300">
        <div
          onClick={() => handleNavigation('single')}
          key={'single'}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_sa.png"
              width={54}
              height={54}
              alt="Single Digit"
            />
          </div>

          <h1 className="mt-2 text-sm">Single Ank</h1>
        </div>
        <div
          key={'single_bulk'}
          onClick={() => handleNavigation('single/bulk')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_sa.png"
              width={54}
              height={54}
              alt="Single Digit"
            />
          </div>
          <h1 className="mt-2 text-sm">Single Ank Bulk</h1>
        </div>

        {openStatus == '1' ? (
          <>
            <div
              key={'jodi'}
              onClick={() => handleNavigation('jodi')}
              className="p-4 flex flex-col items-center"
            >
              <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
                <Image
                  src="/images/bids/p_j.png"
                  width={54}
                  height={54}
                  alt="Jodi Digit"
                />
              </div>
              <h1 className="mt-2 text-sm">Jodi Digit</h1>
            </div>
            <div
              key={'jodi_bulk'}
              onClick={() => handleNavigation('jodi/bulk')}
              className="p-4 flex flex-col items-center"
            >
              <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
                <Image
                  src="/images/bids/p_j.png"
                  width={54}
                  height={54}
                  alt="Jodi Digit"
                />
              </div>
              <h1 className="mt-2 text-sm">Jodi Bulk</h1>
            </div>
          </>
        ) : (
          ''
        )}

        <div
          key={'sp'}
          onClick={() => handleNavigation('sp')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_sp.png"
              width={54}
              height={54}
              alt="Single Pana"
            />
          </div>
          <h1 className="mt-2 text-sm">Single Panna</h1>
        </div>
        <div
          key={'sp_bulk'}
          onClick={() => handleNavigation('sp/bulk')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5">
            <Image
              src="/images/bids/p_sp.png"
              width={54}
              height={54}
              alt="Single Pana"
            />
          </div>
          <h1 className="mt-2 text-sm">Single Panna Bulk</h1>
        </div>

        <div
          key={'dp'}
          onClick={() => handleNavigation('dp')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_dp.png"
              width={54}
              height={54}
              alt="Double Pana"
            />
          </div>
          <h1 className="mt-2 text-sm">Double Panna</h1>
        </div>
        <div
          key={'dp_bulk'}
          onClick={() => handleNavigation('dp/bulk')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_dp.png"
              width={54}
              height={54}
              alt="SinDoublegle Pana"
            />
          </div>
          <h1 className="mt-2 text-sm">Double Panna Bulk</h1>
        </div>

        <div
          key={'tp'}
          onClick={() => handleNavigation('tp')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_tp.png"
              width={54}
              height={54}
              alt="Double Pana"
            />
          </div>
          <h1 className="mt-2 text-sm">Triple Panna</h1>
        </div>
        <div key={'pana_family'} className="p-4 flex flex-col items-center">
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_pf.png"
              width={54}
              height={54}
              alt="SinDoublegle Pana"
            />
          </div>
          <h1 className="mt-2 text-sm">Panna Family</h1>
        </div>

        <div
          key={'sp_motor'}
          onClick={() => handleNavigation('sp_motor')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_spm.png"
              width={54}
              height={54}
              alt="Sp motor"
            />
          </div>
          <h1 className="mt-2 text-sm">SP Motor</h1>
        </div>
        <div
          key={'dp_motor'}
          onClick={() => handleNavigation('dp_motor')}
          className="p-4 flex flex-col items-center"
        >
          <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
            <Image
              src="/images/bids/p_dpm.png"
              width={54}
              height={54}
              alt="Dp motor"
            />
          </div>
          <h1 className="mt-2 text-sm">DP Motor</h1>
        </div>

        {openStatus == '1' ? (
          <>
            <div
              key={'jodi_family'}
              onClick={() => handleNavigation('jf')}
              className="p-4 flex flex-col items-center"
            >
              <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
                <Image
                  src="/images/bids/p_jf.png"
                  width={54}
                  height={54}
                  alt="Jodi Family"
                />
              </div>
              <h1 className="mt-2 text-sm">Jodi Family</h1>
            </div>
            <div
              key={'red_jodi'}
              onClick={() => handleNavigation('red_jodi')}
              className="p-4 flex flex-col items-center"
            >
              <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
                <Image
                  src="/images/bids/p_j.png"
                  width={54}
                  height={54}
                  alt="Red Jodi"
                />
              </div>
              <h1 className="mt-2 text-sm">Red Jodi</h1>
            </div>
          </>
        ) : (
          ''
        )}

        {openStatus == '1' ? (
          <>
            <div
              key={'half_sangam_a'}
              onClick={() => handleNavigation('hs_a')}
              className="p-4 flex flex-col items-center"
            >
              <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
                <Image
                  src="/images/bids/p_hs.png"
                  width={54}
                  height={54}
                  alt="Half Sangam A"
                />
              </div>
              <h1 className="mt-2 text-sm">Half Sangam A</h1>
            </div>
            <div
              key={'half_sangam_b'}
              onClick={() => handleNavigation('hs_b')}
              className="p-4 flex flex-col items-center"
            >
              <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
                <Image
                  src="/images/bids/p_hs.png"
                  width={54}
                  height={54}
                  alt="Half Sangam B"
                />
              </div>
              <h1 className="mt-2 text-sm">Half Sangam B</h1>
            </div>
            <div
              key={'full_sangam'}
              onClick={() => handleNavigation('full_sangam')}
              className="p-4 flex flex-col items-center"
            >
              <div className="rounded-full bg-white p-5 shadow-gray-300 shadow-sm">
                <Image
                  src="/images/bids/p_fs.png"
                  width={54}
                  height={54}
                  alt="Full Sangam"
                />
              </div>
              <h1 className="mt-2 text-sm">Full Sangam</h1>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default GamePage;
