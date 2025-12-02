interface LogoProps {
  size?: number;
  color?: string;
  bgColor?: string;
  className?: string;
}

export default function Logo({
  size = 48,
  color = "#1a1a1a",
  bgColor = "#f5f5f5",
  className = ""
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/*
        ㅁㅇㅈ 로고
        - 왼쪽: ㅁ (상단) + ㅇ (하단)
        - 오른쪽: ㅈ (E 형태로 표현)
        둥근 도형들이 유기적으로 연결된 스타일
      */}

      {/* ㅁ - 왼쪽 상단: 두 개의 원이 연결된 형태 */}
      <circle cx="16" cy="16" r="14" fill={color} />
      <circle cx="16" cy="42" r="14" fill={color} />
      {/* ㅁ 세로 연결 */}
      <rect x="2" y="16" width="28" height="26" fill={color} />
      {/* ㅁ 내부 구멍 (둥근 사각형 느낌) */}
      <ellipse cx="16" cy="29" rx="7" ry="9" fill={bgColor} />

      {/* ㅇ - 왼쪽 하단: 도넛 형태 */}
      <circle cx="16" cy="82" r="14" fill={color} />
      <circle cx="16" cy="82" r="6" fill={bgColor} />

      {/* ㅈ - 오른쪽: 세 개의 캡슐이 곡선으로 연결된 E 형태 */}
      {/* 상단 캡슐 */}
      <rect x="38" y="4" width="58" height="24" rx="12" fill={color} />
      {/* 중단 캡슐 */}
      <rect x="38" y="38" width="58" height="24" rx="12" fill={color} />
      {/* 하단 캡슐 */}
      <rect x="38" y="72" width="58" height="24" rx="12" fill={color} />

      {/* ㅈ 세로 연결 커브 - 참조 이미지처럼 S자 곡선 */}
      <path
        d="M 38 16
           C 32 16, 32 50, 38 50
           C 32 50, 32 84, 38 84"
        fill={color}
      />
      <rect x="32" y="16" width="12" height="68" fill={color} />

      {/* 곡선 연결부 - 좌측 들어간 부분 */}
      <path
        d="M 32 28
           Q 24 39, 32 50"
        stroke={bgColor}
        strokeWidth="8"
        fill="none"
      />
      <path
        d="M 32 62
           Q 24 73, 32 84"
        stroke={bgColor}
        strokeWidth="8"
        fill="none"
      />
    </svg>
  );
}
