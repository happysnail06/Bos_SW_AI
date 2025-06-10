'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, Lightbulb, Smile, Frown, Meh, UserCheck, FileText, Target, UserCog } from 'lucide-react';

// --- 로그 데이터 구조 (한국어) ---
type Turn = {
  turn: number;
  agent?: string;
  user?: string;
  info?: string; // 턴 외 메시지용
};

const LOG_TURNS: Turn[] = [
  { turn: 1, info: '[정보] 상담원 연결됨.' },
  { turn: 2, user: '[고객] 안녕하세요, 최근 출산해서 보험 좀 보려고요.', agent: '[상담원] 네, 정다은 고객님 축하드립니다! 어떤 점이 궁금하신가요?' },
  { turn: 3, user: '[고객] 기존 보험이 있는데, 이걸 어떻게 바꿔야 할지랑 아기 보험도 필요해서요.', agent: '[상담원] 네, 출산 후에는 보장 점검이 꼭 필요합니다. 기존 보험 증권 있으시면 확인 도와드릴까요?' },
  { turn: 4, user: '[고객] 네, 사진 찍어서 보내드릴게요. 잠시만요.', agent: '[상담원] 감사합니다. 확인 후 맞춤 플랜 안내드리겠습니다.' },
  { turn: 5, info: '[정보] 고객 보험 증권 이미지 수신.' },
  { turn: 6, agent: '[상담원] 확인 결과, 기존 보험은 일반 상해/질병 위주네요. 산모 특약과 자녀 보장은 추가가 필요합니다.', user: '[고객] 그럼 어떻게 하는 게 좋을까요?' },
  { turn: 7, agent: '[상담원] 산모 특약 강화 플랜과 신생아 필수 보장 포함된 어린이 보험 플랜 두 가지 설계안 보내드렸습니다.', user: '[고객] 네, 확인해 볼게요.' },
  { turn: 8, info: '[정보] 고객 설계안 확인 중... (5분 경과)' },
  { turn: 9, user: '[고객] 어린이 보험은 괜찮은 것 같은데, 제 건 좀 복잡하네요.', agent: '[상담원] 어떤 부분이 염려되시나요? 보장 내용 상세히 설명드릴게요.' },
  { turn: 10, user: '[고객] 보험료가 부담되지 않을까 해서요.', agent: '[상담원] 네, 기존 보험 일부 조정하고 필수 특약 위주로 구성하면 합리적인 설계 가능합니다. 예산 맞춰 조정해 드릴까요?' },
  { turn: 11, user: '[고객] 네, 그렇게 해주세요.', agent: '[상담원] 알겠습니다. 조정된 최종 설계안 곧 보내드리겠습니다.' },
  { turn: 12, info: '[정보] 최종 설계안 발송 및 계약 진행.' },
];

// --- 보고서 데이터 구조 및 샘플 데이터 (한국어) ---
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

const SCROLL_DURATION = 5000;
const FADE_DURATION = 500;
const INSIGHTS_DURATION = 7000;
const ELLIPSIS_INTERVAL = 500;

const InsightsDashboardAnimation: React.FC = () => {
  const [phase, setPhase] = useState<'scrolling' | 'fading' | 'insights' | 'initial'>('initial');
  const [ellipsis, setEllipsis] = useState('.');
  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  useEffect(() => {
    let timer1: NodeJS.Timeout, timer2: NodeJS.Timeout, timer3: NodeJS.Timeout;

    const startSequence = () => {
      setPhase('initial');
      setEllipsis('.');
      setCurrentReportIndex(prev => (prev + 1) % sampleReports.length);
      timer1 = setTimeout(() => setPhase('scrolling'), 500);
      timer2 = setTimeout(() => setPhase('fading'), 500 + SCROLL_DURATION);
      timer3 = setTimeout(() => setPhase('insights'), 500 + SCROLL_DURATION + FADE_DURATION);
    };

    startSequence();

    const cycleTime = 500 + SCROLL_DURATION + FADE_DURATION + INSIGHTS_DURATION + 1000;
    const resetTimer = setInterval(startSequence, cycleTime);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(resetTimer);
    };
  }, []);

  useEffect(() => {
    let ellipsisTimer: NodeJS.Timeout | undefined;
    if (phase === 'scrolling' || phase === 'initial') {
      ellipsisTimer = setInterval(() => {
        setEllipsis(prev => prev.length < 3 ? prev + '.' : '.');
      }, ELLIPSIS_INTERVAL);
    }
    return () => clearInterval(ellipsisTimer);
  }, [phase]);

  const currentReport = sampleReports[currentReportIndex];

  return (
    <div className="h-[500px] w-full border border-gray-300 rounded-lg p-4 bg-gray-50/50 shadow-md overflow-hidden relative text-xs">
      {/* Log Scrolling Phase */}
      <div className={`absolute inset-0 p-4 transition-opacity duration-${FADE_DURATION} ease-in-out ${(phase === 'scrolling' || phase === 'initial') ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 h-full overflow-hidden bg-black/5 rounded p-2 flex items-center opacity-40">
          <div className={`absolute top-0 left-0 w-full ${phase === 'scrolling' ? 'animate-log-scroll' : ''}`} style={{ animationDuration: `${LOG_TURNS.length * 0.5}s` }}>
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
          Processing Chat Log{ellipsis}
        </p>
      </div>

      {/* Insights Display Phase - Updated Layout with New KPIs */}
      <div className={`absolute inset-0 p-3 transition-opacity duration-${FADE_DURATION} ease-in-out ${phase === 'insights' ? 'opacity-100' : 'opacity-0'}`}>
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
    </div>
  );
};

export default InsightsDashboardAnimation; 