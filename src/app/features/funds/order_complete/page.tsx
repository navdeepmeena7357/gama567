import SafeArea from '@/components/SafeArea';
import { IoCheckmarkDone } from 'react-icons/io5';

const OrderCompletePage = () => {
  return (
    <div className="bg-white h-screen flex items-center justify-center">
      <SafeArea>
        <div className="flex flex-col justify-center items-center text-center">
          <IoCheckmarkDone className="h-12 w-12 text-green-600" />
          <h1 className="font-semibold text-xl">Payment Completed!</h1>
          <p>Please close this page.</p>
        </div>
      </SafeArea>
    </div>
  );
};

export default OrderCompletePage;
