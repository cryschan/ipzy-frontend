import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Check, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  validateCardNumber,
  validateExpiry,
  validateCVC,
  validateCardholderName,
  formatCardNumber,
  formatExpiry,
} from "../utils/validation";

const planDetails = {
  basic: { name: "Basic", price: 9900 },
  pro: { name: "Pro", price: 19900 },
};

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscribe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const isSubmitting = useRef(false);

  const planId = (location.state?.plan || "basic") as "basic" | "pro";
  const plan = planDetails[planId];

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  // 실시간 검증 상태
  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvcError, setCvcError] = useState("");
  const [nameError, setNameError] = useState("");

  // 입력 핸들러
  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);

    // 16자리 입력 완료 시 검증
    const digits = formatted.replace(/\s/g, "");
    if (digits.length === 16) {
      if (!validateCardNumber(formatted)) {
        setCardNumberError("유효하지 않은 카드 번호입니다");
      } else {
        setCardNumberError("");
      }
    } else if (digits.length > 0 && digits.length < 16) {
      setCardNumberError("");
    }
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value);
    setExpiry(formatted);

    // MM/YY 형식 완료 시 검증
    if (formatted.length === 5) {
      if (!validateExpiry(formatted)) {
        setExpiryError("유효기간이 만료되었거나 잘못되었습니다");
      } else {
        setExpiryError("");
      }
    } else {
      setExpiryError("");
    }
  };

  const handleCvcChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setCvc(digits);

    if (digits.length >= 3) {
      if (!validateCVC(digits)) {
        setCvcError("CVC는 3-4자리 숫자입니다");
      } else {
        setCvcError("");
      }
    } else {
      setCvcError("");
    }
  };

  const handleNameChange = (value: string) => {
    const upperValue = value.toUpperCase().slice(0, 26);
    setName(upperValue);

    if (upperValue.length >= 2) {
      if (!validateCardholderName(upperValue)) {
        setNameError("영문 이름만 입력 가능합니다");
      } else {
        setNameError("");
      }
    } else {
      setNameError("");
    }
  };

  // 폼 유효성 검사
  const isFormValid =
    validateCardNumber(cardNumber) &&
    validateExpiry(expiry) &&
    validateCVC(cvc) &&
    validateCardholderName(name) &&
    !cardNumberError &&
    !expiryError &&
    !cvcError &&
    !nameError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 중복 요청 방지
    if (isSubmitting.current || loading) return;

    // 최종 검증
    let hasError = false;

    if (!validateCardNumber(cardNumber)) {
      setCardNumberError("유효하지 않은 카드 번호입니다");
      hasError = true;
    }

    if (!validateExpiry(expiry)) {
      setExpiryError("유효기간이 만료되었거나 잘못되었습니다");
      hasError = true;
    }

    if (!validateCVC(cvc)) {
      setCvcError("CVC는 3-4자리 숫자입니다");
      hasError = true;
    }

    if (!validateCardholderName(name)) {
      setNameError("영문 이름만 입력 가능합니다");
      hasError = true;
    }

    if (hasError) return;

    setError("");
    setLoading(true);
    isSubmitting.current = true;

    try {
      // 모의 결제 처리 (2초 대기)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await subscribe(planId);
      if (result) {
        setSuccess(true);
      } else {
        setError("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-black mb-4">구독 완료!</h1>
          <p className="text-gray-500 mb-8">
            {plan.name} 플랜 구독이 시작되었습니다.
            <br />
            지금 바로 프리미엄 기능을 사용해보세요.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/quiz")}
              className="w-full bg-[#FB5010] text-white py-4 rounded-full font-bold hover:bg-[#E04600] transition-colors"
            >
              코디 추천받으러 가기
            </button>
            <button
              onClick={() => navigate("/mypage")}
              className="w-full border-2 border-[#1a1a1a] py-4 rounded-full font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              마이페이지로 이동
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
            aria-label="이전 페이지로 돌아가기"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <span className="text-xl font-black tracking-tighter">결제</span>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold mb-4">주문 내역</h2>
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <p className="font-medium">{plan.name} 플랜</p>
              <p className="text-sm text-gray-500">월간 구독</p>
            </div>
            <p className="text-xl font-bold">₩{plan.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center pt-4">
            <p className="font-bold">총 결제 금액</p>
            <p className="text-2xl font-black text-[#FB5010]">
              ₩{plan.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm"
          noValidate
        >
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-gray-400" aria-hidden="true" />
            <h2 className="font-bold">카드 정보</h2>
          </div>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                카드 번호
              </label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  cardNumberError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-[#FB5010]"
                }`}
                aria-describedby={cardNumberError ? "cardNumber-error" : undefined}
                aria-invalid={!!cardNumberError}
                autoComplete="cc-number"
              />
              {cardNumberError && (
                <p
                  id="cardNumber-error"
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {cardNumberError}
                </p>
              )}
            </div>

            {/* Expiry & CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium mb-2">
                  유효기간
                </label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    expiryError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-[#FB5010]"
                  }`}
                  aria-describedby={expiryError ? "expiry-error" : undefined}
                  aria-invalid={!!expiryError}
                  autoComplete="cc-exp"
                />
                {expiryError && (
                  <p
                    id="expiry-error"
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    {expiryError}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium mb-2">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  inputMode="numeric"
                  value={cvc}
                  onChange={(e) => handleCvcChange(e.target.value)}
                  placeholder="000"
                  maxLength={4}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    cvcError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-[#FB5010]"
                  }`}
                  aria-describedby={cvcError ? "cvc-error" : undefined}
                  aria-invalid={!!cvcError}
                  autoComplete="cc-csc"
                />
                {cvcError && (
                  <p
                    id="cvc-error"
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    {cvcError}
                  </p>
                )}
              </div>
            </div>

            {/* Card Holder Name */}
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium mb-2">
                카드 소유자 이름
              </label>
              <input
                id="cardName"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="HONG GILDONG"
                maxLength={26}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors uppercase ${
                  nameError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-[#FB5010]"
                }`}
                aria-describedby={nameError ? "cardName-error" : undefined}
                aria-invalid={!!nameError}
                autoComplete="cc-name"
              />
              {nameError && (
                <p
                  id="cardName-error"
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {nameError}
                </p>
              )}
            </div>
          </div>

          {/* General Error */}
          {error && (
            <div
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 mt-6 p-3 bg-gray-50 rounded-lg">
            <Lock className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <p className="text-xs text-gray-500">
              모든 결제 정보는 안전하게 암호화됩니다.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full mt-6 bg-[#FB5010] text-white py-4 rounded-full font-bold hover:bg-[#E04600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>처리 중...</span>
              </>
            ) : (
              <span>₩{plan.price.toLocaleString()} 결제하기</span>
            )}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-4">
            결제 버튼을 누르면{" "}
            <span className="text-[#FB5010] cursor-pointer hover:underline">
              이용약관
            </span>{" "}
            및{" "}
            <span className="text-[#FB5010] cursor-pointer hover:underline">
              환불정책
            </span>
            에 동의하게 됩니다.
          </p>
        </form>
      </div>
    </main>
  );
}
