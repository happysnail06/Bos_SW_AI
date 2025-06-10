'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, BrainCircuit, MessageSquare, LineChart, Cpu, Database, Share2, Layers, Wind, GitBranch, Triangle, FileSearch, Wand2, Users, Sparkles
} from 'lucide-react';
import OverlayMenu from '@/components/OverlayMenu';

const coreFeatures = [
    {
        icon: User,
        title: '가상 고객 생성',
        description: '다양한 페르소나를 가진 가상 고객을 동적으로 생성해, 현실적인 상담 시나리오를 시뮬레이션합니다.',
        complexity: '하',
        // tech: 'TypeScript, Zod',
      },
      {
        icon: BrainCircuit,
        title: 'AI 에이전트 설계',
        description: '다양한 전략과 전문 지식을 가진 AI 에이전트를 설계하고, 프롬프트 엔지니어링으로 페르소나와 대화 스타일을 제어합니다.',
        complexity: '상',
        // tech: 'LangChain, Prompt Engineering',
      },
      {
        icon: MessageSquare,
        title: '실시간 대화 시뮬레이션',
        description: '가상 고객과 AI 에이전트 간의 실시간 상호작용으로 자연스러운 상담을 구현합니다.',
        complexity: '중',
        // tech: 'Next.js API Routes, Streaming',
      },
      {
        icon: LineChart,
        title: '결과 분석 및 피드백',
        description: 'LLM 기반 평가와 종합 분석 리포트를 통해 상담 전략을 정성적으로 개선합니다.',
        complexity: '중',
        // tech: 'LLM Function Calling',
      }
];

const techStack = [
    // { name: 'Next.js', icon: Layers, description: 'React 프레임워크' },
    // { name: 'TypeScript', icon: GitBranch, description: '정적 타입 시스템' },
    // { name: 'LangChain', icon: Share2, description: 'LLM 오케스트레이션' },
    // { name: 'Tailwind CSS', icon: Wind, description: 'UI 스타일링' },
    // { name: 'Framer Motion', icon: Move, description: '인터랙티브 애니메이션' },
    // { name: 'Vercel', icon: Triangle, description: '배포 및 호스팅' },
    { name: 'Next.js', icon: Layers },
    { name: 'TypeScript', icon: GitBranch},
    { name: 'LangChain', icon: Share2},
    { name: 'Tailwind CSS', icon: Wind},
    { name: 'OpenAI', icon: Sparkles},
    { name: 'Netlify', icon: Triangle},
    { name: 'ChromaDB', icon: Database },
    { name: 'GraphDB', icon: GitBranch },
];

const aiTech = [
    { name: 'RAG', icon: FileSearch },
    { name: 'Prompt Engineering', icon: Wand2 },
    { name: 'Multi-agent', icon: Users },
];

export default function AboutPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
            <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
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

            <main className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                            AI 보험 상담 시뮬레이션
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            가상 고객을 설정하고 AI 상담 대화를 분석하여, <br />실제 상담을 위한 효과적인 전략과 구체적인 인사이트를 발견하세요.
                        </p>
                    </motion.div>

                    {/* Core Features Section */}
                    <section className="mb-24">
                        <h2 className="text-3xl font-bold text-center mb-12">핵심 기능 (Core Features)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {coreFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 hover:shadow-xl hover:border-brand-blue/50 transition-all duration-300 flex flex-col"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                                            <feature.icon className="w-8 h-8 text-brand-blue" />
                                        </div>
                                        <h3 className="text-3xl font-semibold text-gray-900">{feature.title}</h3>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-6 leading-relaxed flex-grow">{feature.description}</p>
                                    <div className="flex items-center space-x-4 text-base mt-auto">
                                        <div className="flex items-center space-x-2">
                                            <Cpu className="w-5 h-5 text-yellow-500" />
                                            <span className="font-medium text-gray-700">구현 복잡도: <span className="font-bold text-yellow-600">{feature.complexity}</span></span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Software Configuration Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-12">기술 구성 (Software Configuration)</h2>
                        <div className="max-w-4xl mx-auto">
                            {/* Tech Stack */}
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7 }}
                                className="mb-12"
                            >
                                <h3 className="text-2xl font-semibold text-center mb-6">기술 스택 (Tech Stack)</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    {techStack.map(tech => (
                                        <div key={tech.name} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200/80 shadow-md hover:shadow-lg transition-shadow duration-300 h-28">
                                            <tech.icon className="w-10 h-10 text-brand-blue mb-2" />
                                            <span className="font-bold text-gray-800 text-center">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* AI Tech */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <h3 className="text-2xl font-semibold text-center mb-6">핵심 AI 기술</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    {aiTech.map(tech => (
                                        <div key={tech.name} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200/80 shadow-md hover:shadow-lg transition-shadow duration-300 h-28">
                                            <tech.icon className="w-10 h-10 text-brand-blue mb-2" />
                                            <span className="font-bold text-gray-800 text-center">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
} 