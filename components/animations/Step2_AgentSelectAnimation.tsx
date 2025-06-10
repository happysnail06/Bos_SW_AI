'use client';

import { motion } from 'framer-motion';
import { Bot, MousePointer2, Car, ShieldPlus, Stethoscope } from 'lucide-react';
import { useState, useEffect } from 'react';

const icons: { [key: string]: React.ReactNode } = {
  "실비 보험 전문": <Stethoscope className="w-4 h-4 text-blue-500" />,
  "암보험 전문": <ShieldPlus className="w-4 h-4 text-green-500" />,
  "자동차 보험 전문": <Car className="w-4 h-4 text-red-500" />,
}

const AgentCard = ({ name, specialty, isSelected, hasBeenSelected }: { name: string, specialty: string, isSelected: boolean, hasBeenSelected: boolean }) => (
  <motion.div
    layout
    className={`p-3 rounded-lg border-2 relative overflow-hidden ${isSelected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'}`}
    animate={{ 
      scale: isSelected ? 1.05 : 1,
      opacity: hasBeenSelected && !isSelected ? 0.6 : 1,
    }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {isSelected && (
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-50 opacity-50"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: 'circOut' }}
      />
    )}
    <div className="relative flex items-center gap-3">
        {icons[name]}
        <div>
            <p className="font-semibold text-xs text-gray-800">{name}</p>
            <p className="text-gray-500 text-[11px]">{specialty}</p>
        </div>
    </div>
  </motion.div>
);

export default function Step2_AgentSelectAnimation() {
  const [selected, setSelected] = useState<number | null>(null);

  const agents = [
      { name: "실비 보험 전문", specialty: "기존 약관 비교 분석" },
      { name: "암보험 전문", specialty: "가족력 고려 보장 강화" },
      { name: "자동차 보험 전문", specialty: "사고 이력 기반 맞춤 설계" },
  ]

  useEffect(() => {
    const runSequence = () => {
        let i = 0;
        const selectionInterval = setInterval(() => {
            if (i < agents.length) {
                setSelected(i);
                i++;
            } else {
                clearInterval(selectionInterval);
            }
        }, 1500);
    };

    runSequence(); // Initial run
    const mainInterval = setInterval(() => {
        setSelected(null); // Reset
        setTimeout(runSequence, 500); // Run sequence after a short delay
    }, (agents.length + 1) * 1500 + 1000); // Total duration + pause

    return () => {
        clearInterval(mainInterval);
    };
  }, [agents.length]);

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200/80 w-full h-full flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-sm font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center"><Bot className="w-4 h-4 mr-2 text-green-500" />AI 에이전트 선택</h3>
      <div className="space-y-3 relative">
        {agents.map((agent, index) => (
            <AgentCard 
                key={agent.name}
                name={agent.name} 
                specialty={agent.specialty} 
                isSelected={selected === index}
                hasBeenSelected={selected !== null}
            />
        ))}
      </div>
    </motion.div>
  );
} 