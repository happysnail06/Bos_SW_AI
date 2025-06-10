import type { AgentProfile, CustomerProfile, ConversationTurn } from '@/types';

/**
 * AI 대화 시뮬레이션을 실행하는 비동기 제너레이터 함수.
 * @param customerProfile - 고객 프로필
 * @param agentProfile - 에이전트 프로필
 * @param maxTurns - 시뮬레이션할 최대 턴 수 (1턴 = AI와 사용자 각 1회 응답)
 * @yields {ConversationTurn} - 각 턴마다 생성된 대화 메시지
 */
export async function* runSimulation(
  customerProfile: CustomerProfile,
  agentProfile: AgentProfile,
  maxTurns: number = 3
): AsyncGenerator<ConversationTurn, void, undefined> {
  let conversationHistory: ConversationTurn[] = [];

  // 첫 대화는 항상 AI 에이전트가 시작합니다.
  let nextSpeaker: 'AI Agent' | 'User' = 'AI Agent';

  // 총 (maxTurns * 2) 만큼의 메시지를 주고받습니다.
  for (let i = 0; i < maxTurns * 2; i++) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory,
          customerProfile,
          agentProfile,
          nextTurn: nextSpeaker,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const newMessage: string = data.message;

      const newTurn: ConversationTurn = {
        sender: nextSpeaker,
        message: newMessage,
      };

      // 다음 턴을 위해 대화 기록을 업데이트하고, 생성된 메시지를 프론트엔드로 전달합니다.
      conversationHistory.push(newTurn);
      yield newTurn;

      // 다음 발언자를 전환합니다.
      nextSpeaker = nextSpeaker === 'AI Agent' ? 'User' : 'AI Agent';

    } catch (error) {
      console.error(`Error during turn ${i + 1} (${nextSpeaker}):`, error);
      const errorTurn: ConversationTurn = {
        sender: 'AI Agent',
        message: `죄송합니다. 대화 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      yield errorTurn;
      return; // 오류 발생 시 시뮬레이션 중단
    }
  }
}

// 이 파일이 모듈임을 명확하게 하기 위해 빈 export를 추가합니다.
export {}; 