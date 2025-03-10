
import React from 'react';
import { Trophy, CheckCircle } from 'lucide-react';

interface RewardClaimProps {
  prize: string;
}

const RewardClaim: React.FC<RewardClaimProps> = ({ prize }) => {
  return (
    <div className="flex flex-col items-center p-6 md:p-10 xl:p-12 bg-white rounded-lg shadow-md animate-bounce-in">
      <h2 className="text-xl md:text-2xl xl:text-3xl font-bold mb-4 md:mb-6 xl:mb-8">Your Reward!</h2>
      
      <div className="flex flex-col items-center mb-6 md:mb-8 xl:mb-10 p-6 md:p-8 xl:p-10 bg-gradient-to-br from-expo-purple to-expo-blue rounded-lg w-80 md:w-96 xl:w-120 text-white">
        <Trophy className="h-20 w-20 md:h-28 md:w-28 xl:h-36 xl:w-36 text-yellow-300 mb-4 md:mb-6" />
        <h3 className="text-xl md:text-2xl xl:text-3xl font-bold">Congratulations!</h3>
        <p className="text-center mb-4 md:text-lg xl:text-xl">You've won:</p>
        <div className="text-3xl md:text-4xl xl:text-5xl font-bold text-center p-4 md:p-6 bg-white/20 rounded-lg w-full">
          {prize}
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="h-16 w-16 md:h-24 md:w-24 xl:h-32 xl:w-32 text-expo-green" />
        <p className="text-expo-green font-medium text-xl md:text-2xl xl:text-3xl">Reward Claimed!</p>
        <p className="text-lg md:text-xl xl:text-2xl text-muted-foreground text-center mt-2 max-w-lg">
          Please see our staff to receive your prize.
        </p>
      </div>
      
      <div className="mt-6 md:mt-8 xl:mt-10 text-base md:text-lg xl:text-xl text-center text-muted-foreground">
        <p>Prizes are subject to availability.</p>
        <p>One prize per participant.</p>
      </div>
    </div>
  );
};

export default RewardClaim;
