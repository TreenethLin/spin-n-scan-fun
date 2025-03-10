
import React from 'react';
import { Trophy, CheckCircle, PawPrint } from 'lucide-react';

interface RewardClaimProps {
  prize: string;
}

const RewardClaim: React.FC<RewardClaimProps> = ({ prize }) => {
  return (
    <div className="flex flex-col items-center p-6 md:p-10 xl:p-12 bg-white rounded-2xl shadow-md animate-bounce-in max-w-4xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <PawPrint className="h-8 w-8 md:h-10 md:w-10 xl:h-12 xl:w-12 text-expo-orange" />
        <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold text-expo-purple">Your Reward!</h2>
      </div>
      
      <div className="flex flex-col items-center mb-8 md:mb-10 xl:mb-12 p-6 md:p-8 xl:p-10 bg-gradient-to-br from-expo-purple to-expo-blue rounded-2xl w-full max-w-2xl text-white">
        <Trophy className="h-20 w-20 md:h-28 md:w-28 xl:h-36 xl:w-36 text-yellow-300 mb-4 md:mb-6" />
        <h3 className="text-xl md:text-2xl xl:text-3xl font-bold">Congratulations!</h3>
        <p className="text-center mb-4 md:text-lg xl:text-xl">You've won:</p>
        <div className="text-3xl md:text-4xl xl:text-5xl font-bold text-center p-4 md:p-6 bg-white/20 backdrop-blur-sm rounded-lg w-full">
          {prize}
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4 bg-expo-pink/20 p-6 md:p-8 xl:p-10 rounded-2xl w-full max-w-2xl">
        <CheckCircle className="h-16 w-16 md:h-24 md:w-24 xl:h-32 xl:w-32 text-expo-green" />
        <p className="text-expo-green font-medium text-xl md:text-2xl xl:text-3xl">Reward Claimed!</p>
        <p className="text-lg md:text-xl xl:text-2xl text-gray-600 text-center mt-2 max-w-lg">
          Please see our staff to receive your prize.
        </p>
      </div>
      
      <div className="mt-8 md:mt-10 xl:mt-12 text-base md:text-lg xl:text-xl text-center text-gray-500">
        <p>Prizes are subject to availability.</p>
        <p>One prize per participant.</p>
      </div>
    </div>
  );
};

export default RewardClaim;
