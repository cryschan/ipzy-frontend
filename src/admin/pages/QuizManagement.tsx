import { FileQuestion, BarChart3, Edit } from "lucide-react";
import StatsCard from "../components/StatsCard";
import { mockQuizStats } from "../utils/mockData";

export default function QuizManagement() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">퀴즈 관리</h1>
        <p className="text-gray-500 mt-1">퀴즈 질문과 응답 통계를 관리합니다</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="총 응답 수"
          value={mockQuizStats.totalResponses.toLocaleString() + "건"}
          icon={BarChart3}
          color="orange"
        />
        <StatsCard
          title="질문 수"
          value={mockQuizStats.questions.length + "개"}
          icon={FileQuestion}
          color="blue"
        />
        <StatsCard
          title="완료율"
          value="87%"
          icon={BarChart3}
          color="green"
        />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800">질문 관리</h3>

        {mockQuizStats.questions.map((question) => (
          <div key={question.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[#FB5010] text-sm font-bold">Q{question.id}</span>
                <h4 className="text-lg font-bold mt-1">{question.question}</h4>
              </div>
              <button className="p-2 text-gray-400 hover:text-[#FB5010] hover:bg-gray-50 rounded-lg transition-colors">
                <Edit className="w-5 h-5" />
              </button>
            </div>

            {/* Options with Stats */}
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.value}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{option.label}</span>
                    <span className="text-gray-500">
                      {option.count.toLocaleString()}명 ({option.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FB5010] rounded-full transition-all"
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <div className="text-center">
        <button className="px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#FB5010] hover:text-[#FB5010] transition-colors">
          + 새 질문 추가
        </button>
      </div>
    </div>
  );
}
