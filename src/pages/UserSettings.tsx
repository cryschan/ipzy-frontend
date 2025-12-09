import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Bell, Globe, Loader2 } from "lucide-react";

interface Preferences {
  theme: "light" | "dark";
  language: "ko" | "en";
  notifications: {
    push: boolean;
    email: boolean;
    marketing: boolean;
  };
}

const defaultPreferences: Preferences = {
  theme: "light",
  language: "ko",
  notifications: {
    push: true,
    email: true,
    marketing: false,
  },
};

export default function UserSettings() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  const handleSave = async () => {
    setSaving(true);

    // Mock: 저장 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    navigate("/mypage");
  };

  const toggleTheme = () => {
    setPreferences((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const toggleNotification = (key: keyof Preferences["notifications"]) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/mypage")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-black tracking-tighter">설정</span>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        {/* 테마 설정 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-500">디스플레이</h3>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-600" />
              <span className="font-medium">다크 모드</span>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                preferences.theme === "dark" ? "bg-[#FB5010]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  preferences.theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* 언어 설정 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-500">언어</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="font-medium">언어 선택</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, language: "ko" }))
                }
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  preferences.language === "ko"
                    ? "bg-[#FB5010] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                한국어
              </button>
              <button
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, language: "en" }))
                }
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  preferences.language === "en"
                    ? "bg-[#FB5010] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-500">알림</h3>
          </div>

          {/* 푸시 알림 */}
          <button
            onClick={() => toggleNotification("push")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <span className="font-medium block">푸시 알림</span>
                <span className="text-sm text-gray-400">
                  새로운 추천, 이벤트 알림
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                preferences.notifications.push ? "bg-[#FB5010]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  preferences.notifications.push
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </div>
          </button>

          {/* 이메일 알림 */}
          <button
            onClick={() => toggleNotification("email")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="text-left">
              <span className="font-medium block">이메일 알림</span>
              <span className="text-sm text-gray-400">
                계정, 결제 관련 알림
              </span>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                preferences.notifications.email ? "bg-[#FB5010]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  preferences.notifications.email
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </div>
          </button>

          {/* 마케팅 알림 */}
          <button
            onClick={() => toggleNotification("marketing")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <span className="font-medium block">마케팅 정보 수신</span>
              <span className="text-sm text-gray-400">
                혜택, 이벤트, 프로모션 정보
              </span>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                preferences.notifications.marketing
                  ? "bg-[#FB5010]"
                  : "bg-gray-200"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  preferences.notifications.marketing
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* 하단 버튼 공간 확보 */}
        <div className="h-20" />
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#FB5010] text-white py-4 rounded-full font-bold hover:bg-[#E04600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              "저장하기"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
