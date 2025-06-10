'use client'; // Mark as Client Component

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Image from 'next/image';
import { ArrowRight, UsersRound, BrainCircuit, TrendingUp, MessageSquare, UserCheck } from 'lucide-react';
import { motion } from "framer-motion"; // Added framer-motion
import ChatSimulator from '@/components/ChatSimulator';
import Step1_UserProfileAnimation from '@/components/animations/Step1_UserProfileAnimation';
import Step2_AgentSelectAnimation from '@/components/animations/Step2_AgentSelectAnimation';
import Step3_DashboardAnimation from '@/components/animations/Step3_DashboardAnimation';
import OverlayMenu from '@/components/OverlayMenu';

import DemoRequestButton from '@/components/DemoRequestButton';
import axios from 'axios'; // Import axios
import { RevolvingDot } from 'react-loader-spinner'; // Import the spinner

// --- FAQ 데이터 (한국어) ---
const faqs = [
  {
    question: "대화 시뮬레이션은 무엇인가요?",
    answer: "AI가 실제 고객과 상담사 역할을 하면서 대화를 주고받는 모의 상담이에요.일상 대화처럼 자연스럽게 진행되는 상담 대화를 재현합니다."
  },
  {
    question: "BoS는 대화를 어떻게 모델링하나요?",
    answer: "저희는 보험 설계 전략을 학습한 AI 에이전트와, 다양한 페르소나로 모델링된 고객 시뮬레이터를 활용해, 현실적인 보험 상담 시나리오를 유연하게 시뮬레이션할 수 있습니다.",
  },
  {
    question: "보험 에이전트와 고객 페르소나를 맞춤 설정할 수 있나요?",
    answer: "물론입니다. 에이전트와 고객 시뮬레이터 모두에 대해 특정 특성, 목표, 지식 수준, 심지어 대화 스타일까지 정의할 수 있습니다.",
  },
  {
    question: "어떤 종류의 인사이트를 기대할 수 있나요?",
    answer: "저희의 분석 프레임워크는 상담의 성공·실패 요인 등을 정량적으로 분석하여, 상담 과정에서 개선이 필요한 순간을 식별합니다. 이를 바탕으로 고객 유형과 상황에 최적화된 맞춤형 설계 전략을 도출할 수 있습니다.",
  },
  {
    question: "상담 전략의 효과를 어떻게 정량적으로 평가할 수 있나요?",
    answer: "BoS은 상담 로그를 기반으로 대화의 흐름을 시퀀스 단위로 분석한 뒤, 각 전략이 개입된 시점과 그에 따른 고객 반응을 분석합니다. 예를 들어 설득 전략이 등장한 이후 고객이 긍정적으로 응답했는지, 대화가 성공으로 이어졌는지를 바탕으로 전략의 기여도를 추정합니다. 이렇게 수집된 데이터를 통해 전략별 성공률, 전환율 등을 정량적으로 평가합니다.",
  },
  {
    question: "실제 고객 응대에 바로 활용 가능한 인사이트를 얻을 수 있나요?",
    answer: "네. 시뮬레이션 결과는 실제 상담 전략 개선에 바로 적용할 수 있도록 설계되었습니다. BoS는 고객 유형별로 효과적인 응대 전략과 실패 요인을 자동으로 비교 분석하여, 각 페르소나에 최적화된 실질적인 개선 가이드를 제공합니다.",
  },
];

