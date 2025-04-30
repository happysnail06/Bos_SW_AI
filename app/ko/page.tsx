'use client'; // Mark as Client Component

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Image from 'next/image';
import { ArrowRight, UsersRound, BrainCircuit, TrendingUp } from 'lucide-react';
import ChatSimulator from '@/components/ChatSimulator'; // Assuming component paths remain the same
import InsightsDashboardAnimation from '@/components/InsightsDashboardAnimation'; // Assuming component paths remain the same
import DemoRequestButton from '@/components/DemoRequestButton'; // Import the new component
import axios from 'axios'; // Import axios

// --- FAQ 데이터 (한국어) ---
const faqs = [
  {
    question: "BoA는 대화를 어떻게 모델링하나요?",
    answer: "저희는 보험 시나리오에 대해 훈련된 고급 AI 언어 모델을 사용하여 정의된 페르소나와 목표에 따라 현실적인 에이전트와 고객 대화를 시뮬레이션합니다.",
  },
  {
    question: "에이전트와 고객 페르소나를 맞춤 설정할 수 있나요?",
    answer: "물론입니다. 에이전트와 고객 시뮬레이터 모두에 대해 특정 특성, 목표, 지식 수준, 심지어 이의 제기 처리 스타일까지 정의할 수 있습니다.",
  },
  {
    question: "어떤 종류의 통찰력을 기대할 수 있나요?",
    answer: "저희 분석 대시보드는 전환율, 응답 시간, 성공적인 이의 제기 처리, 스크립트 준수 여부에 대한 지표를 제공하고 개선을 위한 핵심 순간을 식별합니다.",
  },
  {
    question: "신규 에이전트 교육에 적합한가요?",
    answer: "네, 온보딩에 이상적인 도구입니다. 신규 에이전트는 안전한 시뮬레이션 환경에서 연습하고 다양한 시나리오에 대한 성과에 대해 즉각적인 피드백을 받을 수 있습니다.",
  },
  {
    question: "기존의 역할 연기와 어떻게 다른가요?",
    answer: "BoA는 확장 가능하고 일관되며 데이터 기반의 연습을 제공합니다. AI는 더 넓은 범위의 고객 유형을 시뮬레이션하고 인간 주도의 역할 연기와 달리 객관적인 성과 분석을 제공합니다.",
  },
];

