'use client';

import React, { useState, useEffect, useRef } from 'react';
// Import icons
import { CircleUserRound, Bot, BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, Lightbulb, Smile, Frown, Meh, UserCheck, FileText, Target, UserCog } from 'lucide-react'; 

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

// --- 분석 데이터 구조 ---
type Turn = {
  turn: number;
  agent?: string;
  user?: string;
  info?: string;
};

type ReportData = {
  id: number;
  outcome: { text: string; success: boolean };
  sentiment: { trend: 'positive' | 'negative' | 'neutral' };
  highlights: string[];
  improvements: string[];
  suggestion: { persona: string; text: string };
  kpis: {
    factorAnalysis: string;
    strategyEfficiency: string;
    personalizationFit: string;
  };
};

// --- 로그 데이터 ---
const LOG_TURNS: Turn[] = [
  { turn: 1, info: '[정보] 상담원 연결됨.' },
  { turn: 2, user: '[고객] 안녕하세요, 최근 출산해서 보험 좀 보려고요.', agent: '[상담원] 네, 정다은 고객님 축하드립니다! 어떤 점이 궁금하신가요?' },
  { turn: 3, user: '[고객] 기존 보험이 있는데, 이걸 어떻게 바꿔야 할지랑 아기 보험도 필요해서요.', agent: '[상담원] 네, 출산 후에는 보장 점검이 꼭 필요합니다. 기존 보험 증권 있으시면 확인 도와드릴까요?' },
  { turn: 4, user: '[고객] 네, 사진 찍어서 보내드릴게요. 잠시만요.', agent: '[상담원] 감사합니다. 확인 후 맞춤 플랜 안내드리겠습니다.' },
  { turn: 5, info: '[정보] 고객 보험 증권 이미지 수신.' },
  { turn: 6, agent: '[상담원] 확인 결과, 기존 보험은 일반 상해/질병 위주네요. 산모 특약과 자녀 보장은 추가가 필요합니다.', user: '[고객] 그럼 어떻게 하는 게 좋을까요?' },
];

// --- 분석 보고서 데이터 ---
const sampleReports: ReportData[] = [
  {
    id: 1,
    outcome: { text: "플랜 제안 및 계약 진행", success: true },
    sentiment: { trend: 'positive' },
    highlights: ["고객 니즈(출산) 정확히 파악.", "보험료 우려에 대한 맞춤 조정 제안 효과적.", "명확한 플랜 설명."],
    improvements: ["초반 증권 확인 시간 단축 방안 모색.", "자녀 보험의 장기적 이점 추가 설명."],
    suggestion: { persona: "출산 후 여성 고객", text: "산모/자녀 동시 보장 플랜의 장점과 예산 조정 가능성을 먼저 제시."},
    kpis: {
      factorAnalysis: "맞춤형 조정 제안이 주효",
      strategyEfficiency: "기준 대비 +20%",
      personalizationFit: "90%"
    },
  },
  {
    id: 2,
    outcome: { text: "초기 제안 보류, 재상담 예정", success: false },
    sentiment: { trend: 'neutral' },
    highlights: ["고객 상황 공감 노력."],
    improvements: ["제안 플랜이 고객 예산 초과.", "보험 용어 설명 부족.", "구체적인 다음 단계 제시 미흡."],
    suggestion: { persona: "예산 민감 고객", text: "가장 저렴한 플랜부터 제시하고, 필수 보장 중심으로 단계적 설명."},
    kpis: {
      factorAnalysis: "예산 불일치 및 설명 부족",
      strategyEfficiency: "기준 대비 -10%",
      personalizationFit: "65%"
    },
  },
  {
    id: 3,
    outcome: { text: "어린이 보험 계약 완료", success: true },
    sentiment: { trend: 'positive' },
    highlights: ["어린이 보험 핵심 보장 명확히 전달.", "빠른 설계안 제시."],
    improvements: ["산모 보험의 필요성 강조 부족.", "추가적인 질문 유도 미흡."],
    suggestion: { persona: "자녀 우선 고려 고객", text: "자녀 보장의 중요성 강조 후, 자연스럽게 부모 보장 필요성 환기."},
    kpis: {
      factorAnalysis: "자녀 보험 중심 설명 효과적",
      strategyEfficiency: "기준 대비 +5%",
      personalizationFit: "75%"
    },
  },
];

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

