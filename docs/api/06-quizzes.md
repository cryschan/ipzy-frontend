# 퀴즈 API

Base Path: `/quizzes`

---

## GET /quizzes

활성 퀴즈 목록

### 요청

**인증**: 선택 (비회원도 조회 가능)

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "quiz-001",
      "title": "스타일 퀴즈",
      "description": "당신의 패션 스타일을 알아보세요",
      "questions": [
        {
          "id": "q1-style",
          "text": "평소 선호하는 스타일은?",
          "type": "single",
          "options": [
            {
              "id": "opt-1",
              "text": "캐주얼",
              "value": "casual",
              "imageUrl": "https://cdn.mweoipji.com/quiz/casual.jpg"
            },
            {
              "id": "opt-2",
              "text": "포멀",
              "value": "formal"
            }
          ],
          "order": 1,
          "required": true
        }
      ],
      "isActive": true,
      "order": 1
    }
  ]
}
```

---

## 퀴즈 응답 형식

퀴즈 응답은 `POST /outfits/recommend` API에 전달됩니다:

```json
{
  "quizResponses": [
    {
      "questionId": "q1-style",
      "selectedOptions": ["casual"]
    },
    {
      "questionId": "q2-color",
      "selectedOptions": ["black", "white", "navy"]
    }
  ]
}
```

**필드 설명**
- `questionId`: 질문 ID
- `selectedOptions`: 선택한 옵션의 `value` 배열
  - `type: "single"`인 경우: 배열에 1개 항목
  - `type: "multiple"`인 경우: 배열에 1개 이상 항목

---

## 퀴즈 타입

### single

단일 선택 질문

```json
{
  "type": "single",
  "text": "평소 선호하는 스타일은?",
  "options": [
    { "id": "opt-1", "text": "캐주얼", "value": "casual" },
    { "id": "opt-2", "text": "포멀", "value": "formal" }
  ]
}
```

응답 예시:
```json
{
  "questionId": "q1",
  "selectedOptions": ["casual"]
}
```

### multiple

복수 선택 질문

```json
{
  "type": "multiple",
  "text": "선호하는 컬러를 모두 선택해주세요",
  "options": [
    { "id": "c1", "text": "블랙", "value": "black" },
    { "id": "c2", "text": "화이트", "value": "white" },
    { "id": "c3", "text": "네이비", "value": "navy" }
  ]
}
```

응답 예시:
```json
{
  "questionId": "q2",
  "selectedOptions": ["black", "white", "navy"]
}
```

---

## 참고 사항

### 퀴즈 검증

`POST /outfits/recommend` 호출 시 퀴즈 응답 검증이 수행됩니다:

1. **필수 질문 검증**: `required: true`인 모든 질문에 대한 응답 필요
2. **옵션 검증**: `selectedOptions`에 유효한 값만 포함되어야 함
3. **타입 검증**:
   - `single`: 정확히 1개 옵션 선택
   - `multiple`: 1개 이상 옵션 선택

검증 실패 시 `QUIZ_002` 에러 반환
