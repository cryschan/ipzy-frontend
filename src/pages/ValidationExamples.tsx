import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, X, Eye, EyeOff, CreditCard } from "lucide-react";

export default function ValidationExamples() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-black tracking-tighter">입력값 검증 예시</span>
          <div className="w-5" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Section: 이메일 검증 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#FB5010] text-white rounded-lg flex items-center justify-center text-sm">1</span>
            이메일 검증
          </h2>

          <div className="space-y-4">
            {/* 정상 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                정상 입력
              </label>
              <input
                type="email"
                value="user@example.com"
                readOnly
                className="w-full px-4 py-3 border-2 border-green-500 bg-green-50 rounded-lg"
              />
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                올바른 이메일 형식입니다
              </p>
            </div>

            {/* 형식 오류 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                형식 오류
              </label>
              <input
                type="email"
                value="invalid-email"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                올바른 이메일 형식을 입력해주세요
              </p>
            </div>

            {/* 중복 이메일 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                중복 이메일
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value="test@test.com"
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
                />
                <button
                  disabled
                  className="px-4 py-3 rounded-lg font-medium text-sm bg-gray-100 text-gray-400"
                >
                  중복확인
                </button>
              </div>
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <X className="w-3 h-3" />
                이미 사용 중인 이메일입니다
              </p>
            </div>

            {/* 사용 가능 이메일 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                사용 가능 이메일
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value="newuser@example.com"
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-green-500 bg-green-50 rounded-lg"
                />
                <button className="px-4 py-3 rounded-lg font-medium text-sm bg-green-500 text-white flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  확인됨
                </button>
              </div>
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                사용 가능한 이메일입니다
              </p>
            </div>
          </div>
        </section>

        {/* Section: 비밀번호 검증 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#FB5010] text-white rounded-lg flex items-center justify-center text-sm">2</span>
            비밀번호 검증
          </h2>

          <div className="space-y-4">
            {/* 모든 조건 미충족 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                모든 조건 미충족
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value="abc"
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs flex items-center gap-1 text-gray-400">
                  <Check className="w-3 h-3" />
                  <span>8자 이상</span>
                </p>
                <p className="text-xs flex items-center gap-1 text-gray-400">
                  <Check className="w-3 h-3" />
                  <span>숫자 포함</span>
                </p>
                <p className="text-xs flex items-center gap-1 text-gray-400">
                  <Check className="w-3 h-3" />
                  <span>특수문자 포함 (!@#$%^&*)</span>
                </p>
              </div>
            </div>

            {/* 일부 조건 충족 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                일부 조건 충족
              </label>
              <input
                type="text"
                value="password123"
                readOnly
                className="w-full px-4 py-3 border-2 border-yellow-500 bg-yellow-50 rounded-lg"
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs flex items-center gap-1 text-green-500">
                  <Check className="w-3 h-3" />
                  <span>8자 이상</span>
                </p>
                <p className="text-xs flex items-center gap-1 text-green-500">
                  <Check className="w-3 h-3" />
                  <span>숫자 포함</span>
                </p>
                <p className="text-xs flex items-center gap-1 text-gray-400">
                  <Check className="w-3 h-3" />
                  <span>특수문자 포함 (!@#$%^&*)</span>
                </p>
              </div>
            </div>

            {/* 모든 조건 충족 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                모든 조건 충족
              </label>
              <input
                type="text"
                value="Password123!"
                readOnly
                className="w-full px-4 py-3 border-2 border-green-500 bg-green-50 rounded-lg"
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs flex items-center gap-1 text-green-500">
                  <Check className="w-3 h-3" />
                  <span>8자 이상</span>
                </p>
                <p className="text-xs flex items-center gap-1 text-green-500">
                  <Check className="w-3 h-3" />
                  <span>숫자 포함</span>
                </p>
                <p className="text-xs flex items-center gap-1 text-green-500">
                  <Check className="w-3 h-3" />
                  <span>특수문자 포함 (!@#$%^&*)</span>
                </p>
              </div>
            </div>

            {/* 비밀번호 불일치 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                비밀번호 확인 불일치
              </label>
              <input
                type="text"
                value="different123!"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                비밀번호가 일치하지 않습니다
              </p>
            </div>
          </div>
        </section>

        {/* Section: 이름 검증 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#FB5010] text-white rounded-lg flex items-center justify-center text-sm">3</span>
            이름 검증
          </h2>

          <div className="space-y-4">
            {/* 정상 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                정상 입력
              </label>
              <input
                type="text"
                value="홍길동"
                readOnly
                className="w-full px-4 py-3 border-2 border-green-500 bg-green-50 rounded-lg"
              />
            </div>

            {/* 형식 오류 - 특수문자 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                형식 오류 (특수문자 포함)
              </label>
              <input
                type="text"
                value="홍길동!@#"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                한글 또는 영문 2-50자로 입력해주세요
              </p>
            </div>

            {/* 너무 짧음 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                너무 짧은 입력
              </label>
              <input
                type="text"
                value="홍"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                한글 또는 영문 2-50자로 입력해주세요
              </p>
            </div>
          </div>
        </section>

        {/* Section: 결제 카드 검증 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#FB5010] text-white rounded-lg flex items-center justify-center text-sm">4</span>
            결제 정보 검증
          </h2>

          <div className="space-y-4">
            {/* 카드 번호 오류 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                카드 번호 오류
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value="1234 5678"
                  readOnly
                  className="w-full pl-12 pr-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
                />
              </div>
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                16자리 카드 번호를 입력해주세요
              </p>
            </div>

            {/* 유효기간 오류 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                유효기간 오류
              </label>
              <input
                type="text"
                value="13/25"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                올바른 유효기간을 입력해주세요 (MM/YY)
              </p>
            </div>

            {/* 만료된 카드 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                만료된 카드
              </label>
              <input
                type="text"
                value="01/20"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                만료된 카드입니다
              </p>
            </div>

            {/* CVC 오류 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                CVC 오류
              </label>
              <input
                type="text"
                value="12"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                3자리 CVC를 입력해주세요
              </p>
            </div>

            {/* 카드 소유자 오류 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                카드 소유자 오류
              </label>
              <input
                type="text"
                value="홍길동123"
                readOnly
                className="w-full px-4 py-3 border-2 border-red-500 bg-red-50 rounded-lg"
              />
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                영문으로 입력해주세요
              </p>
            </div>
          </div>
        </section>

        {/* Section: 폼 레벨 에러 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#FB5010] text-white rounded-lg flex items-center justify-center text-sm">5</span>
            폼 레벨 에러
          </h2>

          <div className="space-y-4">
            {/* 로그인 실패 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                로그인 실패
              </label>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  이메일 또는 비밀번호가 올바르지 않습니다.
                </p>
              </div>
            </div>

            {/* 회원가입 실패 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                회원가입 실패
              </label>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  회원가입 중 오류가 발생했습니다.
                </p>
              </div>
            </div>

            {/* 결제 실패 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                결제 실패
              </label>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  결제에 실패했습니다. 카드 정보를 확인해주세요.
                </p>
              </div>
            </div>

            {/* 네트워크 오류 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                네트워크 오류
              </label>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  네트워크 연결을 확인해주세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: 버튼 상태 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#FB5010] text-white rounded-lg flex items-center justify-center text-sm">6</span>
            버튼 상태
          </h2>

          <div className="space-y-4">
            {/* 활성화 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                활성화 (폼 유효)
              </label>
              <button className="w-full bg-[#FB5010] text-white py-4 font-bold rounded-full hover:bg-[#E04600] transition-colors">
                회원가입
              </button>
            </div>

            {/* 비활성화 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                비활성화 (폼 무효)
              </label>
              <button
                disabled
                className="w-full bg-[#FB5010] text-white py-4 font-bold rounded-full opacity-50 cursor-not-allowed"
              >
                회원가입
              </button>
            </div>

            {/* 로딩 중 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                로딩 중
              </label>
              <button
                disabled
                className="w-full bg-[#FB5010] text-white py-4 font-bold rounded-full opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                가입 중...
              </button>
            </div>
          </div>
        </section>

        {/* Design Tokens */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center text-sm">D</span>
            디자인 토큰
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">성공 (Success)</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-green-500" />
                  <span className="text-sm text-gray-500">#22C55E</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">오류 (Error)</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-red-500" />
                  <span className="text-sm text-gray-500">#EF4444</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">경고 (Warning)</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-yellow-500" />
                  <span className="text-sm text-gray-500">#EAB308</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">비활성 (Disabled)</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gray-400" />
                  <span className="text-sm text-gray-500">#9CA3AF</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium mb-2">테두리 스타일</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 기본: <code className="bg-gray-100 px-1 rounded">border-gray-200</code></p>
                <p>• 포커스: <code className="bg-gray-100 px-1 rounded">border-[#FB5010]</code></p>
                <p>• 성공: <code className="bg-gray-100 px-1 rounded">border-green-500</code></p>
                <p>• 오류: <code className="bg-gray-100 px-1 rounded">border-red-500</code></p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