const STREAMING_SPEED = 30; // Milliseconds per character (더 빠른 타이핑)
const MESSAGE_INTERVAL = 800; // Milliseconds between messages (더 짧은 간격)
const DEMO_PAUSE = 1000; // Shortened pause before analysis (더 짧은 휴지)
const ENCODING_DURATION = 2000; // 더 빠른 인코딩
const ELLIPSIS_INTERVAL = 400;

// Analysis phase constants (모든 분석 단계 빠르게)
const ANALYSIS_SCROLL_DURATION = 2500;
const ANALYSIS_FADE_DURATION = 300;
const ANALYSIS_INSIGHTS_DURATION = 4000;

const ChatSimulator: React.FC = () => {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState<'encoding' | 'chatting' | 'paused' | 'analysis-scrolling' | 'analysis-fading' | 'analysis-insights'>('encoding');
  const [ellipsis, setEllipsis] = useState('.'); 
  const [analysisEllipsis, setAnalysisEllipsis] = useState('.');
  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Effect for managing phases and demo cycling
  useEffect(() => {
    let phaseTimer: NodeJS.Timeout;

    if (phase === 'encoding') {
      // Clear previous chat, wait for encoding animation
      setVisibleMessages([]);
      setDisplayedText('');
      setCurrentMessageIndex(0);
      setEllipsis('.'); 
      phaseTimer = setTimeout(() => {
        setPhase('chatting');
      }, ENCODING_DURATION);
    }
     else if (phase === 'chatting') {
      const currentDemo = demos[currentDemoIndex];
      if (currentMessageIndex >= currentDemo.length) {
        // Finished demo, pause before analysis
        setPhase('paused');
      }
    } else if (phase === 'paused') {
      // Wait, then start analysis
      phaseTimer = setTimeout(() => {
        setPhase('analysis-scrolling');
        setCurrentReportIndex(prev => (prev + 1) % sampleReports.length);
      }, DEMO_PAUSE);
    } else if (phase === 'analysis-scrolling') {
      phaseTimer = setTimeout(() => {
        setPhase('analysis-fading');
      }, ANALYSIS_SCROLL_DURATION);
    } else if (phase === 'analysis-fading') {
      phaseTimer = setTimeout(() => {
        setPhase('analysis-insights');
      }, ANALYSIS_FADE_DURATION);
    } else if (phase === 'analysis-insights') {
      // Wait, then cycle to next demo
      phaseTimer = setTimeout(() => {
        setCurrentDemoIndex((prevIndex) => (prevIndex + 1) % demos.length);
        setPhase('encoding');
      }, ANALYSIS_INSIGHTS_DURATION);
    }

    return () => clearTimeout(phaseTimer);
  }, [phase, currentDemoIndex, currentMessageIndex]);

  // Effect for animating ellipsis during encoding and analysis phases
  useEffect(() => {
    let ellipsisTimer: NodeJS.Timeout | undefined;
    if (phase === 'encoding') {
      ellipsisTimer = setInterval(() => {
        setEllipsis(prev => prev.length < 3 ? prev + '.' : '.');
      }, ELLIPSIS_INTERVAL);
    } else if (phase === 'analysis-scrolling') {
      ellipsisTimer = setInterval(() => {
        setAnalysisEllipsis(prev => prev.length < 3 ? prev + '.' : '.');
      }, ELLIPSIS_INTERVAL);
    }
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
  }, [visibleMessages, displayedText]); 

  const currentProfile = userProfiles[currentDemoIndex]; 
  const currentReport = sampleReports[currentReportIndex];

  return (
    <div 
      className="h-[500px] mx-auto rounded-2xl p-6 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden relative font-sans text-sm"
      style={{ 
        width: '672px' // 고정 넓이
      }}
    >
      {/* Encoding Animation Overlay - Profile Box Injection */}
      {phase === 'encoding' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-md flex flex-col items-center justify-center z-10 p-6 rounded-2xl">
           {/* Text with animated ellipsis */}
           <p className="text-brand-blue font-semibold mb-6 text-lg">
              프로필 인코딩 중{ellipsis}
           </p>
           
           {/* Add Customer Icon back above the profile box */}
           <CircleUserRound size={40} className="text-brand-blue/60 mb-4" />

           {/* Static Profile Data Box */}
           <div 
             className="text-left bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-sm shadow-lg"
             style={{ 
               width: '384px' // 고정 넓이
             }}
           >
             <div className="space-y-2">
               <div className="flex flex-wrap">
                 <span className="font-semibold text-brand-blue min-w-[50px]">이름:</span> 
                 <span className="text-gray-700 ml-2">{currentProfile.name}</span>
               </div>
               <div className="flex flex-wrap">
                 <span className="font-semibold text-brand-blue min-w-[50px]">나이:</span> 
                 <span className="text-gray-700 ml-2">{currentProfile.age}세</span>
               </div>
               <div className="flex flex-wrap">
                 <span className="font-semibold text-brand-blue min-w-[50px]">지역:</span> 
                 <span className="text-gray-700 ml-2">{currentProfile.location}</span>
               </div>
               <div className="flex flex-col">
                 <span className="font-semibold text-brand-blue mb-1">필요사항:</span> 
                 <span className="text-gray-700 text-xs leading-relaxed break-words">{currentProfile.need}</span>
               </div>
             </div>
           </div>
         </div>
      )}

      {/* Chat Messages Area */} 
      {(phase === 'chatting' || phase === 'paused') && (
        <div ref={chatContainerRef} className="h-full overflow-y-auto flex flex-col space-y-4 scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent pr-3">
          {visibleMessages.map((msg, index) => {
            if (!msg) return null; // Safety check
            const isLastMessage = index === visibleMessages.length - 1;
            const currentText = isLastMessage ? displayedText : msg.text;
            const showCursor = isLastMessage && phase === 'chatting' && currentText.length < msg.text.length;
            const isAgent = msg.sender === 'agent';

            return (
              <div key={msg.id} className={`flex items-end gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}> 
                {/* Agent Icon */}
                {isAgent && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg mb-1 flex-shrink-0">
                    <Bot size={20} className="text-white" />
                  </div>
                )} 

                {/* Message Bubble */}
                <div
                  className={`flex animate-fade-in max-w-[75%] ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-md relative transition-all duration-200 hover:shadow-lg ${
                      isAgent 
                        ? 'bg-gradient-to-br from-brand-cyan/20 to-brand-blue/10 text-brand-blue border border-brand-cyan/20 rounded-bl-md' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800 border border-gray-200/50 rounded-br-md'
                    }`}
                  >
                    <span className="text-sm leading-relaxed">{currentText}</span>
                    {showCursor && <span className="inline-block w-0.5 h-4 bg-brand-blue ml-1 animate-blink align-text-bottom"></span>}
                  </div>
                </div>

                {/* Customer Icon */}
                {!isAgent && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg mb-1 flex-shrink-0">
                    <CircleUserRound size={20} className="text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Analysis Log Scrolling Phase */}
      {(phase === 'analysis-scrolling' || phase === 'analysis-fading') && (
        <div className={`absolute inset-0 p-4 transition-opacity duration-500 ease-in-out ${phase === 'analysis-scrolling' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 h-full overflow-hidden bg-black/5 rounded p-2 flex items-center opacity-40">
            <div className={`absolute top-0 left-0 w-full ${phase === 'analysis-scrolling' ? 'animate-log-scroll' : ''}`} style={{ animationDuration: `${LOG_TURNS.length * 0.3}s` }}>
              {/* Repeat logs for continuous scroll effect */}
              {[...LOG_TURNS, ...LOG_TURNS].map((turnData, index) => (
                <div key={`${turnData.turn}-${index}`} className="mb-3">
                  <p className="text-xs text-gray-500 font-semibold mb-0.5">대화 {turnData.turn}</p>
                  {turnData.agent && (
                    <p className="text-xs text-gray-700 whitespace-nowrap font-mono leading-relaxed ml-2">
                      <span className="text-blue-600 mr-1">▶</span>{turnData.agent}
                    </p>
                  )}
                  {turnData.user && (
                     <p className="text-xs text-gray-700 whitespace-nowrap font-mono leading-relaxed ml-2">
                      <span className="text-green-600 mr-1">▶</span>{turnData.user}
                     </p>
                  )}
                   {turnData.info && (
                     <p className="text-xs text-gray-500 whitespace-nowrap font-mono leading-relaxed ml-2 italic">
                      {turnData.info}
                     </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-2xl font-semibold text-brand-blue animate-pulse-opacity`}>
            대화 로그 분석 중{analysisEllipsis}
          </p>
        </div>
      )}

      {/* Analysis Insights Display Phase */}
      {phase === 'analysis-insights' && (
        <div className={`absolute inset-0 p-3 transition-opacity duration-500 ease-in-out opacity-100`}>
          <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full">

            {/* Outcome */} 
            <div className="col-span-1 row-span-1 bg-white/80 p-2 rounded border border-gray-200 flex flex-col justify-center items-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <p className="font-semibold mb-1">상담 결과</p>
              <span className={`px-2 py-0.5 rounded-full text-white text-xs ${currentReport.outcome.success ? 'bg-green-500' : 'bg-red-500'}`}>
                {currentReport.outcome.text}
              </span>
            </div>

            {/* Sentiment */} 
            <div className="col-span-1 row-span-1 bg-white/80 p-2 rounded border border-gray-200 flex flex-col justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="font-semibold mb-1">감정 동향</p>
              {currentReport.sentiment.trend === 'positive' && <Smile className="text-green-500" size={24}/>}
              {currentReport.sentiment.trend === 'negative' && <Frown className="text-red-500" size={24}/>}
              {currentReport.sentiment.trend === 'neutral' && <Meh className="text-yellow-500" size={24}/>}
            </div>

            {/* New KPI: Factor Analysis */} 
            <div className="col-span-1 row-span-1 bg-white/80 p-2 rounded border border-gray-200 flex flex-col justify-center items-center text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="font-semibold mb-1 flex items-center"><FileText size={14} className="mr-1"/> 성공/실패 요인</p>
              <p className="text-xs italic">{currentReport.kpis.factorAnalysis}</p>
            </div>

            {/* Highlights */} 
            <div className="col-span-1 row-span-1 bg-white/80 p-2 rounded border border-gray-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="font-semibold mb-1 text-green-600">주요 사항:</p>
              <ul className="space-y-1">
                {currentReport.highlights.map((item, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <CheckCircle2 size={14} className="mr-1.5 mt-0.5 text-green-500 flex-shrink-0"/> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */} 
            <div className="col-span-1 row-span-1 bg-white/80 p-2 rounded border border-gray-200 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="font-semibold mb-1 text-orange-600">개선점:</p>
              <ul className="space-y-1">
                {currentReport.improvements.map((item, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <XCircle size={14} className="mr-1.5 mt-0.5 text-orange-500 flex-shrink-0"/> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* New KPI: Strategy Efficiency & Personalization Fit */} 
            <div className="col-span-1 row-span-1 bg-white/80 p-2 rounded border border-gray-200 flex flex-col justify-center items-center text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="font-semibold mb-1 flex items-center"><Target size={14} className="mr-1"/> 전략 효율성</p>
              <p className="text-sm font-bold mb-2">{currentReport.kpis.strategyEfficiency}</p>
              <p className="font-semibold mb-1 flex items-center"><UserCog size={14} className="mr-1"/> 개인화 적합도</p>
              <p className="text-sm font-bold">{currentReport.kpis.personalizationFit}</p>
            </div>

            {/* Suggestion */} 
            <div className="col-span-3 row-span-1 bg-white/80 p-2 rounded border border-gray-200 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <p className="font-semibold mb-1 text-blue-600 flex items-center"><Lightbulb size={14} className="mr-1.5"/> 제안:</p>
              <div className="bg-blue-50 border border-blue-200 p-1.5 rounded">
                <p className="text-xs mb-0.5"><UserCheck size={14} className="inline mr-1"/> <span className="font-semibold">{currentReport.suggestion.persona}</span> 유형 고객:</p>
                <p className="text-xs italic">{currentReport.suggestion.text}</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSimulator; 