export default function InsuranceSimulationKoreanPage() { // Changed function name for clarity
  // --- State Variables ---
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerComments, setRegisterComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // --- Helper Functions (Ported from index.html) ---
  const getCookieValue = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined; // Check for browser environment
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return undefined;
  };

  const setCookieValue = (name: string, value: string, days: number): void => {
    if (typeof document === 'undefined') return; // Check for browser environment
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const getUVfromCookie = (): string => {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingHash = getCookieValue("user");
    if (!existingHash) {
      setCookieValue("user", hash, 180); // Set cookie for 6 months
      return hash;
    } else {
      return existingHash;
    }
  };

  const padValue = (value: number): string => {
    return (value < 10) ? "0" + value : String(value);
  };

  const getTimeStamp = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${padValue(year)}-${padValue(month)}-${padValue(day)} ${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
  };

  const addrScript = 'https://script.google.com/macros/s/AKfycbw3ahmE_uVCRv6cX6Cl2d1QSPMbWGJZwgdDeRsMOKWWx8KwFpScU23QYLH_CIxmwe_w/exec';

  // --- Effects ---

  // Effect to get User ID on mount
  useEffect(() => {
    setUserId(getUVfromCookie());
  }, []); // Empty dependency array means run once on mount

  // Effect to get IP Address
  useEffect(() => {
    // Use a public API to get the IP address
    axios.get('https://api.ipify.org?format=json')
      .then(response => {
        setIpAddress(response.data.ip);
      })
      .catch(error => {
        console.error("Error fetching IP address:", error);
        setIpAddress('unknown'); // Set to unknown on error
      });
  }, []); // Run once on mount

  // Effect to log visitor data when IP address and User ID are available
  useEffect(() => {
    if (ipAddress && userId && typeof window !== 'undefined' && typeof navigator !== 'undefined' && typeof document !== 'undefined') {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const utm = urlParams.get("utm");
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      const visitorData = JSON.stringify({
        "id": userId,
        "landingUrl": window.location.href,
        "ip": ipAddress,
        "referer": document.referrer || 'direct',
        "time_stamp": getTimeStamp(),
        "utm": utm || 'none',
        "device": isMobile ? 'mobile' : 'desktop'
      });

      console.log("Sending visitor data:", visitorData);

      axios.get(`${addrScript}?action=insert&table=insurance_visitors&data=${visitorData}`)
        .then(response => {
          console.log('Visitor log success:', JSON.stringify(response.data));
        })
        .catch(error => {
          console.error('Visitor log failed:', error);
          if (error.response) {
            console.error('Error Response:', error.response.data);
          } else if (error.request) {
            console.error('Error Request:', error.request);
          } else {
            console.error('Error Message:', error.message);
          }
        });
    }
  }, [ipAddress, userId]); // Rerun this effect if ipAddress or userId changes

  // --- Event Handlers ---
  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    if (!registerEmail || !/^\S+@\S+\.\S+$/.test(registerEmail)) {
        alert("유효한 이메일 주소를 입력해주세요.");
        setIsSubmitting(false);
        return;
    }

    // Check if userId is available
    if (!userId) {
        console.error("User ID not available for submission.");
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요. (User ID missing)");
        setIsSubmitting(false);
        return;
    }


    const submissionData = JSON.stringify({
      "id": userId, // Use the state variable
      "email": registerEmail,
      "advice": registerComments, // Map comment state to advice field
      "type": "advice", // Using 'advice' type as in the original index.html for this form
      "time_stamp": getTimeStamp()
    });

    console.log("Sending registration/advice data:", submissionData);

    try {
      const response = await axios.get(`${addrScript}?action=insert&table=insurance_log&data=${submissionData}`);
      console.log('Submission success:', response.data);
      alert("등록되었습니다. 감사합니다!"); // Simple success alert
      setRegisterEmail(''); // Clear form
      setRegisterComments('');
    } catch (error) {
      console.error('Submission failed:', error);
      alert("등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      // Log detailed error
      if (axios.isAxiosError(error)) { // Type guard for AxiosError
          if (error.response) {
              console.error('Error Response:', error.response.data);
          } else if (error.request) {
              console.error('Error Request:', error.request);
          } else {
              console.error('Error Message:', error.message);
          }
      } else {
          console.error('Unexpected error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[rgb(var(--foreground-rgb))]">
      {/* 간소화된 네비게이션 바 */}
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-3xl font-bold font-serif text-brand-blue">BoA</div>
          <button className="text-brand-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <hr className="border-t border-gray-400" />
        </div>
      </nav>

      <main className="pt-28 md:pt-36">
        <header className="max-w-7xl mx-auto px-6 pt-6 md:pt-8 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="md:w-1/2 text-left">
            <h1 className="text-4xl md:text-6xl font-bold font-serif leading-[3rem] md:leading-[5rem] mb-6">
              <span className="block bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                AI 보험 시뮬레이션:
              </span>
              <span className="block bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                최적의 전략,
              </span>
              <span className="block bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                최고의 성과.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-2xl font-serif">
              현실적인 대화 시뮬레이션으로 최적의 보험 상담 전략을 찾고, <br /> 기업 성과를 극대화하세요.
            </p>
            <div className="mt-10 flex items-center space-x-4">
              <a 
                href="#get-started" // 링크는 동일하게 유지
                className="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
              >
                데모 요청
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <a 
                href="#get-started" // 링크는 동일하게 유지
                className="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
              >
                관심 등록
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <ChatSimulator /> {/* 컴포넌트는 그대로 사용 */}
          </div>
        </header>

        <hr className="border-t border-gray-400 mt-8 mb-2 md:mt-12 md:mb-4 max-w-7xl mx-auto px-6" />

        {/* --- 서비스 설명 섹션 (카드 스타일 - 업데이트) --- */}
        <section id="description" className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-12 text-center">"고객 설득? 이제 AI가 도와드립니다."</h2> 
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
          {/* Card 1 */}
          <div className="
                relative overflow-hidden rounded-2xl p-12
                bg-white/30 backdrop-blur-lg border border-transparent
                shadow-md transition-all duration-300 group
                hover:scale-105 hover:shadow-xl hover:border-brand-cyan
              ">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-cyan"></div>
                <div className="relative z-10 mb-4 p-3 bg-brand-cyan/20 rounded-full inline-block">
                  <UsersRound size={36} className="text-brand-cyan" />
                </div>
                <h3 className="relative z-10 text-xl font-bold font-serif mb-3 text-[rgb(var(--foreground-rgb))]">
                  1. 상담 전략 검증
                </h3>
                <p className="relative z-10 text-base leading-relaxed font-serif text-gray-700">
                  <span className="block">
                    실제 고객 데이터를 바탕으로 다양한 유저 페르소나를 모델링하고,
                  </span>
                  <span className="block">
                    보험사 상품을 에이전트에
                  </span>
                  <span className="block">
                    학습시켜 전략을 검증합니다.
                  </span>
                </p>
                <span className="
                  absolute bottom-4 right-4 z-10 flex items-center
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  text-brand-cyan
                ">
                  <ArrowRight size={20} />
                </span>
              </div>

              {/* Card 2 */}
              <div className="
                relative overflow-hidden rounded-2xl p-12
                bg-white/30 backdrop-blur-lg border border-transparent
                shadow-md transition-all duration-300 group
                hover:scale-105 hover:shadow-xl hover:border-brand-cyan
              ">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-cyan"></div>
                <div className="relative z-10 mb-4 p-3 bg-brand-cyan/20 rounded-full inline-block">
                  <BrainCircuit size={36} className="text-brand-cyan" />
                </div>
                <h3 className="relative z-10 text-xl font-bold font-serif mb-3 text-[rgb(var(--foreground-rgb))]">
                  2. AI 전략 도출 및 분석
                </h3>
                <p className="relative z-10 text-base leading-relaxed font-serif text-gray-700">
                  <span className="block">
                    상담 시나리오 반복 시뮬레이션으로 고객 유형별 최적 상담 전략을 AI가 도출하고, 상품 반응, 
                  </span>
                  <span className="block">
                    설득률 등을 정량 평가합니다.
                  </span>
                </p>
                <span className="
                  absolute bottom-4 right-4 z-10 flex items-center
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  text-brand-cyan
                ">
                  <ArrowRight size={20} />
                </span>
              </div>

              {/* Card 3 */}
              <div className="
                relative overflow-hidden rounded-2xl p-12
                bg-white/30 backdrop-blur-lg border border-transparent
                shadow-md transition-all duration-300 group
                hover:scale-105 hover:shadow-xl hover:border-brand-cyan
              ">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-cyan"></div>
                <div className="relative z-10 mb-4 p-3 bg-brand-cyan/20 rounded-full inline-block">
                  <TrendingUp size={36} className="text-brand-cyan" />
                </div>
                <h3 className="relative z-10 text-xl font-bold font-serif mb-3 text-[rgb(var(--foreground-rgb))]">
                  3. 효율성 및 성과 극대화
                </h3>
                <p className="relative z-10 text-base leading-relaxed font-serif text-gray-700">
                  <span className="block">
                    리스크 관리와 언더라이팅 효율을 최적화하여 전환율 및 고객 만족도를 동시에 높여, 기업 성과를
                  </span>
                  <span className="block">
                     극대화합니다.
                  </span>
                </p>
                <span className="
                  absolute bottom-4 right-4 z-10 flex items-center
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  text-brand-cyan
                ">
                  <ArrowRight size={20} />
                </span>
              </div>
                      
          </div>
        </section>
        {/* --- 섹션 종료 --- */}

        {/* --- Moved Insights Section Here --- */}
        <hr className="border-t border-gray-400 my-8 md:my-12 max-w-6xl mx-auto px-6" />

        <section id="insights" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start gap-12">
            {/* 왼쪽 : 텍스트 - 스타일 업데이트 */}
            <div className="md:w-1/2">
 
              {/* 대형 태그라인 - 그라디언트 적용 */}
              <h2 className="text-5xl md:text-6xl font-bold font-serif mb-8 bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                정교한 분석
              </h2>
 
              {/* 주요 인사이트 포인트 - 스타일 업데이트 V2 */}
              <ul className="mt-8 space-y-4 text-lg text-gray-700 leading-relaxed font-serif list-none pl-0">
                <li className="border-l-4 border-brand-cyan pl-4 py-3">
                  <div>
                    <strong className="text-[rgb(var(--foreground-rgb))]">상담 결과 요인 분석:</strong><br/>
                    대화 흐름을 분석해 성공과 실패를 가른 주요 요인을 식별하고, 개선 방향을 도출합니다.
                  </div>
                </li>
                <li className="border-l-4 border-brand-cyan pl-4 py-3">
                  <div>
                    <strong className="text-[rgb(var(--foreground-rgb))]">전략 효과 비교:</strong><br/>
                    <span className="block">고객 상황에 따른 응대 전략의 효과를 비교 분석하여, </span> 
                    <span className="block">실행력 있는 방향을 제시합니다.</span>
                  </div>
                </li>
                <li className="border-l-4 border-brand-cyan pl-4 py-3">
                  <div>
                    <strong className="text-[rgb(var(--foreground-rgb))]">개인화 전략 최적화:</strong><br/>
                    <span className="block">고객 특성과 상담 맥락을 반영해 맞춤형 응대 및 추천 전략을 </span>
                    <span className="block">정교하게 설계합니다.</span>
                  </div>
                </li>
 
              </ul>
 
            </div>
 
            {/* 오른쪽 : 대시보드 애니메이션 - 컨테이너 높이 추가 */}
            <div className="md:w-1/2 h-[500px]">
              <InsightsDashboardAnimation />
            </div>
          </div>
        </section>

        {/* --- End Moved Insights Section --- */}

        <hr className="border-t border-gray-400 mt-2 mb-2 md:mt-4 md:mb-4 max-w-7xl mx-auto px-6" />
        
        {/* --- Moved Features Section Here --- */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 text-left">
            <div className="relative overflow-hidden rounded-lg h-96 transition-transform duration-300 hover:scale-105 group">
              <div className="absolute inset-0 bg-brand-red z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <Image 
                    src="/images/agent.png" 
                    alt="에이전트 실루엣" 
                    width={300} 
                    height={300}
                    className="object-cover h-full w-full opacity-80 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-2xl font-semibold font-serif text-white mb-2">에이전트 모델링</h3>
                <p className="text-base text-white/90">에이전트를 사용해 다양한 보험 상품을 테스트하세요.</p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl">→</span>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg h-96 transition-transform duration-300 hover:scale-105 group">
              <div className="absolute inset-0 bg-brand-red z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <Image 
                    src="/images/user_sim.png" 
                    alt="고객 실루엣" 
                    width={300} 
                    height={300}
                    className="object-cover h-full w-full opacity-80 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-2xl font-semibold font-serif text-white mb-2">고객 시뮬레이션</h3>
                <p className="text-base text-white/90">실제 보험 계약자의 행동과 대화를 재현하세요.</p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl">→</span>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg h-96 transition-transform duration-300 hover:scale-105 group">
              <div className="absolute inset-0 bg-brand-red z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <Image 
                    src="/images/analysis.png" 
                    alt="분석 시각화" 
                    width={300} 
                    height={300}
                    className="object-cover h-full w-full opacity-80 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-2xl font-semibold font-serif text-white mb-2">분석 대시보드</h3>
                <p className="text-base text-white/90">최적의 보험 설계를 위한 인사이트를 얻으세요.</p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl">→</span>
              </div>
            </div>
          </div>
        </section>
        {/* --- End Moved Features Section --- */}

        <hr className="border-t border-gray-400 my-8 md:my-12 max-w-6xl mx-auto px-6" />

        {/* FAQ 섹션 (한국어) */}
        <section id="faq" className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-left"> 
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-12">자주 묻는 질문</h2> 
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="group border-b border-gray-400 pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                  <span className="font-semibold text-lg group-open:text-brand-cyan">{faq.question}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <hr className="border-t border-gray-400 my-8 md:my-12 max-w-6xl mx-auto px-6" />

        {/* --- 결합된 연락처/등록 섹션 (한국어) --- */}
        <section id="get-started" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:space-x-12 md:items-stretch">
            {/* 왼쪽: 시나리오 정의 */}
            <div className="md:w-1/2 mb-12 md:mb-0 flex flex-col">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-left">시나리오 정의</h2>
              <form className="mt-8 space-y-4 text-left flex flex-col flex-grow">
                <input 
                  type="text" 
                  placeholder="고객 이름 (예: 김민준)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent" 
                  required 
                />
                <input 
                  type="number" 
                  placeholder="나이 (예: 35)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                  required
                />
                <input 
                  type="text" 
                  placeholder="직업 (예: 소프트웨어 엔지니어)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent" 
                />
                <textarea 
                  placeholder="상세 시나리오 또는 요청 설명 (예: 젊은 부부가 생명 보험 필요)" 
                  rows={3} 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                  required
                ></textarea>
                <DemoRequestButton />
              </form>
            </div>

            {/* 세로 구분선 - 모바일 숨김 */} 
            <div className="hidden md:block border-l border-gray-400 mx-6"></div>

            {/* 오른쪽: 관심 등록 - UPDATE FORM */}
            <div className="md:w-1/2 flex flex-col">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-left">관심 등록</h2>
              <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-6 text-left flex flex-col flex-grow">
                <input 
                  type="email" 
                  placeholder="이메일 주소" 
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent" 
                  required 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <textarea 
                  placeholder="의견 또는 질문 (선택 사항)" 
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                  value={registerComments}
                  onChange={(e) => setRegisterComments(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center mt-auto px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '등록 중...' : '등록하기'}
                  {!isSubmitting && <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>}
                </button>
              </form>
            </div>
          </div>
        </section>
        {/* --- 섹션 종료 --- */}

      </main>

      <footer className="mt-auto text-gray-500 py-8 border-t border-gray-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-brand-blue">개인정보처리방침</a>
            <a href="#" className="hover:text-brand-blue">이용약관</a>
            <a href="#" className="hover:text-brand-blue">문의하기</a>
          </div>
          <p>© 2025 BoA.</p>
        </div>
      </footer>
    </div>
  );
} 