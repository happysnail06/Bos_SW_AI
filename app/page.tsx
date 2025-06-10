import Step1_UserProfileAnimation from '@/components/animations/Step1_UserProfileAnimation';
import Step2_AgentSelectAnimation from '@/components/animations/Step2_AgentSelectAnimation';
import Step3_DashboardAnimation from '@/components/animations/Step3_DashboardAnimation';
import { Bot, Check, ShieldCheck, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            가상 고객 & AI 에이전트 설정 및 실시간 상담 시뮬레이션
          </h2>
          <div className="relative mt-12 lg:mt-20 lg:col-span-5 lg:row-span-2 lg:flex lg:items-center lg:justify-center">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute -top-4 -left-4 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -top-4 -right-4 w-48 h-48 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

                {/* Step 1: User Profile */}
                <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/80">
                  <div className="flex items-center pb-3 border-b border-gray-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="ml-3 text-sm font-semibold text-gray-800">1. 가상 고객 & AI 에이전트 설정</h3>
                  </div>
                  <p className="mt-3 text-xs text-gray-600">
                    데모를 위한 가상 고객 프로필(나이, 운전 스타일 등)과 AI 에이전트의 성향(공감형, 데이터 기반 등)을 정의합니다.
                  </p>
                  <div className="mt-4 aspect-[4/3] w-full rounded-lg overflow-hidden">
                    <Step1_UserProfileAnimation />
                  </div>
                </div>

                {/* Step 2: Agent Selection */}
                <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/80">
                  <div className="flex items-center pb-3 border-b border-gray-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="ml-3 text-sm font-semibold text-gray-800">2. 실시간 상담 시뮬레이션</h3>
                  </div>
                  <p className="mt-3 text-xs text-gray-600">
                    설정된 프로필을 기반으로 AI 에이전트와 가상 고객 간의 실시간 보험 판매 상담이 진행됩니다.
                  </p>
                  <div className="mt-4 aspect-[4/3] w-full rounded-lg overflow-hidden">
                    <Step2_AgentSelectAnimation />
                  </div>
                </div>
                
                {/* Step 3: Dashboard */}
                <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/80 col-span-1 md:col-span-2">
                   <div className="flex items-center pb-3 border-b border-gray-200">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="ml-3 text-sm font-semibold text-gray-800">3. 대화 분석 및 리포트</h3>
                  </div>
                  <p className="mt-3 text-xs text-gray-600">
                    상담 종료 후, 대화 내용을 다각도로 분석하여 성공 여부, 고객 감정 변화, 가입 확률 등의 지표를 시각화된 대시보드로 제공합니다.
                  </p>
                  <div className="mt-4 aspect-[16/9] w-full rounded-lg overflow-hidden">
                     <Step3_DashboardAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 