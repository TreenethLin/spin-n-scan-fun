
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Gift, RotateCw, PawPrint } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const PRIZES = [
  { name: "Pet Toy", color: "bg-expo-purple" },
  { name: "10% Off", color: "bg-expo-blue" },
  { name: "Pet Treat", color: "bg-expo-orange" },
  { name: "Free Sample", color: "bg-expo-pink" },
  { name: "50% Off", color: "bg-expo-green" },
  { name: "Pet Accessory", color: "bg-expo-purple" },
  { name: "20% Off", color: "bg-expo-blue" },
  { name: "Mystery Gift", color: "bg-expo-orange" }
];

interface SpinWheelProps {
  onPrizeWon: (prize: string) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onPrizeWon }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleSpin = () => {
    if (isSpinning || !canSpin) return;
    
    setIsSpinning(true);
    
    // Calculate a random prize
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const rotation = 1800 + (360 / PRIZES.length) * prizeIndex;
    
    // Set CSS variable for rotation
    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--spin-rotation', `${rotation}deg`);
    }
    
    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      setCanSpin(false);
      toast({
        title: "Congratulations! 🎉",
        description: `You won: ${PRIZES[prizeIndex].name}`,
      });
      onPrizeWon(PRIZES[prizeIndex].name);
    }, 3500);
  };
  
  // Create confetti effect when spinning stops
  const [confetti, setConfetti] = useState<Array<{ id: number; color: string; top: number; left: number; delay: number }>>([]);
  
  useEffect(() => {
    if (!isSpinning && !canSpin) {
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: PRIZES[Math.floor(Math.random() * PRIZES.length)].color,
        top: Math.random() * 20 - 10,
        left: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setConfetti(newConfetti);
    }
  }, [isSpinning, canSpin]);
  
  return (
    <div className="flex flex-col items-center p-6 md:p-8 xl:p-10 bg-white rounded-2xl shadow-md relative animate-fade-in max-w-4xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <PawPrint className="h-8 w-8 md:h-10 md:w-10 xl:h-12 xl:w-12 text-expo-orange" />
        <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold text-expo-purple">Spin the Wheel!</h2>
      </div>
      
      {/* Confetti layer */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className={`confetti ${c.color}`}
          style={{
            top: `${c.top}%`,
            left: `${c.left}%`,
            '--fall-delay': `${c.delay}s`,
            '--fall-duration': `${3 + Math.random() * 2}s`,
          } as React.CSSProperties}
        />
      ))}
      
      {/* The wheel */}
      <div className="relative w-72 h-72 mb-8 md:w-96 md:h-96 xl:w-120 xl:h-120">
        {/* Center pointer */}
        <div className="absolute top-0 left-1/2 -ml-4 w-8 h-8 bg-white shadow-md z-10 transform rotate-45"></div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef} 
          className={`relative w-full h-full rounded-full overflow-hidden border-4 border-expo-pink shadow-lg ${isSpinning ? 'animate-spin-wheel' : ''}`}
        >
          {PRIZES.map((prize, i) => (
            <div 
              key={i}
              className={`wheel-segment ${prize.color}`}
              style={{ transform: `rotate(${(360 / PRIZES.length) * i}deg)` }}
            >
              <div className="absolute top-10 left-1/2 -ml-12 w-24 text-center text-white font-bold text-xs md:text-sm xl:text-base rotate-90">
                {prize.name}
              </div>
            </div>
          ))}
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center md:w-24 md:h-24 xl:w-32 xl:h-32">
              <Gift className="h-8 w-8 text-expo-purple md:h-12 md:w-12 xl:h-16 xl:w-16" />
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSpin} 
        disabled={isSpinning || !canSpin}
        className="bg-expo-orange hover:bg-expo-orange/90 text-white flex items-center gap-2 text-lg md:text-xl xl:text-2xl p-6 md:p-8 rounded-full"
        size="lg"
      >
        <RotateCw className={`${isSpinning ? "animate-spin" : ""} h-6 w-6 md:h-8 md:w-8`} />
        {isSpinning ? "Spinning..." : canSpin ? "Spin Now!" : "Already Spun"}
      </Button>
    </div>
  );
};

export default SpinWheel;
