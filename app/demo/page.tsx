'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User, Car, Shield, ChevronRight, BrainCircuit, MessageSquare, LineChart, Heart, Database, Zap, Wand2, ChevronLeft, HeartPulse, Landmark, Stethoscope, Check, Target, Smile, Clock, Percent, Key, XCircle, CheckCircle, BarChart3, List, Loader, RefreshCw, ClipboardList
} from 'lucide-react';
import { ConversationTurn, CustomerProfile, AgentProfile } from '@/types';
import { runSimulation } from '@/lib/ai/run_simulation';
import OverlayMenu from '@/components/OverlayMenu';

// Analysis Result Type
interface AnalysisResult {
  outcome: {
    status: 'success' | 'failure';
    reason: string;
  };
  metrics: {
    customer_sentiment: '긍정적' | '중립적' | '부정적';
    signup_probability: number;
    main_keyword: string;
    comprehensive_feedback: string;
  };
  consultation_stage_analysis: {
    stage: string;
    progress: number;
    evaluation: string;
  }[];
}

const steps = [
  { name: '가상 고객 모델링', icon: User, description: '상담할 가상 고객의 프로필을 설정합니다.' },
  { name: '보험 에이전트 모델링', icon: BrainCircuit, description: '상담을 진행할 AI 에이전트를 선택합니다.' },
  { name: '시뮬레이션', icon: MessageSquare, description: '가상 고객과 AI 에이전트의 상담을 진행합니다.' },
  { name: '결과 분석', icon: LineChart, description: '시뮬레이션 결과를 확인하고 분석합니다.' },
];

const agentProfiles = [
  {
    id: 1,
    name: '한화 다이렉트 운전자보험',
    productName: '한화 다이렉트 운전자보험',
    description: '교통사고 처리지원금, 변호사 선임비용, 벌금 등 운전 중 발생할 수 있는 다양한 법적 리스크를 든든하게 보장합니다.',
    avatar: '/agents/hanwha.png',
    icon: Shield,
    tags: ['운전자보험', '가성비', '법률비용'],
    disabled: false,
  },
  {
    id: 2,
    name: '암보험',
    productName: '암보험',
    description: 'Coming Soon',
    avatar: '/agents/abl.png',
    icon: HeartPulse,
    tags: ['암보험', '진단비', '치료비'],
    disabled: true,
  },
  {
    id: 3,
    name: '생명/연금보험',
    productName: '생명/연금보험',
    description: 'Coming Soon',
    avatar: '/agents/heungkuk.png',
    icon: Landmark,
    tags: ['생명보험', '연금', '노후대비'],
    disabled: true,
  },
  {
    id: 4,
    name: '실손의료비보험',
    productName: '실손의료비보험',
    description: 'Coming Soon',
    avatar: '/agents/samsung.png',
    icon: Stethoscope,
    tags: ['실손보험', '의료비', '병원비'],
    disabled: true,
  },
];

const mockConversation = [
    { sender: 'AI Agent', message: '안녕하세요, 김철수 고객님. 한화 다이렉트 운전자보험에 대해 문의주셨죠? 어떤 점이 가장 궁금하신가요?' },
    { sender: 'User', message: '네, 운전자 보험은 처음이라 뭐가 뭔지 잘 모르겠어요. 꼭 필요한가요?' },
    { sender: 'AI Agent', message: '좋은 질문입니다! 운전자 보험은 자동차 보험에서 보장하지 않는 형사적 책임(벌금, 변호사 선임비용 등)을 보장해주는 아주 중요한 보험이에요.' },
    { sender: 'User', message: '아, 형사적 책임이요... 그럼 구체적으로 어떤 상황에서 보장을 받을 수 있는 건가요? 좀 더 자세히 설명해주세요.' },
    { sender: 'AI Agent', message: '예를 들어, 12대 중과실 사고로 피해자가 발생했을 때 필요한 변호사 선임비용이나 벌금을 보장해드립니다. 월 3,400원으로 든든하게 대비하실 수 있죠.' },
    { sender: 'User', message: '흠... 설명은 감사하지만, 저한테는 별로 필요하지 않을 것 같네요. 조금 더 생각해볼게요.' },
];

const initialCustomerProfile: CustomerProfile = {
  name: '',
  age: '',
  gender: '남성',
  drivingExperience: '',
  drivingStyle: '',
  insuranceTendency: '',
  hasAccidentHistory: '아니오',
  accidentInfo: '',
  carModel: '',
  carUsage: '',
  carValue: '',
  additionalNotes: '',
};

