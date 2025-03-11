
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Scan, Camera, ChevronsUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  onScanComplete: (isEligible: boolean, isClaimed: boolean) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [scannerStarted, setScannerStarted] = useState(false);
  const { toast } = useToast();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanContainerRef = useRef<HTMLDivElement>(null);
  
  // Clean up scanner on component unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerStarted) {
        scannerRef.current.stop().catch(err => console.error('Error stopping scanner:', err));
      }
    };
  }, [scannerStarted]);
  
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
  
  const startScanner = async () => {
    if (!scanContainerRef.current) return;
    
    setIsScanning(true);
    
    try {
      scannerRef.current = new Html5Qrcode("qr-reader");
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };
      
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      );
      
      setScannerStarted(true);
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check permissions or try the manual entry.",
        variant: "destructive",
      });
    }
  };
  
  const onScanSuccess = (decodedText: string) => {
    // Stop the scanner once we have a successful scan
    if (scannerRef.current && scannerStarted) {
      scannerRef.current.stop().then(() => {
        setScannerStarted(false);
        verifyQrCode(decodedText);
      }).catch(err => {
        console.error('Error stopping scanner:', err);
      });
    }
  };
  
  const onScanFailure = (error: any) => {
    // Just log the error, don't show toast for each failure
    console.error("QR scan error:", error);
  };
  
  const stopScanner = () => {
    if (scannerRef.current && scannerStarted) {
      scannerRef.current.stop().then(() => {
        setScannerStarted(false);
        setIsScanning(false);
      }).catch(err => {
        console.error('Error stopping scanner:', err);
      });
    }
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
        {isScanning && !scannerStarted ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1 bg-expo-blue animate-pulse absolute" style={{ top: `${Math.random() * 100}%` }} />
            <Scan className="h-16 w-16 md:h-24 md:w-24 xl:h-32 xl:w-32 text-expo-green animate-pulse" />
          </div>
        ) : (
          <div ref={scanContainerRef} id="qr-reader" className="w-full h-full">
            {!scannerStarted && !isScanning && (
              <div className="flex flex-col items-center justify-center h-full">
                <ChevronsUp className="h-10 w-10 md:h-16 md:w-16 xl:h-24 xl:w-24 text-expo-green animate-bounce" />
                <span className="text-sm md:text-base xl:text-xl font-medium text-center mt-2 md:mt-4 px-4">
                  Place your LOOK LOOK QR code here
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {scannerStarted && (
        <Button 
          onClick={stopScanner} 
          variant="destructive"
          className="mb-4"
        >
          Stop Scanner
        </Button>
      )}
      
      {/* Demo input for simulating QR code entry */}
      <div className="w-full max-w-sm mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="Enter QR code (e.g., LOOK001)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            disabled={isScanning || scannerStarted}
          />
          <Button 
            onClick={handleSimulatedScan}
            disabled={isScanning || scannerStarted}
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
        onClick={startScanner} 
        disabled={isScanning || scannerStarted}
        className="bg-expo-green hover:bg-expo-green/90 text-lg md:text-xl xl:text-2xl p-6 md:p-8"
        size="lg"
      >
        <Camera className="mr-2 h-6 w-6" />
        {isScanning ? "Starting Camera..." : "Scan with Camera"}
      </Button>
    </div>
  );
};

export default QrScanner;
