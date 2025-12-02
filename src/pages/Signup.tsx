import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateKoreanName,
  sanitizeInput,
} from "../utils/validation";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, checkEmailDuplicate } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const isSubmitting = useRef(false);

  const passwordValidation = validatePassword(password);
  const passwordChecks = {
    length: passwordValidation.hasMinLength,
    number: passwordValidation.hasNumber,
    special: passwordValidation.hasSpecialChar,
  };

  const isPasswordValid = passwordValidation.isValid;
  const isFormValid =
    name &&
    !nameError &&
    email &&
    !emailError &&
    emailChecked &&
    emailAvailable &&
    isPasswordValid &&
    password === confirmPassword &&
    agreeTerms;

  const handleNameChange = (value: string) => {
    const sanitized = sanitizeInput(value, 50);
    setName(sanitized);

    if (sanitized && !validateKoreanName(sanitized)) {
      setNameError("한글 또는 영문 2-50자로 입력해주세요");
    } else {
      setNameError("");
    }
  };

  const handleEmailChange = (value: string) => {
    const sanitized = sanitizeInput(value, 100);
    setEmail(sanitized);
    // 이메일 변경 시 중복 체크 상태 초기화
    setEmailChecked(false);
    setEmailAvailable(false);

    if (sanitized && !validateEmail(sanitized)) {
      setEmailError("올바른 이메일 형식을 입력해주세요");
    } else {
      setEmailError("");
    }
  };

  const handleCheckEmail = async () => {
    if (!email || emailError || emailChecking) return;

    setEmailChecking(true);
    setEmailError("");

    try {
      const isAvailable = await checkEmailDuplicate(email);
      setEmailChecked(true);
      setEmailAvailable(isAvailable);

      if (!isAvailable) {
        setEmailError("이미 사용 중인 이메일입니다");
      }
    } catch {
      setEmailError("이메일 확인 중 오류가 발생했습니다");
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 중복 요청 방지
    if (isSubmitting.current || loading) return;

    setError("");

    // 최종 검증
    if (!validateKoreanName(name)) {
      setNameError("한글 또는 영문 2-50자로 입력해주세요");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isPasswordValid) {
      setError("비밀번호 조건을 확인해주세요.");
      return;
    }

    setLoading(true);
    isSubmitting.current = true;

    try {
      const success = await signup(email, password, name);
      if (success) {
        navigate("/", { replace: true });
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
            aria-label="이전 페이지로 돌아가기"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <span className="text-xl font-black tracking-tighter">뭐입지</span>
          <div className="w-5" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2">회원가입</h1>
            <p className="text-gray-500">뭐입지와 함께 스타일을 찾아보세요</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="이름을 입력하세요"
                maxLength={50}
                className={`w-full px-4 py-3 border-2 ${
                  nameError ? "border-red-500" : "border-gray-200"
                } focus:border-[#FB5010] focus:outline-none transition-colors rounded-lg`}
                aria-describedby={nameError ? "name-error" : undefined}
                aria-invalid={!!nameError}
                autoComplete="name"
              />
              {nameError && (
                <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">
                  {nameError}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="example@email.com"
                  maxLength={100}
                  className={`flex-1 px-4 py-3 border-2 ${
                    emailError
                      ? "border-red-500"
                      : emailChecked && emailAvailable
                      ? "border-green-500"
                      : "border-gray-200"
                  } focus:border-[#FB5010] focus:outline-none transition-colors rounded-lg`}
                  aria-describedby={emailError ? "email-error" : emailChecked && emailAvailable ? "email-success" : undefined}
                  aria-invalid={!!emailError}
                  autoComplete="email"
                />
                <button
                  type="button"
                  onClick={handleCheckEmail}
                  disabled={!email || !!emailError || emailChecking || (emailChecked && emailAvailable)}
                  className={`px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    emailChecked && emailAvailable
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {emailChecking ? (
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    </span>
                  ) : emailChecked && emailAvailable ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      확인됨
                    </span>
                  ) : (
                    "중복확인"
                  )}
                </button>
              </div>
              {emailError && (
                <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                  {emailError}
                </p>
              )}
              {emailChecked && emailAvailable && (
                <p id="email-success" className="text-green-500 text-xs mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  사용 가능한 이메일입니다
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(sanitizeInput(e.target.value, 100))}
                  placeholder="비밀번호를 입력하세요"
                  maxLength={100}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#FB5010] focus:outline-none transition-colors pr-12 rounded-lg"
                  aria-describedby="password-requirements"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {/* Password Requirements */}
              <div id="password-requirements" className="mt-2 space-y-1">
                <p
                  className={`text-xs flex items-center gap-1 ${
                    passwordChecks.length ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  <Check className="w-3 h-3" aria-hidden="true" />
                  <span>8자 이상</span>
                </p>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    passwordChecks.number ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  <Check className="w-3 h-3" aria-hidden="true" />
                  <span>숫자 포함</span>
                </p>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    passwordChecks.special ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  <Check className="w-3 h-3" aria-hidden="true" />
                  <span>특수문자 포함 (!@#$%^&*)</span>
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(sanitizeInput(e.target.value, 100))}
                placeholder="비밀번호를 다시 입력하세요"
                maxLength={100}
                className={`w-full px-4 py-3 border-2 focus:outline-none transition-colors rounded-lg ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#FB5010]"
                }`}
                aria-describedby={
                  confirmPassword && password !== confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
                aria-invalid={!!(confirmPassword && password !== confirmPassword)}
                autoComplete="new-password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="text-red-500 text-xs mt-1"
                  role="alert"
                >
                  비밀번호가 일치하지 않습니다
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-0.5 rounded ${
                  agreeTerms ? "bg-[#FB5010] border-[#FB5010]" : "border-gray-300"
                }`}
                role="checkbox"
                aria-checked={agreeTerms}
                aria-label="이용약관 및 개인정보처리방침 동의"
              >
                {agreeTerms && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
              </button>
              <p className="text-sm text-gray-600">
                <span className="text-[#FB5010] font-medium cursor-pointer hover:underline">
                  이용약관
                </span>{" "}
                및{" "}
                <span className="text-[#FB5010] font-medium cursor-pointer hover:underline">
                  개인정보처리방침
                </span>
                에 동의합니다.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-[#FB5010] text-white py-4 font-bold hover:bg-[#E04600] transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-8 text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-[#FB5010] font-bold hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