const defaultPlaceholders: CustomerProfile = {
  name: '김철수',
  age: '40',
  gender: '남성',
  drivingExperience: '15',
  drivingStyle: '안전운전, 출퇴근 위주',
  insuranceTendency: '가성비 중시',
  hasAccidentHistory: '아니오',
  accidentInfo: '',
  carModel: '현대 쏘나타',
  carUsage: '출퇴근, 주말 레저',
  carValue: '25000000',
  additionalNotes: '운전자 보험에 대해 잘 모르지만, 필요성은 느끼고 있습니다.',
};

const MetricCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor?: string;
}> = ({ icon: Icon, label, value, iconColor = 'text-gray-500' }) => (
  <div className="p-6 rounded-lg shadow-sm border bg-white">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <Icon className={`w-8 h-8 ${iconColor}`} />
    </div>
  </div>
);

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerProfile>(initialCustomerProfile);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(1);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [simulationState, setSimulationState] = useState<'idle' | 'in-progress' | 'finished'>('idle');
  const [isTyping, setIsTyping] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const goToStep = (step: number) => {
    if (step <= maxStepReached) {
      setCurrentStep(step);
    }
  };

  const handleNextStep = async () => {
    // Analysis should be triggered when moving from step 3 to 4
    if (currentStep === 3 && simulationState === 'finished') {
      setIsAnalyzing(true);
      setAnalysisResult(null); // Reset previous result
      try {
        const selectedAgent = getSelectedAgentProfile();
        if (!selectedAgent) throw new Error("Agent profile not found for analysis");
        
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            conversation, 
            customerProfile: formData, 
            agentProfile: selectedAgent 
          }),
        });

        if (!res.ok) {
          const errorBody = await res.text();
          console.error("Analysis API request failed:", res.status, errorBody);
          throw new Error(`Analysis API request failed with status: ${res.status}`);
        }
        
        const result: AnalysisResult = await res.json();
        setAnalysisResult(result);
        
        // Move to next step only on successful analysis
        setCurrentStep(4);
        setMaxStepReached(prev => Math.max(prev, 4));

      } catch (error) {
        console.error("Analysis failed:", error);
        setAnalysisResult(null); // Ensure result is null on error
      } finally {
        setIsAnalyzing(false);
      }
      return; // Stop execution here for this specific step transition
    }
    
    // Placeholder logic when moving from other steps
    const nextStep = currentStep + 1;
    if (nextStep <= steps.length) {
      if (currentStep === 1) {
        const isFormEmpty = Object.values(formData).every(value => value === '' || value === '남성' || value === '아니오');
        if (isFormEmpty) {
          // If empty, use placeholders
          setFormData(defaultPlaceholders);
        }
      }
      setCurrentStep(nextStep);
      setMaxStepReached(prev => Math.max(prev, nextStep));
    }
  };
  
  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, speaker: 'AI Agent' | 'User') => {
    const decoder = new TextDecoder();
    let fullResponse = "";
    
    setConversation(prev => [...prev, { sender: speaker, message: "" }]);
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      setConversation(prev => {
        const newConversation = [...prev];
        newConversation[newConversation.length - 1].message = fullResponse;
        return newConversation;
      });
    }
    return fullResponse;
  };

  const handleStartSimulation = async () => {
    const selectedAgent = agentProfiles.find(agent => agent.id === selectedAgentId);
    if (!selectedAgent) return;

    setConversation([]);
    setSimulationState('in-progress');
    
    let currentConversation: ConversationTurn[] = [];
    const maxTurns = 3;

    for (let turn = 0; turn < maxTurns; turn++) {
      // AI Agent's turn
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Show typing indicator briefly
      
      let res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: currentConversation,
          customerProfile: formData,
          agentProfile: selectedAgent,
          nextTurn: 'AI Agent',
        }),
      });
      
      setIsTyping(false); // Hide indicator right before processing stream

      if (!res.ok || !res.body) {
        setSimulationState('finished');
        setIsTyping(false);
        return;
      }
      
      let reader = res.body.getReader();
      const agentMessage = await processStream(reader, 'AI Agent');
      currentConversation.push({ sender: 'AI Agent', message: agentMessage });
      
      // User's turn
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Show typing indicator briefly

      res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: currentConversation,
          customerProfile: formData,
          nextTurn: 'User',
        }),
      });
      
      setIsTyping(false); // Hide indicator

      if (!res.ok || !res.body) {
        setSimulationState('finished');
        setIsTyping(false);
        return;
      }

      reader = res.body.getReader();
      const userMessage = await processStream(reader, 'User');
      currentConversation.push({ sender: 'User', message: userMessage });
    }

    setIsTyping(false);
    setSimulationState('finished');
  };

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const getSelectedAgentProfile = () => {
    return agentProfiles.find(agent => agent.id === selectedAgentId);
  };

  const handleRetrySimulation = async () => {
    setAnalysisResult(null); // Reset previous analysis
    await handleStartSimulation();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="text-2xl font-bold text-brand-blue">
              BoS
            </a>
            <button onClick={() => setIsMenuOpen(true)} className="text-brand-blue p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3">
                <span className="bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                AI 보험 상담 시뮬레이터
                </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                3단계의 간단한 과정을 통해, 가상 고객과 AI 에이전트의 상담을 시뮬레이션하고 그 결과를 분석하여 최적의 상담 전략을 찾아보세요.
            </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2" aria-hidden="true"></div>
            <ol className="relative grid grid-cols-4">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                const isReachable = stepNumber <= maxStepReached;

                return (
                  <li key={step.name} className={`flex flex-col items-center text-center ${isReachable ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => goToStep(stepNumber)}>
                    <div className="relative">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white transition-colors duration-300 ${isCompleted || isCurrent ? 'bg-brand-blue' : 'bg-gray-400'}`}>
                            {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                        </div>
                    </div>
                    <h4 className={`mt-3 font-semibold transition-colors duration-300 ${isCurrent ? 'text-brand-blue' : isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>{step.name}</h4>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* Step 1: Virtual Customer Modeling */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">1단계: 가상 고객 프로필 설정</h2>
                <p className="text-lg text-gray-600 mt-2">시뮬레이션을 위한 가상 고객의 프로필을 입력해주세요.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Profile Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
                    <h3 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3 flex items-center"><User className="w-6 h-6 mr-3 text-brand-blue" />고객 정보</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} placeholder="김철수" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">나이</label>
                            <input type="number" name="age" id="age" value={formData.age} onChange={handleInputChange} placeholder="40" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">성별</label>
                            <select name="gender" id="gender" value={formData.gender} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md transition-colors duration-200">
                                <option>남성</option>
                                <option>여성</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="drivingExperience" className="block text-sm font-medium text-gray-700">운전 경력 (년)</label>
                            <input type="number" name="drivingExperience" id="drivingExperience" value={formData.drivingExperience} onChange={handleInputChange} placeholder="15" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="drivingStyle" className="block text-sm font-medium text-gray-700">운전 스타일</label>
                            <input type="text" name="drivingStyle" id="drivingStyle" value={formData.drivingStyle} onChange={handleInputChange} placeholder="예: 안전운전, 출퇴근 위주" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="insuranceTendency" className="block text-sm font-medium text-gray-700">보험 가입 성향</label>
                            <input type="text" name="insuranceTendency" id="insuranceTendency" value={formData.insuranceTendency} onChange={handleInputChange} placeholder="예: 가성비 중시, 보장 내용 중시" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                    </div>
                </div>

                {/* Vehicle & Additional Info Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
                    <h3 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3 flex items-center"><Car className="w-6 h-6 mr-3 text-brand-blue" />차량 및 기타 정보</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                         <div className="sm:col-span-2">
                            <label htmlFor="hasAccidentHistory" className="block text-sm font-medium text-gray-700">사고 이력</label>
                            <select name="hasAccidentHistory" id="hasAccidentHistory" value={formData.hasAccidentHistory} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md transition-colors duration-200">
                                <option>아니오</option>
                                <option>예</option>
                            </select>
                        </div>
                        <div className={`sm:col-span-2 grid transition-all duration-500 ease-in-out ${formData.hasAccidentHistory === '예' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <label htmlFor="accidentInfo" className="block text-sm font-medium text-gray-700 pt-4">사고 이력 상세</label>
                                <textarea name="accidentInfo" id="accidentInfo" value={formData.accidentInfo} onChange={handleInputChange} rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" placeholder="최근 3년간 사고 이력을 간략히 기재해주세요."></textarea>
                            </div>
                        </div>
                         <div className="sm:col-span-2">
                            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">차량 모델</label>
                            <input type="text" name="carModel" id="carModel" value={formData.carModel} onChange={handleInputChange} placeholder="현대 쏘나타" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                        <div>
                            <label htmlFor="carUsage" className="block text-sm font-medium text-gray-700">주요 사용 용도</label>
                            <input type="text" name="carUsage" id="carUsage" value={formData.carUsage} onChange={handleInputChange} placeholder="예: 출퇴근, 주말 레저" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                        <div>
                            <label htmlFor="carValue" className="block text-sm font-medium text-gray-700">차량 가액 (원)</label>
                            <input type="number" name="carValue" id="carValue" value={formData.carValue} onChange={handleInputChange} placeholder="25000000" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">추가 참고사항</label>
                            <textarea name="additionalNotes" id="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors duration-200" placeholder="상담사가 참고할 만한 추가적인 정보, 특별히 원하는 보장 등을 자유롭게 기재해주세요."></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition"
                  >
                    다음 단계로
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Agent Modeling */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">2단계: AI 에이전트 선택</h2>
              <p className="text-lg text-gray-600 mt-2">시뮬레이션에 사용할 AI 상담사 프로필을 선택해주세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agentProfiles.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => !agent.disabled && setSelectedAgentId(agent.id)}
                  className={`relative group bg-white p-6 rounded-2xl shadow-sm border-2 text-center transition-all duration-300
                    ${agent.disabled
                      ? 'cursor-not-allowed'
                      : `cursor-pointer ${selectedAgentId === agent.id ? 'border-brand-blue shadow-lg -translate-y-1.5' : 'border-gray-200/80 hover:shadow-md hover:-translate-y-1'}`
                    }`}
                >
                   {agent.disabled && (
                    <div className="absolute inset-0 bg-gray-100/70 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      <span className="text-brand-blue text-lg font-bold">준비중입니다</span>
                    </div>
                  )}
                  <div className={agent.disabled ? 'opacity-50' : ''}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${selectedAgentId === agent.id && !agent.disabled ? 'bg-brand-blue' : 'bg-gray-100'}`}>
                      <agent.icon className={`w-8 h-8 transition-colors duration-300 ${selectedAgentId === agent.id && !agent.disabled ? 'text-white' : 'text-brand-blue'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{agent.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 h-16">{agent.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {agent.tags.map(tag => (
                        <span key={tag} className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${selectedAgentId === agent.id && !agent.disabled ? 'bg-brand-blue/10 text-brand-blue' : 'bg-gray-100 text-gray-600'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-5">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    이전 단계로
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!selectedAgentId}
                    className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음 단계로
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
            </div>
          </div>
        )}

        {/* Step 3: Simulation */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
             <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">3단계: 시뮬레이션</h2>
              <p className="text-lg text-gray-600 mt-2">설정된 정보로 AI 에이전트와 가상 고객의 상담을 시작합니다.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1 space-y-8">
                {/* Customer Info Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3 flex items-center"><User className="w-6 h-6 mr-3 text-brand-blue" />가상 고객 정보</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>이름:</strong> {formData.name}</li>
                    <li><strong>나이:</strong> {formData.age}</li>
                    <li><strong>성별:</strong> {formData.gender}</li>
                    <li><strong>운전 경력:</strong> {formData.drivingExperience}년</li>
                    <li><strong>운전 스타일:</strong> {formData.drivingStyle}</li>
                  </ul>
                </div>
                {/* Agent Info Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3 flex items-center"><BrainCircuit className="w-6 h-6 mr-3 text-brand-blue" />선택된 AI 에이전트</h3>
                   {getSelectedAgentProfile() && (
                      <div>
                        <p className="font-bold text-gray-800">{getSelectedAgentProfile()?.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{getSelectedAgentProfile()?.description}</p>
                      </div>
                   )}
                </div>
              </div>
              
              {/* Conversation Area */}
              <div className="relative lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col h-[480px]">
                {simulationState === 'in-progress' && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center rounded-2xl animate-fade-in">
                        <div className="flex items-center gap-3 text-lg font-bold text-brand-blue">
                            <BrainCircuit className="animate-spin" style={{ animationDuration: '2s' }} />
                            <span>AI와 상담중입니다...</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">잠시만 기다려주세요.</p>
                    </div>
                )}
                {simulationState === 'finished' && (
                     <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center rounded-2xl animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mb-4">
                            <Check size={32} />
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                            <span>상담이 종료되었습니다.</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">아래 '결과 확인하기' 버튼을 눌러주세요.</p>
                    </div>
                )}
                {simulationState === 'idle' && (
                   <div className="flex-grow flex flex-col items-center justify-center text-center">
                      <MessageSquare size={48} className="text-gray-300 mb-4" />
                      <h4 className="text-xl font-bold text-gray-700">상담 시뮬레이션</h4>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleStartSimulation}
                          disabled={simulationState !== 'idle'}
                          className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Wand2 className="w-5 h-5 mr-2" />
                          시뮬레이션 시작하기
                        </button>
                      </div>
                   </div>
                )}
                {(simulationState === 'in-progress' || simulationState === 'finished') && (
                   <div className="flex-grow flex flex-col overflow-hidden">
                     <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                       {conversation.map((msg, index) => (
                         <div key={index} className={`flex items-end gap-2 ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                           {msg.sender === 'AI Agent' && <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0"><BrainCircuit size={18} /></div>}
                           <div className={`px-4 py-2 rounded-2xl max-w-md animate-fade-in-up whitespace-pre-wrap ${msg.sender === 'User' ? 'bg-gray-200 text-gray-800 rounded-br-none' : 'bg-blue-50 text-gray-800 rounded-bl-none'}`}>
                             {msg.message}
                           </div>
                           {msg.sender === 'User' && <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center flex-shrink-0"><User size={18} /></div>}
                         </div>
                       ))}
                       {isTyping && (
                            <div className="flex items-end gap-2 justify-start animate-fade-in-up">
                                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0"><BrainCircuit size={18} /></div>
                                <div className="px-4 py-3 rounded-2xl max-w-md bg-blue-50 rounded-bl-none flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                                </div>
                            </div>
                       )}
                       <div ref={conversationEndRef} />
                     </div>
                   </div>
                )}
              </div>
            </div>

            <div className="mt-10 pt-5">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    이전 단계로
                  </button>
                  
                  <div className="flex items-center gap-4">
                    {simulationState === 'finished' && (
                      <button
                        type="button"
                        onClick={handleRetrySimulation}
                        className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        다시 시도하기
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={simulationState !== 'finished'}
                      className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      결과 확인하기
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
            </div>
          </div>
        )}
        
        {/* Steps 2 and 3 will be rendered here */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">4단계: 결과 분석</h2>
              <p className="text-lg text-gray-600 mt-2">시뮬레이션 결과를 종합적으로 분석하고 인사이트를 확인하세요.</p>
            </div>
            {analysisResult ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Conversation & Summary */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    {/* Outcome */}
                   <div className={`bg-white p-6 rounded-2xl shadow-sm border ${analysisResult.outcome.status === 'success' ? 'border-green-200' : 'border-red-200'}`}>
                       <h3 className={`text-xl font-semibold mb-4 text-gray-700 border-b pb-3 flex items-center`}>
                         <Target className={`w-6 h-6 mr-3 ${analysisResult.outcome.status === 'success' ? 'text-green-500' : 'text-red-500'}`} />
                         시뮬레이션 결과
                       </h3>
                       <div className="flex items-center justify-center text-center py-4">
                           {analysisResult.outcome.status === 'success' ? (
                               <Check size={40} className="text-green-500" />
                           ) : (
                               <XCircle size={40} className="text-red-500" />
                           )}
                           <p className={`text-2xl font-bold ml-4 ${analysisResult.outcome.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                               {analysisResult.outcome.status === 'success' ? '가입 성공' : '가입 실패'}
                           </p>
                       </div>
                       <p className="text-sm text-center text-gray-500">{analysisResult.outcome.reason}</p>
                   </div>
                   {/* Customer Info */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                     <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3 flex items-center"><User className="w-6 h-6 mr-3 text-brand-blue" />가상 고객 정보</h3>
                     <ul className="space-y-2 text-sm text-gray-600">
                       <li><strong>이름:</strong> {formData.name}</li>
                       <li><strong>나이:</strong> {formData.age}</li>
                       <li><strong>성별:</strong> {formData.gender}</li>
                       <li><strong>운전 경력:</strong> {formData.drivingExperience}년</li>
                     </ul>
                   </div>
                   {/* Agent Info */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3 flex items-center"><BrainCircuit className="w-6 h-6 mr-3 text-brand-blue" />AI 에이전트</h3>
                      {getSelectedAgentProfile() && (
                         <div>
                           <p className="font-bold text-gray-800">{getSelectedAgentProfile()?.name}</p>
                           <p className="text-sm text-gray-600 mt-1">{getSelectedAgentProfile()?.description}</p>
                         </div>
                      )}
                   </div>
                 </div>

                 {/* Right Column: Analysis Dashboard */}
                 <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3 flex items-center"><ClipboardList className="w-6 h-6 mr-3 text-brand-blue" />상담 내용 분석</h3>
                        {/* Key Metrics */}
                        <div className="space-y-6">
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Outcome */}
                            <div className={`p-6 rounded-lg shadow-sm border ${analysisResult.outcome.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">상담 결과</p>
                                  <p className={`text-2xl font-bold ${analysisResult.outcome.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {analysisResult.outcome.status === 'success' ? '성공' : '실패'}
                                  </p>
                                </div>
                                {analysisResult.outcome.status === 'success' ? (
                                  <CheckCircle className="w-8 h-8 text-green-400" />
                                ) : (
                                  <XCircle className="w-8 h-8 text-red-400" />
                                )}
                              </div>
                              <p className="mt-2 text-sm text-gray-600">{analysisResult.outcome.reason}</p>
                            </div>

                            {/* Signup Probability */}
                            <MetricCard
                              icon={Target}
                              label="가입 확률"
                              value={`${analysisResult.metrics.signup_probability}%`}
                              iconColor="text-blue-500"
                            />

                            {/* Customer Sentiment */}
                            <MetricCard
                              icon={Smile}
                              label="고객 감정"
                              value={analysisResult.metrics.customer_sentiment}
                              iconColor="text-yellow-500"
                            />

                            {/* Main Keyword */}
                            <MetricCard
                              icon={Key}
                              label="핵심 키워드"
                              value={analysisResult.metrics.main_keyword}
                              iconColor="text-purple-500"
                            />
                          </div>

                          {/* 종합 피드백 */}
                          {analysisResult.metrics.comprehensive_feedback && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <ClipboardList className="w-5 h-5 mr-3 text-indigo-500" />
                                종합 피드백 및 개선 가이드
                              </h4>
                              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {analysisResult.metrics.comprehensive_feedback}
                              </p>
                            </div>
                          )}

                          {/* 단계별 진행도 */}
                          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <BarChart3 className="w-5 h-5 mr-3 text-gray-500" />
                              상담 단계별 분석
                            </h4>
                            <div className="space-y-4">
                              {analysisResult.consultation_stage_analysis.map(item => (
                                <div key={item.stage}>
                                  <div className="flex items-center mb-1">
                                    <span className="w-24 text-sm font-medium text-gray-600">{item.stage}</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                                      <div className={`bg-brand-blue h-4 rounded-full transition-all duration-1000 ease-out`} style={{width: `${item.progress}%`}}></div>
                                    </div>
                                    <span className="w-12 text-right text-sm font-semibold text-gray-600">{item.progress}%</span>
                                  </div>
                                  <p className="text-xs text-gray-500 ml-24">{item.evaluation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3 flex items-center"><MessageSquare className="w-6 h-6 mr-3 text-brand-blue" />전체 대화 기록</h3>
                        <div className="h-[300px] overflow-y-auto space-y-4 pr-2">
                          {conversation.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                              {msg.sender === 'AI Agent' && <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0"><BrainCircuit size={18} /></div>}
                              <div className={`px-4 py-2 rounded-lg max-w-sm ${msg.sender === 'User' ? 'bg-gray-200 text-gray-800' : 'bg-blue-50 text-gray-800'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              {msg.sender === 'User' && <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center flex-shrink-0"><User size={18} /></div>}
                            </div>
                          ))}
                        </div>
                    </div>
                 </div>
               </div>
            ) : (
              <div className="text-center p-12 bg-white rounded-2xl shadow-sm border">
                <p className="text-gray-500">분석 결과를 불러오지 못했습니다. 이전 단계로 돌아가 다시 시도해주세요.</p>
              </div>
            )}
            <div className="mt-12 pt-5">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    이전 단계로
                  </button>
                </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto text-gray-500 py-8 border-t border-gray-200">
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
  );
} 