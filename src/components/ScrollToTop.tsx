import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    // 강제로 즉시 스크롤 이동: 전역 smooth 설정 무시
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    // 원복
    html.style.scrollBehavior = prev;
  }, [location.pathname]);

  return null;
}
