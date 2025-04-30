'use client';

import React, { useState, useEffect, useRef } from 'react';
// Import icons
import { CircleUserRound, Bot } from 'lucide-react'; 

type Message = {
  id: number;
  sender: 'agent' | 'customer';
  text: string;
};

type Demo = Message[];

// --- 사용자 프로필 (한국어, 데모에 해당) ---
type UserProfile = {
  name: string;
  age: number;
  location: string;
  need: string;
};

// Updated User Profiles
const userProfiles: UserProfile[] = [
  // 시나리오 1: 신규 가입 상담 (30대 직장인 / 실손보험)
  { name: "박서준", age: 32, location: "서울 마포", need: "실손 보험 신규 가입 문의" },
  // 시나리오 2: 기존 보험 개선 상담 (중복 가입 조정)
  { name: "최유나", age: 48, location: "기존 고객 (보험 3건 보유)", need: "기존 보험 점검 및 중복 보장 조정" },
  // 시나리오 3: 보험 리모델링 (출산 후)
  { name: "정다은", age: 35, location: "경기도 성남", need: "출산 후 보험 리모델링 및 자녀 보험 문의" },
  // 시나리오 4: 만기 도래 상담 (자동차 보험)
  { name: "이현우", age: 41, location: "기존 고객 (자동차 보험 만기 예정)", need: "자동차 보험 갱신 문의" },
  // 시나리오 5: 해지 및 환급 문의 상담
  { name: "강지영", age: 55, location: "가입 상품: 10년 만기 적립형", need: "적립형 보험 중도 해지 및 환급금 문의" },
];

// --- 5가지 다른 데모 대화 (한국어) ---
// Updated Demos with one more turn
const demos: Demo[] = [
  // 데모 1: 실손보험 신규 가입 (userProfiles[0]에 해당)
  [
    { id: 101, sender: 'agent', text: `안녕하세요, 박서준님. 오늘 어떤 보험 상담 도와드릴까요?` },
    { id: 102, sender: 'customer', text: `실손보험을 알아보고 있어요. 아직 가입은 안 했고요.` },
    { id: 103, sender: 'agent', text: `네, 최근에는 표준화된 실손보험이 기본이고, 통원·입원 모두 보장이 되며 자기부담금이 일부 있습니다. 혹시 병력 있으신가요?` },
    { id: 104, sender: 'customer', text: `작년에 경미한 디스크 진단받은 적은 있어요. 수술은 안 했고요.` },
    { id: 105, sender: 'agent', text: `그 정도라면 유병자 실손으로도 가입 가능할 수 있습니다. 몇 가지 확인 후에 가입 가능 여부와 예상 보험료를 안내드릴게요.` },
    { id: 106, sender: 'customer', text: `네, 그럼 확인 부탁드립니다.` },
    { id: 107, sender: 'agent', text: `네, 잠시만 기다려주세요. 관련 서류 확인 후 바로 안내드리겠습니다.` }
  ],
  // 데모 2: 기존 보험 개선 (userProfiles[1]에 해당)
  [
    { id: 201, sender: 'customer', text: `제가 보험이 3개나 되는데, 보장 내용이 겹치는 것 같아요. 점검 가능할까요?` },
    { id: 202, sender: 'agent', text: `네, 최유나님. 보험증권을 받아보고 분석해 드릴게요. 대체로 실손이나 암 보장이 중복된 경우가 많습니다.` },
    { id: 203, sender: 'customer', text: `암보험이 두 개 있는데, 둘 다 유지해야 할지 모르겠어요.` },
    { id: 204, sender: 'agent', text: `내용을 보니 둘 다 유사한 보장을 하고 있고, 하나는 갱신형이라 보험료가 계속 오를 수 있네요. 이 경우 하나는 정리하시는 걸 권장드립니다.` },
    { id: 205, sender: 'customer', text: `그럼 갱신형은 해지하고, 비갱신형 위주로 정리해 주세요.` },
    { id: 206, sender: 'agent', text: `알겠습니다. 그럼 해당 내용으로 조정 진행하고 완료되면 다시 연락드리겠습니다.` },
    { id: 207, sender: 'customer', text: `네, 감사합니다. 잘 부탁드려요.` }
  ],
  // 데모 3: 보험 리모델링 (출산 후) (userProfiles[2]에 해당)
  [
    { id: 301, sender: 'customer', text: `출산하고 나서 보험을 다시 정비하고 싶어요. 아이 보험도 알아보고요.` },
    { id: 302, sender: 'agent', text: `정다은님, 축하드립니다! 출산 후에는 자녀 보험뿐만 아니라 산모 관련 특약 조정도 필요해요. 현재 보장 중인 보험 있으신가요?` },
    { id: 303, sender: 'customer', text: `네, 결혼 전 들어둔 게 하나 있는데, 출산 관련 보장은 없어요.` },
    { id: 304, sender: 'agent', text: `그럼 산모 특약이 있는 여성 전용보험 추가와, 자녀용 어린이보험을 설계드릴게요. 알레르기, 입원, 골절 등 생활 밀착형 보장 위주로 구성할 수 있습니다.` },
    { id: 305, sender: 'customer', text: `네, 자녀 보험부터 먼저 확인해 보고 싶어요.` },
    { id: 306, sender: 'agent', text: `네, 그럼 자녀분께 필요한 핵심 보장 위주로 몇 가지 플랜을 준비해서 보여드리겠습니다.` },
    { id: 307, sender: 'customer', text: `좋아요. 태아 때 가입하는 게 좋다고 하던데 맞나요?` }
  ],
  // 데모 4: 만기 도래 상담 (자동차 보험) (userProfiles[3]에 해당)
  [
    { id: 401, sender: 'agent', text: `이현우님, 자동차 보험 만기 예정이신데, 갱신 계획 있으실까요?` },
    { id: 402, sender: 'customer', text: `네, 그대로 갱신할까 하는데 보험료가 오르진 않았나요?` },
    { id: 403, sender: 'agent', text: `전년도와 비교해 약 3만 원 정도 인상됐습니다. 사고 이력은 없으셔서 할인은 유지되지만, 전체 보험료가 인상됐어요.` },
    { id: 404, sender: 'customer', text: `보장 줄이면 좀 더 저렴하게 할 수 있나요?` },
    { id: 405, sender: 'agent', text: `자차 특약을 제외하면 약 25% 절감 가능합니다. 다만 차량 연식과 수리비 등을 고려해 결정하시는 걸 권장드립니다.` },
    { id: 406, sender: 'customer', text: `알겠습니다. 자차는 빼고 진행할게요.` },
    { id: 407, sender: 'agent', text: `네, 이현우님. 자차 특약 제외하고 갱신 처리 도와드리겠습니다. 처리 후 안내 문자 발송됩니다.` }
  ],
  // 데모 5: 해지 및 환급 문의 (userProfiles[4]에 해당)
  [
    { id: 501, sender: 'customer', text: `5년 전에 가입한 적립형 보험이 있는데, 해지하면 얼마나 받을 수 있나요?` },
    { id: 502, sender: 'agent', text: `강지영님, 가입하신 보험은 10년 만기 상품이라 지금 해지하면 원금보다 적은 환급금만 가능합니다. 중도해지 시 약 60% 수준입니다.` },
    { id: 503, sender: 'customer', text: `그럼 유지하는 게 나을까요?` },
    { id: 504, sender: 'agent', text: `현재 해지 사유와 목적에 따라 다릅니다. 급하게 자금이 필요하지 않다면, 중도인출이나 감액 완납 같은 절충안도 있어요.` },
    { id: 505, sender: 'customer', text: `감액 완납이 뭔가요?` },
    { id: 506, sender: 'agent', text: `납입은 중단하고 보장은 줄이면서 기존 납입금으로 유지하는 방식입니다. 원금 손해 없이 유지 가능한 경우도 있습니다.` },
    { id: 507, sender: 'customer', text: `감액 완납으로 하면 보장이 많이 줄어드나요?` },
    { id: 508, sender: 'agent', text: `네, 주계약 보장 금액이 줄어들게 됩니다. 정확한 내용은 가입 상품 기준으로 상세히 설명드릴 수 있습니다.` }
 ]
];

