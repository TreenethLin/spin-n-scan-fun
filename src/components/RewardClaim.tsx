
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, Printer, CheckCircle } from 'lucide-react';

interface RewardClaimProps {
  prize: string;
}

const RewardClaim: React.FC<RewardClaimProps> = ({ prize }) => {
  const [isClaimed, setIsClaimed] = useState(false);
  
  const handleClaim = () => {
    setIsClaimed(true);
  };
  
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md animate-bounce-in">
      <h2 className="text-xl font-bold mb-4">Step 4: Claim Your Reward!</h2>
      
      <div className="flex flex-col items-center mb-6 p-4 bg-gradient-to-br from-expo-purple to-expo-blue rounded-lg w-64 text-white">
        <Trophy className="h-16 w-16 text-yellow-300 mb-2" />
        <h3 className="text-lg font-bold">Congratulations!</h3>
        <p className="text-center mb-2">You've won:</p>
        <div className="text-2xl font-bold text-center p-2 bg-white/20 rounded-lg w-full">
          {prize}
        </div>
      </div>
      
      {!isClaimed ? (
        <Button 
          onClick={handleClaim} 
          className="bg-expo-green hover:bg-expo-green/90 flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Your Voucher
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle className="h-10 w-10 text-expo-green" />
          <p className="text-expo-green font-medium">Voucher Claimed!</p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Please show this screen to our staff to receive your prize.
          </p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-center text-muted-foreground">
        <p>Prizes are subject to availability.</p>
        <p>One prize per participant.</p>
      </div>
    </div>
  );
};

export default RewardClaim;
