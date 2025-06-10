'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

const AnimatedInput = ({ label, placeholder, value, startDelay, isRunning }: { label: string; placeholder: string; value: string; startDelay: number, isRunning: boolean }) => {
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (isRunning) {
      // Clear previous text before starting
      setCurrentValue('');
      timer = setTimeout(() => {
        let i = 0;
        interval = setInterval(() => {
          setCurrentValue(value.substring(0, i + 1));
          i++;
          if (i >= value.length) {
            clearInterval(interval);
          }
        }, 50);
      }, startDelay);
    } else {
        setCurrentValue('');
    }

    return () => {
      clearTimeout(timer);
      if(interval) clearInterval(interval);
    };
  }, [value, startDelay, isRunning]);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          readOnly
          value={currentValue}
          placeholder={placeholder}
          className="block w-full text-sm px-3 py-1.5 bg-gray-100 border-gray-200 rounded-md focus:outline-none"
        />
        {currentValue.length < value.length && currentValue.length > 0 && (
           <div className="absolute inset-y-0 right-3 flex items-center">
             <motion.div
               className="w-0.5 h-4 bg-blue-500"
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 1, repeat: Infinity }}
             />
           </div>
        )}
      </div>
    </div>
  );
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.8,
        delayChildren: 0.5,
      },
    },
};

export default function Step1_UserProfileAnimation() {
  const [key, setKey] = useState(0);

  const fields = [
    { label: "이름", placeholder: "박서준", value: "박서준", delay: 500 },
    { label: "나이", placeholder: "28", value: "28", delay: 1200 },
    { label: "차량 모델", placeholder: "제네시스 G70", value: "제네시스 G70", delay: 1900 },
    { label: "요청사항", placeholder: "첫 차 보험, 합리적인 가격 원함", value: "첫 차 보험, 합리적인 가격 원함", delay: 3000 },
  ];

  const totalDuration = fields[fields.length - 1].delay + fields[fields.length - 1].value.length * 50 + 2000; // Total time + pause

  useEffect(() => {
    const timer = setInterval(() => {
      setKey(prevKey => prevKey + 1);
    }, totalDuration);
    return () => clearInterval(timer);
  }, [totalDuration]);
  
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200/80 w-full h-full flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={key}
    >
      <h3 className="text-sm font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center"><User className="w-4 h-4 mr-2 text-blue-500" />고객 프로필 설정</h3>
      <div className="space-y-3">
        {fields.map((field) => (
          <AnimatedInput 
            key={field.label}
            label={field.label} 
            placeholder={field.placeholder} 
            value={field.value}
            startDelay={field.delay}
            isRunning={key >= 0} // Pass isRunning prop
          />
        ))}
      </div>
    </motion.div>
  );
} 