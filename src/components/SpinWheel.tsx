import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Gift, RotateCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SpinWheelProps {
  onPrizeWon: (prize: string) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onPrizeWon }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [prizes, setPrizes] = useState([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data } = await supabase
        .from('prizes')
        .select()
        .eq('active', true)
        .order('created_at', { ascending: true });
      
      if (data) {
        setPrizes(data);
      }
    };

    fetchPrizes();
  }, []);

  const handleSpin = async () => {
    if (isSpinning || !canSpin) return;
    
    setIsSpinning(true);
    
    try {
      const userId = localStorage.getItem('wheelSpinUserId');
      
      const { data, error } = await supabase.functions.invoke('spin-wheel', {
        body: { 
          userId,
          ip: window.location.hostname
        }
      });

      if (error) throw error;

      const prizeIndex = prizes.findIndex(p => p.name === data.prize);
      const rotation = 1800 + (360 / prizes.length) * prizeIndex;
      
      if (wheelRef.current) {
        wheelRef.current.style.setProperty('--spin-rotation', `${rotation}deg`);
      }
      
      setTimeout(() => {
        setIsSpinning(false);
        setCanSpin(false);
        toast({
          title: "Congratulations! 🎉",
          description: `You won: ${data.prize}`,
        });
        onPrizeWon(data.prize);
      }, 3500);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      setIsSpinning(false);
      toast({
        title: "Error",
        description: "There was a problem spinning the wheel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [confetti, setConfetti] = useState<Array<{ id: number; color: string; top: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (!isSpinning && !canSpin) {
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: prizes[Math.floor(Math.random() * prizes.length)].color,
        top: Math.random() * 20 - 10,
        left: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setConfetti(newConfetti);
    }
  }, [isSpinning, canSpin]);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md relative animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Spin the Wheel!</h2>
      
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
      
      <div className="relative w-72 h-72 mb-6 md:w-96 md:h-96 xl:w-120 xl:h-120">
        <div className="absolute top-0 left-1/2 -ml-3 w-6 h-6 bg-white shadow-md z-10 transform rotate-45"></div>
        
        <div 
          ref={wheelRef} 
          className={`relative w-full h-full rounded-full overflow-hidden border-4 border-gray-200 ${isSpinning ? 'animate-spin-wheel' : ''}`}
        >
          {prizes.map((prize, i) => (
            <div 
              key={i}
              className={`wheel-segment ${prize.color}`}
              style={{ transform: `rotate(${(360 / prizes.length) * i}deg)` }}
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
        className="bg-expo-orange hover:bg-expo-orange/90 flex items-center gap-2 text-lg md:text-xl xl:text-2xl p-6 md:p-8"
        size="lg"
      >
        <RotateCw className={`${isSpinning ? "animate-spin" : ""} h-6 w-6 md:h-8 md:w-8`} />
        {isSpinning ? "Spinning..." : canSpin ? "Spin Now!" : "Already Spun"}
      </Button>
    </div>
  );
};

export default SpinWheel;
