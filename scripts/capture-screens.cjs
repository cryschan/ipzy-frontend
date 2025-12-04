const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:5173";
const OUTPUT_DIR = path.join(__dirname, "../screenshots");

const pages = [
  { name: "01_Home", path: "/", description: "메인 홈 화면" },
  { name: "02_Login", path: "/login", description: "로그인 화면" },
  { name: "04_Quiz_Q1", path: "/quiz", description: "퀴즈 화면 (Q1)" },
  { name: "05_Loading", path: "/loading", description: "AI 로딩 화면" },
  { name: "06_Result", path: "/result", description: "결과 화면" },
  { name: "07_Pricing", path: "/pricing", description: "구독 플랜 화면" },
  { name: "08_Payment", path: "/payment", description: "결제 화면" },
  { name: "09_MyPage", path: "/mypage", description: "마이페이지 화면" },
  {
    name: "10_Error_404",
    path: "/not-found-page",
    description: "404 에러 화면",
  },
  {
    name: "11_Error_500",
    path: "/error/500",
    description: "500 서버 에러 화면",
  },
  {
    name: "12_Error_Network",
    path: "/error/network",
    description: "네트워크 에러 화면",
  },
];

async function captureScreenshots() {
  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 모바일 뷰포트 설정 (iPhone 14 Pro 기준)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
  });

  console.log("📸 스크린샷 캡처 시작...\n");

  for (const pageInfo of pages) {
    try {
      await page.goto(`${BASE_URL}${pageInfo.path}`, {
        waitUntil: "networkidle0",
        timeout: 10000,
      });

      // 로딩 페이지는 잠시 대기
      if (pageInfo.path === "/loading") {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 전체 페이지 스크린샷
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${pageInfo.name}.png`),
        fullPage: true,
      });

      console.log(`  ✅ 저장됨: ${pageInfo.name}.png`);
    } catch (error) {
      console.log(`  ❌ 실패: ${pageInfo.name} - ${error.message}`);
    }
  }

  // 데스크톱 뷰포트로 홈 화면 추가 캡처
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  });

  try {
    console.log(`캡처 중: 01_Home_Desktop (/)`);
    await page.goto(`${BASE_URL}/`, {
      waitUntil: "networkidle0",
      timeout: 10000,
    });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "01_Home_Desktop.png"),
      fullPage: true,
    });
    console.log(`  ✅ 저장됨: 01_Home_Desktop.png`);
  } catch (error) {
    console.log(`  ❌ 실패: 01_Home_Desktop - ${error.message}`);
  }

  await browser.close();

  console.log(`\n✨ 완료! 스크린샷 저장 위치: ${OUTPUT_DIR}`);
}

captureScreenshots().catch(console.error);