export default function InsuranceSimulationKoreanPage() { // Changed function name for clarity
  // --- State Variables ---
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      axios.get(`${addrScript}?action=insert&table=final_visitor&data=${visitorData}`)
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

  return (
    <div className="bg-white">
      <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="min-h-screen flex flex-col font-sans text-[rgb(var(--foreground-rgb))]">
        <nav className="absolute top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div className="text-3xl font-bold font-serif text-brand-blue">BoS</div>
            <button onClick={() => setIsMenuOpen(true)} className="text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
          <div className="max-w-7xl mx-auto px-6">
            <hr className="border-t border-gray-400" />
          </div>
        </nav>

        <main className="pt-28 md:pt-36">
          <header className="max-w-7xl mx-auto px-6 pt-6 md:pt-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-serif leading-[3rem] md:leading-[5rem] mb-6">
              <span className="block bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                고객 설득? 이제 AI가 도와드립니다.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-4xl mx-auto font-serif">
              고객 분석부터 모의 상담, 전략 도출까지, 보험 설계사 및 상담사를 위한 AI 기반 상담 전략 설계 도우미
            </p>
            <div className="mt-10 flex items-center justify-center space-x-4">
              <a 
                href="/demo"
                className="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
              >
                데모 요청
              </a>
              <a 
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
              >
                관심 등록
              </a>
            </div>
          </header>

          <hr className="border-t border-gray-400 mt-8 mb-2 md:mt-12 md:mb-4 max-w-7xl mx-auto px-6" />

          <section id="description" className="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div className="flex flex-col items-center gap-12">
              {/* Chat Simulator */}
              <div className="flex justify-center">
                <ChatSimulator />
              </div>

              <hr className="border-t border-gray-400 w-full max-w-4xl mx-auto" />

              {/* Description Text */}
              <div className="max-w-6xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-2xl md:text-3xl font-bold font-serif space-y-4"
                >
                  <p className="bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                    고객 응대가 막막할 때, 어떤 말로 시작하고 어떻게 설득해야 할지 고민되시나요?
                  </p>
                  <p className="text-lg md:text-xl text-gray-400 font-serif">
                    다양한 유형의 가상 고객을 설정하고, AI가 생성한 상담 대화를 분석해 보세요. <br />
                    실제 상담에서 어떤 응대 방식과 설득 전략이 효과적인지에 대한 <br />
                    구체적이고 실질적인 인사이트를 얻을 수 있습니다!
                  </p>
                </motion.div>
              </div>
            </div>

            {/* 3단계 프로세스 섹션 */}
            <div className="mt-20">
              <div className="max-w-6xl mx-auto space-y-20">
                
                {/* 1단계: 가상 고객 모델링 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan flex items-center justify-center text-white font-bold text-xl">
                      1
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold font-serif">가상 고객 모델링</h3>
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    고객 데이터를 입력해 원하는 유형의 가상 고객을 손쉽게 설정하고, 현실적인 페르소나를 생성합니다.
                  </p>
                  
                  {/* Notion 스타일 플레이스홀더 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center p-2">
                    <Step1_UserProfileAnimation />
                  </div>
                </div>

                {/* 2단계: AI 에이전트 선택 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan flex items-center justify-center text-white font-bold text-xl">
                      2
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold font-serif">AI 에이전트 선택</h3>
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    미리 준비된 AI 에이전트를 선택하거나, 페르소나와 대화 스타일을 직접 커스터마이징하여 테스트해보고 싶은 상담 전략을 자유롭게 실험해보세요!
                  </p>
                  
                  {/* Notion 스타일 플레이스홀더 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center p-2">
                    <Step2_AgentSelectAnimation />
                  </div>
                </div>

                {/* 3단계: 대화 시뮬레이션 및 분석 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan flex items-center justify-center text-white font-bold text-xl">
                      3
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold font-serif">대화 시뮬레이션 및 분석</h3>
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    생성된 가상 고객과 AI 에이전트 간의 실제 상담 대화를 시뮬레이션하고, 
                    대화 결과를 분석하여 성공 요인과 개선점을 도출합니다.
                  </p>
                  
                  {/* ChatSimulator 활용 */}
                  {/* <ChatSimulator /> */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center p-2">
                    <Step3_DashboardAnimation />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/*
          <hr className="border-t border-gray-400 my-8 md:my-12 max-w-6xl mx-auto px-6" />

          <section id="insights" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="md:w-1/2">
                <h2 className="text-5xl md:text-6xl font-bold font-serif mb-8 bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                  정교한 분석
                </h2>
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
              <div className="md:w-1/2 h-[500px]">
              </div>
            </div>
          </section>
          */}
          
          <hr className="border-t border-gray-400 my-8 md:my-12 max-w-6xl mx-auto px-6" />

          <section id="faq" className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-left"> 
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-12">자주 묻는 질문 - FAQ</h2> 
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

          <section id="get-started" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="flex flex-col md:flex-row md:space-x-12 md:items-stretch justify-center">
              {/*
              <div className="relative group md:w-1/2 mb-12 md:mb-0">
                <div className="flex flex-col h-full">
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
                <div className="absolute inset-0 z-10 flex items-center justify-center 
                              bg-gray-900 bg-opacity-70 backdrop-blur-sm 
                              text-white text-2xl font-bold rounded-lg 
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                              transition-opacity duration-300 ease-in-out">
                  서비스 준비 중입니다...
                </div>
              </div>
              */}
              
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8">
                  데모 시연 및 관심 등록
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  저희 서비스의 데모 시연을 요청하시거나, <br/>
                  최신 소식을 받아보시려면 아래 버튼을 클릭해주세요.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <a 
                    href="/demo"
                    className="inline-flex items-center px-8 py-4 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
                  >
                    데모 요청
                  </a>
                  <a 
                    href="/register"
                    className="inline-flex items-center px-8 py-4 border border-brand-blue text-white bg-brand-blue rounded hover:bg-opacity-90 transition-colors duration-200 group"
                  >
                    관심 등록하기
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-auto text-gray-500 py-8 border-t border-gray-400">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-brand-blue">개인정보처리방침</a>
              <a href="#" className="hover:text-brand-blue">이용약관</a>
              <a href="#" className="hover:text-brand-blue">문의하기</a>
            </div>
            <p>© 2025 BoS.</p>
          </div>
        </footer>
      </div>
    </div>
  );
} 