const STREAMING_SPEED = 50; // Milliseconds per character
const MESSAGE_INTERVAL = 1200; // Milliseconds between messages
const DEMO_PAUSE = 3500; // Milliseconds pause between demos
const ENCODING_DURATION = 3000; // Changed from 1500 to 2000 (2 seconds)
const ELLIPSIS_INTERVAL = 500; // Interval for ellipsis animation

const ChatSimulator: React.FC = () => {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState<'encoding' | 'chatting' | 'paused'>('encoding');
  const [ellipsis, setEllipsis] = useState('.'); // State for animated ellipsis

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Effect for managing phases and demo cycling
  useEffect(() => {
    let phaseTimer: NodeJS.Timeout;

    if (phase === 'encoding') {
      // Clear previous chat, wait for encoding animation
      setVisibleMessages([]);
      setDisplayedText('');
      setCurrentMessageIndex(0);
      setEllipsis('.'); // Reset ellipsis
      phaseTimer = setTimeout(() => {
        setPhase('chatting');
      }, ENCODING_DURATION);
    }
     else if (phase === 'chatting') {
      const currentDemo = demos[currentDemoIndex];
      if (currentMessageIndex >= currentDemo.length) {
        // Finished demo, pause before next
        setPhase('paused');
      }
    } else if (phase === 'paused') {
      // Wait, then cycle to next demo
      phaseTimer = setTimeout(() => {
        setCurrentDemoIndex((prevIndex) => (prevIndex + 1) % demos.length);
        setPhase('encoding');
      }, DEMO_PAUSE);
    }

    return () => clearTimeout(phaseTimer);
  }, [phase, currentDemoIndex, currentMessageIndex]);

  // Effect for animating ellipsis during encoding phase
  useEffect(() => {
    let ellipsisTimer: NodeJS.Timeout | undefined;
    if (phase === 'encoding') {
      ellipsisTimer = setInterval(() => {
        setEllipsis(prev => prev.length < 3 ? prev + '.' : '.');
      }, ELLIPSIS_INTERVAL);
    }
    // Clear interval if phase changes or component unmounts
    return () => clearInterval(ellipsisTimer);
  }, [phase]); 

  // Effect for streaming text message by message
  useEffect(() => {
    if (phase !== 'chatting') return;

    const currentDemo = demos[currentDemoIndex];
    if (currentMessageIndex >= currentDemo.length) return; // Already finished

    const targetMessage = currentDemo[currentMessageIndex];
    
    // Add the sender bubble immediately but wait for text streaming
    if (displayedText === '') {
        setVisibleMessages(prev => prev.length === currentMessageIndex ? [...prev, { ...targetMessage, text: '' }] : prev);
    }

    let charIndex = 0;
    const streamInterval = setInterval(() => {
      setDisplayedText(targetMessage.text.substring(0, charIndex + 1));
      charIndex++;
      if (charIndex >= targetMessage.text.length) {
        clearInterval(streamInterval);
        // Add fully formed message to history (replace placeholder)
        setVisibleMessages(prev => {
            const updated = [...prev];
            if (updated[currentMessageIndex]) {
                 updated[currentMessageIndex].text = targetMessage.text;
            }
            return updated;
        });
        // Wait a bit, then move to the next message
        setTimeout(() => {
          setDisplayedText('');
          setCurrentMessageIndex(prev => prev + 1);
        }, MESSAGE_INTERVAL);
      }
    }, STREAMING_SPEED);

    return () => clearInterval(streamInterval);

  }, [phase, currentDemoIndex, currentMessageIndex]);

  // Auto-scroll chat
   useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [visibleMessages, displayedText]); // Trigger scroll on new message/text update

  const currentProfile = userProfiles[currentDemoIndex]; // Get current profile

  return (
    <div className="h-[450px] w-full max-w-lg mx-auto border border-gray-300 rounded-lg p-4 bg-white/60 shadow-xl overflow-hidden relative font-mono text-sm">
      {/* Encoding Animation Overlay - Profile Box Injection */}
      {phase === 'encoding' && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
           {/* Text with animated ellipsis */}
           <p className="text-brand-blue font-semibold mb-4">
              프로필 인코딩 중{ellipsis} {/* 한국어 텍스트 */} 
           </p>
           
           {/* Add Customer Icon back above the profile box */}
           <CircleUserRound size={36} className="text-gray-500/70 mb-3" />

           {/* Static Profile Data Box */}
           <div className="text-left bg-gray-100 p-3 rounded border border-gray-300 w-full max-w-xs text-xs opacity-90">
             <p><span className="font-semibold">이름:</span> {currentProfile.name}</p>
             <p><span className="font-semibold">나이:</span> {currentProfile.age}</p>
             <p><span className="font-semibold">지역/보험:</span> {currentProfile.location}</p>
             <p><span className="font-semibold">필요사항:</span> {currentProfile.need}</p>
           </div>
         </div>
      )}

      {/* Chat Messages Area */} 
      <div ref={chatContainerRef} className="h-full overflow-y-auto flex flex-col space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-2">
        {visibleMessages.map((msg, index) => {
          if (!msg) return null; // Safety check
          const isLastMessage = index === visibleMessages.length - 1;
          const currentText = isLastMessage ? displayedText : msg.text;
          const showCursor = isLastMessage && phase === 'chatting' && currentText.length < msg.text.length; // Updated cursor logic
          const isAgent = msg.sender === 'agent';

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isAgent ? 'justify-start' : 'justify-end'}`}> 
              {/* Agent Icon (Use Bot) */}
              {isAgent && <Bot size={24} className="text-brand-blue/70 mb-1 flex-shrink-0" />} 

              {/* Message Bubble */}
              <div
                className={`flex animate-fade-in w-auto ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-full p-3 rounded-lg shadow-sm relative ${ // Allow full width if needed
                    isAgent 
                      ? 'bg-brand-cyan/20 text-brand-blue rounded-bl-none' 
                      : 'bg-gray-200 text-gray-800 rounded-br-none'
                  }`}
                >
                  <span>{currentText}</span>
                  {showCursor && <span className="inline-block w-0.5 h-4 bg-brand-blue ml-1 animate-blink align-text-bottom"></span>}
                </div>
              </div>

              {/* Customer Icon */}
              {!isAgent && <CircleUserRound size={24} className="text-gray-500/70 mb-1 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Add keyframes for animations in globals.css or a style tag if needed
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .animate-blink {
    animation: blink 1s step-end infinite;
  }
}
*/

export default ChatSimulator; 