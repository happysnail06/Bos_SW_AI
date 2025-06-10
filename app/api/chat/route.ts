import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getInsuranceAgentSystemPrompt } from '@/lib/ai/insurance_agent';
import { getUserSystemPrompt } from '@/lib/ai/user_agent';
import { AgentProfile, CustomerProfile, ConversationTurn } from '@/types';
import { BytesOutputParser } from '@langchain/core/output_parsers';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      conversationHistory,
      customerProfile,
      agentProfile,
      nextTurn,
    }: {
      conversationHistory: ConversationTurn[];
      customerProfile: CustomerProfile;
      agentProfile?: AgentProfile; // Agent profile is not needed for user's turn
      nextTurn: 'AI Agent' | 'User';
    } = body;

    if (!customerProfile || !nextTurn) {
      return new Response(JSON.stringify({ error: 'Missing required body parameters' }), { status: 400 });
    }

    const llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0.7,
      streaming: true,
    });

    let systemPrompt: string;

    if (nextTurn === 'AI Agent') {
      if (!agentProfile) return new Response(JSON.stringify({ error: 'Missing agentProfile for AI turn' }), { status: 400 });
      systemPrompt = getInsuranceAgentSystemPrompt(customerProfile, agentProfile);
    } else {
      systemPrompt = getUserSystemPrompt(customerProfile);
    }

    const messages = (conversationHistory || []).map(turn => 
      turn.sender === 'User' ? new HumanMessage(turn.message) : new SystemMessage(turn.message)
    );

    const parser = new BytesOutputParser();
    
    const stream = await llm.pipe(parser).stream([
      new SystemMessage(systemPrompt),
      ...messages,
    ]);
    
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), { status: 500 });
  }
} 