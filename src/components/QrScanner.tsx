
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Scan, ChevronsUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QrScannerProps {
  onScanComplete: (isEligible: boolean, isClaimed: boolean) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const { toast } = useToast();
  
  // For demo purposes, we'll use a simple input field to simulate QR code scanning
  // In a real application, you'd use a camera-based QR code scanner
  const handleSimulatedScan = async () => {
    if (!qrInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a QR code",
        variant: "destructive",
      });
      return;
    }
    
    verifyQrCode(qrInput.trim());
  };
  
  const handleUserQrScan = async () => {
    setIsScanning(true);
    
    // In a real application, this would trigger the device camera
    // For demo, we'll use a random QR code from our test data
    const testQrCodes = ['LOOK001', 'LOOK002', 'LOOK003'];
    const randomQrCode = testQrCodes[Math.floor(Math.random() * testQrCodes.length)];
    
    setTimeout(() => {
      verifyQrCode(randomQrCode);
    }, 2000); // Simulate scanning delay
  };
  
  const verifyQrCode = async (qrCode: string) => {
    try {
      // Store the QR code in localStorage
      localStorage.setItem('wheelSpinQrCode', qrCode);
      
      const { data, error } = await supabase.functions.invoke('verify-participant', {
        body: { qrCode }
      });

      if (error) throw error;
      
      if (!data.isValid) {
        toast({
          title: "Invalid QR Code",
          description: data.message,
          variant: "destructive",
        });
        setIsScanning(false);
        return;
      }

      toast({
        title: data.isEligible ? "Welcome!" : "Already Participated",
        description: data.message,
        variant: data.isEligible ? "default" : "destructive",
      });
      
      onScanComplete(data.isEligible, data.isClaimed);
    } catch (error) {
      console.error('Error verifying QR code:', error);
      toast({
        title: "Error",
        description: "There was a problem verifying your QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-6 md:p-8 xl:p-10 bg-white rounded-lg shadow-md animate-fade-in">
      <h2 className="text-xl md:text-2xl xl:text-3xl font-bold mb-4 md:mb-6">Verify Your LOOK LOOK QR Code</h2>
      
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
      
      {/* Demo input for simulating QR code entry */}
      <div className="w-full max-w-sm mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="Enter QR code (e.g., LOOK001)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            disabled={isScanning}
          />
          <Button 
            onClick={handleSimulatedScan}
            disabled={isScanning}
            size="sm"
          >
            Submit
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">For demo: try LOOK001, LOOK002, or LOOK003</p>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">— OR —</p>
      </div>
      
      <Button 
        onClick={handleUserQrScan} 
        disabled={isScanning}
        className="bg-expo-green hover:bg-expo-green/90 text-lg md:text-xl xl:text-2xl p-6 md:p-8"
        size="lg"
      >
        {isScanning ? "Scanning..." : "Scan My QR Code"}
      </Button>
    </div>
  );
};

export default QrScanner;
