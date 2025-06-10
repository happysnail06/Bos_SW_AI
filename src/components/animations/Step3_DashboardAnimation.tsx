'use client';

import { motion, useInView, useAnimate, stagger, animate as motionAnimate } from 'framer-motion';
import { Bot, User, AreaChart, XCircle, Percent, MessageSquare, TrendingUp, ClipboardList } from 'lucide-react';
import { useEffect, useRef, ReactNode, useState } from 'react';

function AnimatedNumber({ to, delay }: { to: number, delay: number }) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const controls = motionAnimate(0, to, {
            duration: 1.2,
            delay: delay,
            onUpdate(value) {
                if (ref.current) {
                    ref.current.textContent = Math.round(value).toString();
                }
            }
        });
        return () => controls.stop();
    }, [to, delay]);

    return <span ref={ref}>0</span>;
}


const ChatBubble = ({ speaker, children }: { speaker: 'user' | 'bot', children: ReactNode }) => (
  <motion.div
    className={`flex items-start gap-2 ${speaker === 'user' ? 'justify-end' : ''}`}
  >
    {speaker === 'bot' && <Bot className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />}
    <div className={`text-xs px-3 py-1.5 rounded-lg max-w-[80%] shadow-md ${speaker === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
      {children}
    </div>
    {speaker === 'user' && <User className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />}
  </motion.div>
);

const Metric = ({ icon, label, value, unit, isNumeric=false }: { icon: ReactNode, label: string, value: string | number, unit?: string, isNumeric?: boolean }) => {
    return (
      <motion.div
        className="bg-gray-50/80 p-3 rounded-lg flex flex-col justify-between metric-item"
      >
        <div className="flex items-center text-gray-500 text-xs gap-1.5">{icon}{label}</div>
        <p className="text-xl font-bold text-gray-800 mt-1 flex items-baseline">
            {isNumeric ? <AnimatedNumber to={typeof value === 'number' ? value : 0} delay={1} /> : <span className="text-sm">{value}</span>}
            {unit && <span className="text-sm font-medium ml-0.5">{unit}</span>}
        </p>
      </motion.div>
    )
}

export default function Step3_DashboardAnimation() {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const [key, setKey] = useState(0);

  const totalDuration = 15000; // Estimated duration of one full loop + pause

  useEffect(() => {
      const timer = setInterval(() => {
          setKey(prev => prev + 1);
      }, totalDuration);
      return () => clearInterval(timer);
  }, [totalDuration]);

  useEffect(() => {
    if (isInView) {
        const enterAnimation = async () => {
            // Reset
            animate(".chat-container", { opacity: 1, filter: 'blur(0px)' });
            animate(".dashboard-container", { opacity: 0, display: "none" });

            // Chatting phase
            const chatBubbles = [".chat-bubble-1", ".chat-bubble-2", ".chat-bubble-3", ".chat-bubble-4", ".chat-bubble-5", ".chat-bubble-6"];
            for (const bubble of chatBubbles) {
                const x = bubble.includes("-1") || bubble.includes("-3") || bubble.includes("-5") ? [-20,0] : [20,0];
                await animate(bubble, { opacity: [0,1], x }, { duration: 0.4, delay: 0.3 });
            }

            // Analyzing phase
            await animate(".chat-container", { opacity: 0, filter: 'blur(10px)' }, { duration: 0.5, delay: 1 });
            await animate(".analyzer", { opacity: [0, 1] }, { duration: 0.3 });
            await animate(".analyzer", { opacity: 0 }, { duration: 0.3, delay: 1.5 });

            // Dashboard phase
            await animate(".dashboard-container", { display: "grid", opacity: [0, 1] }, { duration: 0.4 });
            animate(".metric-item", { opacity: [0, 1], y: [20, 0], scale: [0.9, 1] }, { duration: 0.5, delay: stagger(0.2) });
        }
        enterAnimation();
    }
  }, [isInView, animate, key]);


  return (
    <motion.div
      ref={scope}
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200/80 w-full h-full flex flex-col justify-center overflow-hidden"
      key={key}
    >
      <h3 className="text-sm font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center"><AreaChart className="w-4 h-4 mr-2 text-purple-500" />대화 분석 및 대시보드</h3>
      
      <div className="relative h-full w-full">
        {/* Chatting */}
        <motion.div className="space-y-2 chat-container" initial={{ opacity: 1 }}>
            <div className="chat-bubble-1 opacity-0"><ChatBubble speaker="bot">안녕하세요! 어떤 도움이 필요하신가요?</ChatBubble></div>
            <div className="chat-bubble-2 opacity-0"><ChatBubble speaker="user">자동차 보험 관련해서 문의드립니다.</ChatBubble></div>
            <div className="chat-bubble-3 opacity-0"><ChatBubble speaker="bot">네, 고객님. 기존 보험에서 어떤 점이 아쉬우셨나요?</ChatBubble></div>
            <div className="chat-bubble-4 opacity-0"><ChatBubble speaker="user">보장 범위는 넓고, 보험료는 저렴했으면 좋겠어요.</ChatBubble></div>
            <div className="chat-bubble-5 opacity-0"><ChatBubble speaker="bot">확인했습니다. AI가 최적의 플랜을 추천해드릴게요.</ChatBubble></div>
            <div className="chat-bubble-6 opacity-0"><ChatBubble speaker="user">네, 추천 플랜을 보여주세요.</ChatBubble></div>
        </motion.div>

        {/* Analyzing */}
        <motion.div className="absolute inset-0 flex items-center justify-center bg-white/50 analyzer" initial={{ opacity: 0 }}>
            <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <motion.span 
                    className="w-4 h-4 border-2 border-dashed border-purple-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                분석 중...
            </p>
        </motion.div>

        {/* Dashboard */}
        <motion.div className="absolute inset-0 dashboard-container grid-cols-2 grid-rows-3 gap-3" initial={{ opacity: 0, display: "none" }}>
            <Metric icon={<XCircle className="w-3.5 h-3.5 text-red-500"/>} label="상담 결과" value="실패" />
            <Metric icon={<Percent className="w-3.5 h-3.5 text-blue-500"/>} label="가입 확률" value={35} unit="%" isNumeric={true} />
            <Metric icon={<MessageSquare className="w-3.5 h-3.5 text-yellow-600"/>} label="핵심 키워드" value="#가격부담" />
            <Metric icon={<TrendingUp className="w-3.5 h-3.5 text-orange-500"/>} label="고객 감정" value="부정적" />

            <motion.div className="col-span-2 row-span-2 bg-gray-50/80 p-3 rounded-lg flex flex-col justify-start metric-item">
                <p className="text-gray-500 text-xs flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5 text-indigo-500"/>종합 피드백</p>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    초기 이탈 방어에 실패했습니다. 고객의 가격 민감도를 인지하고, 저렴한 플랜을 먼저 제시하는 방식으로 접근법을 수정해야 합니다.
                </p>
            </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
} 