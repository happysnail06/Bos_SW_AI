export interface CustomerProfile {
  name: string;
  age: string;
  gender: string;
  drivingExperience: string;
  drivingStyle: string;
  insuranceTendency: string;
  hasAccidentHistory: string; // '예' or '아니오'
  accidentInfo: string;
  carModel: string;
  carUsage: string;
  carValue: string;
  additionalNotes: string;
}

export interface AgentProfile {
  id: number;
  name: string;
  productName: string;
  description: string;
  avatar: string;
  comingSoon?: boolean;
}

export interface ConversationTurn {
  sender: 'User' | 'AI Agent';
  message: string;
}

export interface AnalysisResult {
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
  };
} 