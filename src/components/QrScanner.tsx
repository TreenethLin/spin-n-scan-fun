
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Scan, QrCode, ChevronsUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QrScannerProps {
  onScanComplete: (isExistingUser: boolean) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  
  const handleUserQrScan = async () => {
    setIsScanning(true);
    
    try {
      // Simulate QR code scan - in production, this would be real QR code data
      const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase.functions.invoke('verify-participant', {
        body: { userId }
      });

      if (error) throw error;

      if (data.isEligible) {
        toast({
          title: "Welcome!",
          description: "You're eligible to spin the wheel!",
          variant: "default",
        });
      } else {
        toast({
          title: "Sorry!",
          description: "You've already participated.",
          variant: "destructive",
        });
      }
      
      onScanComplete(data.isEligible);
    } catch (error) {
      console.error('Error verifying participant:', error);
      toast({
        title: "Error",
        description: "There was a problem verifying your eligibility. Please try again.",
        variant: "destructive",
      });
      onScanComplete(false);
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-6 md:p-8 xl:p-10 bg-white rounded-lg shadow-md animate-fade-in">
      <h2 className="text-xl md:text-2xl xl:text-3xl font-bold mb-4 md:mb-6">Verify Your Account</h2>
      <div className="w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96 border-4 border-dashed border-expo-green rounded-lg flex items-center justify-center mb-6 md:mb-8 relative">
        {isScanning ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1 bg-expo-blue animate-pulse absolute" style={{ top: `${Math.random() * 100}%` }} />
            <Scan className="h-16 w-16 md:h-24 md:w-24 xl:h-32 xl:w-32 text-expo-green animate-pulse" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <ChevronsUp className="h-10 w-10 md:h-16 md:w-16 xl:h-24 xl:w-24 text-expo-green animate-bounce" />
            <span className="text-sm md:text-base xl:text-xl font-medium text-center mt-2 md:mt-4 px-4">
              Place your LOOK LOOK QR code here
            </span>
          </div>
        )}
      </div>
      <Button 
        onClick={handleUserQrScan} 
        disabled={isScanning}
        className="bg-expo-green hover:bg-expo-green/90 text-lg md:text-xl xl:text-2xl p-6 md:p-8"
        size="lg"
      >
        {isScanning ? "Verifying..." : "Scan My QR Code"}
      </Button>
    </div>
  );
};

export default QrScanner;
