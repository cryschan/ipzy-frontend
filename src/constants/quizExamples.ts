// 홈 화면에 표시되는 퀴즈 예시 데이터
export interface QuizExample {
  num: string;
  q: string;
  opts: string;
}

export const QUIZ_EXAMPLES: QuizExample[] = [
  {
    num: "01",
    q: "어디 가요?",
    opts: "학교 · 회사 · 데이트 · 외출",
  },
  {
    num: "02",
    q: "어떻게 보이고 싶어요?",
    opts: "깔끔 · 편하게 · 멋있게",
  },
  {
    num: "03",
    q: "체형 고민?",
    opts: "없음 · 배 · 마른편 · 키",
  },
  {
    num: "04",
    q: "예산은?",
    opts: "10만 · 20만 · 30만 · 무관",
  },
];
