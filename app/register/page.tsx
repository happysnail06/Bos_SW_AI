'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OverlayMenu from '@/components/OverlayMenu';
import { Mail, PartyPopper, Star } from 'lucide-react';

export default function RegisterPage() {
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerComments, setRegisterComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Helper Functions ---
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

  useEffect(() => {
    setUserId(getUVfromCookie());
  }, []);

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!registerEmail || !/^\S+@\S+\.\S+$/.test(registerEmail)) {
        alert("유효한 이메일 주소를 입력해주세요.");
        setIsSubmitting(false);
        return;
    }
    if (!registerName) {
        alert("이름을 입력해주세요.");
        setIsSubmitting(false);
        return;
    }

    if (!userId) {
        console.error("User ID not available for submission.");
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요. (User ID missing)");
        setIsSubmitting(false);
        return;
    }

    const submissionData = JSON.stringify({
      "id": userId,
      "name": registerName,
      "email": registerEmail,
      "advice": registerComments,
      "type": "advice",
      "time_stamp": getTimeStamp()
    });

    try {
      const response = await axios.get(`${addrScript}?action=insert&table=final_log&data=${submissionData}`);
      console.log('Submission success:', response.data);
      alert("등록되었습니다. 감사합니다!");
      setRegisterName('');
      setRegisterEmail('');
      setRegisterComments('');
    } catch (error) {
      console.error('Submission failed:', error);
      alert("등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      if (axios.isAxiosError(error)) {
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

  const BenefitItem = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-800">{title}</h4>
        <p className="text-gray-600 mt-1">{children}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            {/* You can add a spinner here if you like */}
            <p className="mt-4 text-white text-lg font-semibold">등록 중...</p>
          </div>
        )}

        <div className="min-h-screen flex flex-col font-sans text-[rgb(var(--foreground-rgb))]">
        <nav className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="text-3xl font-bold font-serif text-brand-blue">BoS</a>
            <div className="flex items-center space-x-4">
                <a href="/demo" className="text-sm text-gray-600 hover:text-brand-blue">체험하기</a>
                <button onClick={() => setIsMenuOpen(true)} className="text-brand-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>
          </div>
        </nav>

        <main className="flex-grow flex items-start justify-center pt-24 md:pt-28">
            <div className="max-w-6xl w-full mx-auto px-6">
              <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl shadow-sm p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                  {/* 왼쪽: 혜택 섹션 */}
                  <div className="flex flex-col justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                      <span className="bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                        미리 등록하고 <br/>
                        소식을 받아보세요
                      </span>
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      BoS의 여정에 함께 해주세요. 가장 먼저 최신 업데이트와 특별한 혜택을 보내드립니다.
                    </p>
                    <div className="space-y-6">
                      <BenefitItem icon={<Mail size={24} />} title="최신 정보 및 업데이트">
                        서비스의 새로운 기능, 개선 사항 및 진행 상황에 대한 소식을 가장 먼저 접하세요.
                      </BenefitItem>
                      <BenefitItem icon={<PartyPopper size={24} />} title="런칭 및 이벤트 알림">
                        공식 런칭일, 베타 테스트 프로그램 및 특별 웨비나에 대한 알림을 받아보세요.
                      </BenefitItem>
                      <BenefitItem icon={<Star size={24} />} title="얼리버드 특별 혜택">
                        초기 등록자에게만 제공되는 독점 할인 및 프로모션 기회를 놓치지 마세요.
                      </BenefitItem>
                    </div>
                  </div>
                  {/* 오른쪽: 폼 섹션 */}
                  <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-bold font-serif mb-2 text-gray-800">관심 등록하기</h3>
                    <p className="text-gray-600 mb-6">이메일을 남겨주시면, 모든 준비가 되었을 때 알려드릴게요.</p>
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left flex flex-col">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="홍길동"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                          required
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">의견 또는 질문 (선택)</label>
                        <textarea
                          id="comments"
                          placeholder="서비스에 대해 궁금한 점이나 바라는 점을 자유롭게 남겨주세요."
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-transparent"
                          value={registerComments}
                          onChange={(e) => setRegisterComments(e.target.value)}
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a
                          href="/demo"
                          className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors duration-200"
                        >
                          체험하기
                        </a>
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-white bg-brand-blue rounded-md hover:bg-opacity-90 transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? '전송 중...' : '소식 받기'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
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