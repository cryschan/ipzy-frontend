import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

/**
 * 한국식 날짜 포맷: "YYYY년 M월 D일"
 * @param date - ISO 문자열 또는 Date 객체
 * @returns 포맷된 날짜 문자열, 유효하지 않으면 "-"
 */
export const formatDateKorean = (date: string | Date | null | undefined): string => {
  if (!date) return "-";
  const parsed = dayjs(date);
  if (!parsed.isValid()) return "-";
  return parsed.format("YYYY년 M월 D일");
};

/**
 * 한국식 날짜+시간 포맷: "YYYY년 M월 D일 HH:mm"
 * @param date - ISO 문자열 또는 Date 객체
 * @returns 포맷된 날짜시간 문자열, 유효하지 않으면 "-"
 */
export const formatDateTimeKorean = (date: string | Date | null | undefined): string => {
  if (!date) return "-";
  const parsed = dayjs(date);
  if (!parsed.isValid()) return "-";
  return parsed.format("YYYY년 M월 D일 HH:mm");
};

/**
 * 짧은 날짜 포맷: "YYYY.MM.DD"
 * @param date - ISO 문자열 또는 Date 객체
 * @returns 포맷된 날짜 문자열, 유효하지 않으면 "-"
 */
export const formatDateShort = (date: string | Date | null | undefined): string => {
  if (!date) return "-";
  const parsed = dayjs(date);
  if (!parsed.isValid()) return "-";
  return parsed.format("YYYY.MM.DD");
};
