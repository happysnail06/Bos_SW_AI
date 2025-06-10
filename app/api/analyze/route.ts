import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getAnalysisSystemPrompt } from '@/lib/ai/analyze_conversation';
import { NextResponse } from 'next/server';
import type { ConversationTurn, CustomerProfile, AgentProfile } from '@/types';

export const runtime = 'edge';

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0.2,
});

export async function POST(request: Request) {
  try {
    const { conversation, customerProfile, agentProfile } = await request.json();

    if (!conversation || !customerProfile || !agentProfile) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const systemPrompt = getAnalysisSystemPrompt(conversation, customerProfile, agentProfile);
    
    // 시도 횟수
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await llm.invoke([ new SystemMessage(systemPrompt) ]);
            const content = response.content as string;

            // LLM 응답에서 JSON 객체만 추출
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("No JSON object found in LLM response");
            }
            
            const jsonObj = JSON.parse(jsonMatch[0]);
            return NextResponse.json(jsonObj);

        } catch (parseError) {
            console.error(`Attempt ${i + 1} failed:`, parseError);
            if (i === maxRetries - 1) {
                // 마지막 시도 후에도 실패하면 에러 응답
                throw new Error("Failed to parse LLM response after multiple attempts.");
            }
        }
    }
    
  } catch (error) {
    console.error('Error in analyze API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
} 