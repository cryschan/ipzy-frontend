import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  // TODO: 알림 설정 기능 구현 후 활성화
  // const [notifications, setNotifications] = useState({
  //   newUser: true,
  //   newSubscription: true,
  //   payment: true,
  //   system: false,
  // });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">설정</h1>
        <p className="text-gray-500 mt-1">시스템 설정을 관리합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Profile */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-[#FB5010]" />
            <h3 className="font-bold text-gray-800">관리자 정보</h3>
          </div>

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#FB5010] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {user?.name.charAt(0)}
            </div>
            <h4 className="font-bold text-lg">{user?.name}</h4>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-[#FB5010]/10 text-[#FB5010] text-xs font-medium rounded-full">
              {user?.role === "super_admin" ? "슈퍼 관리자" : "관리자"}
            </span>
          </div>

          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              비밀번호 변경
            </button>
            <button className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              프로필 수정
            </button>
          </div>
        </div>

        {/* TODO: 알림 설정 기능 구현 후 활성화
        <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-[#FB5010]" />
            <h3 className="font-bold text-gray-800">알림 설정</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "newUser",
                label: "새 회원 가입",
                description: "새로운 회원이 가입하면 알림을 받습니다",
              },
              {
                key: "newSubscription",
                label: "새 구독",
                description: "새로운 구독이 시작되면 알림을 받습니다",
              },
              {
                key: "payment",
                label: "결제 알림",
                description: "결제/환불 발생 시 알림을 받습니다",
              },
              {
                key: "system",
                label: "시스템 알림",
                description: "시스템 관련 중요 알림을 받습니다",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof notifications],
                    }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-[#FB5010]"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications[item.key as keyof typeof notifications]
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
*/}
      </div>

      {/* TODO: 보안 및 시스템 정보 기능 구현 후 활성화
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#FB5010]" />
            <h3 className="font-bold text-gray-800">보안</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800">2단계 인증</p>
                <p className="text-sm text-gray-500">
                  추가 보안을 위해 2단계 인증을 사용합니다
                </p>
              </div>
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                비활성
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800">세션 타임아웃</p>
                <p className="text-sm text-gray-500">
                  30분 동안 활동이 없으면 자동 로그아웃
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                활성
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-[#FB5010]" />
            <h3 className="font-bold text-gray-800">시스템 정보</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">버전</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">환경</span>
              <span className="font-medium">Production</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">마지막 배포</span>
              <span className="font-medium">2025-01-15 14:30</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">데이터베이스</span>
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                정상
              </span>
            </div>
          </div>
        </div>
      </div>
*/}
    </div>
  );
}
