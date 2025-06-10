'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, Home, Info, FileText, Mail } from 'lucide-react';

const menuVariants = {
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuLink: React.FC<{ href: string; title: string; description: string; icon: React.ElementType; onClose: () => void }> = ({ href, title, description, icon: Icon, onClose }) => (
  <Link href={href} onClick={onClose} className="group block">
    <motion.div variants={itemVariants} className="flex items-center gap-4 rounded-lg p-4 transition-colors hover:bg-gray-700/50">
      <Icon className="w-6 h-6 text-gray-400 transition-colors group-hover:text-white" />
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-500 ml-auto transition-transform group-hover:translate-x-1" />
    </motion.div>
  </Link>
);


export default function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm z-50 flex flex-col p-8"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-12">
            <div className="text-3xl font-bold font-serif text-white">BoS</div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
              <X className="w-8 h-8" />
            </button>
          </motion.div>

          <nav className="flex-grow">
            <ul className="space-y-4">
              <li>
                <MenuLink href="/" title="메인 페이지" description="서비스 첫 화면으로 이동합니다." icon={Home} onClose={onClose} />
              </li>
              <li>
                <MenuLink href="/about" title="프로젝트 소개" description="BoS의 4단계 파이프라인을 확인하세요." icon={Info} onClose={onClose} />
              </li>
              <li>
                <MenuLink href="/demo" title="데모 요청" description="AI 상담 시뮬레이션을 직접 체험해보세요." icon={FileText} onClose={onClose} />
              </li>
              <li>
                <MenuLink href="/register" title="관심 등록" description="최신 소식을 받고, 서비스 우선권을 확보하세요." icon={Mail} onClose={onClose} />
              </li>
            </ul>
          </nav>
          
          <motion.div variants={itemVariants} className="text-center text-gray-500 text-sm mt-8">
            © 2025 BoS. All rights reserved.
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 