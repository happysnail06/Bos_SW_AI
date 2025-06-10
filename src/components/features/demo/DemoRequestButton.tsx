'use client';

import React from 'react';

const DemoRequestButton: React.FC = () => {
  const handleClick = () => {
    alert('서비스 준비중입니다.');
  };

  return (
    <button 
      type="button" 
      onClick={handleClick} 
      className="w-full flex items-center justify-center mt-auto px-6 py-3 border border-brand-blue text-brand-blue rounded hover:bg-brand-blue hover:text-white transition-colors duration-200 group"
    >
      데모 요청
      <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
    </button>
  );
};

export default DemoRequestButton; 