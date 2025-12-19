import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "뭐입지 - AI 코디 추천 서비스",
  description = "4가지 질문으로 찾는 나만의 스타일. AI가 추천하는 무신사 코디를 만나보세요.",
  keywords = "코디 추천, AI 코디, AI 스타일링, 인공지능 코디, 무신사, 무신사 코디, 무신사 스타일, 패션 추천, 옷 추천, 의류 추천, 스타일 매칭, 스타일 추천, 퍼스널 스타일링, 개인 맞춤 스타일링, AI 패션, 패션 AI, 스타일 테스트, 패션 테스트, 코디 테스트, 스타일 진단, 패션 진단, 코디 매칭, 옷차림 추천, 옷 조합, 패션 조합, 의류 조합, 코디 조합, 데일리룩, 데일리 코디, 오늘의 코디, 패션 앱, 패션 어플, 스타일링 앱, 코디 앱, 코디 어플, 무료 코디, 무료 스타일링, 온라인 스타일링, 온라인 코디, 가상 스타일리스트, AI 스타일리스트, 자동 코디, 스마트 코디, 맞춤 코디, 남자 코디, 여자 코디, 남성 패션, 여성 패션, 캐주얼 코디, 정장 코디, 데이트 코디, 출근 코디, 패션 스타일, 스트리트 패션, 미니멀 패션, 옷 스타일, 패션 센스, 스타일 컨설팅, 패션 컨설팅, 옷잘입는법, 코디법, 스타일링 팁, 패션 가이드, 코디 가이드, 주우재, 주우재 패션, 주우재 코디, 지드래곤 패션, 강동원 스타일, 공유 코디, 박서준 패션, 이종석 스타일, 차은우 패션, 이민호 코디, 공명 스타일, 연예인 코디, 연예인 패션, 셀럽 스타일, 남자 연예인 패션, 남자 스타 코디",
  image = "https://ipzy.vercel.app/og-image.png",
  url = "https://ipzy.vercel.app",
  type = "website",
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
