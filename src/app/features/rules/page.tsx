'use client';
import ContactOptions from '@/components/ContactOptions';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';

const RulesAndRegulations = () => {
  return (
    <>
      <TitleBar title="Rules and Regulations" />
      <SafeArea>
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-4 text-pink-500">
            Withdraw Information
          </h2>
          <p className="mb-4">
            <span className="font-medium">
              Minimum withdraw amount is Rs. 1000.
            </span>
            If Users Entepink Wrong Bank Details MATKA FUN is Not Responsible.
            Before Requesting Withdraw Re-check Your Bank Details.
          </p>
          <ContactOptions />

          <div className="m-2"></div>

          <h2 className="text-lg font-semibold mb-4 text-pink-500">
            Unfair Bets
          </h2>
          <p className="mb-4">
            If Admin Found Any Unfair-bets, Blocking Of Digits, Canning Or Match
            Fix Bets. Admin has All Rights To Take Necessary Actions To Block
            The User.
          </p>
          <h2 className="text-lg font-semibold mb-4 text-pink-500">
            Cheating Bets
          </h2>
          <p className="mb-4">
            If Admin Found Any Cheating, Hacking, Phishing. Admin has All Rights
            To Take Necessary Actions To Block The User.
          </p>
          <h2 className="text-lg font-semibold mb-4 text-pink-500">
            Application
          </h2>
          <p>
            We have designed the application for you in such a way that everyone
            can use it or we have created the application keeping in mind every
            single person. Our focus is not in designing the application but on
            everyone who can use our app.
          </p>
        </div>
      </SafeArea>
    </>
  );
};

export default RulesAndRegulations;
