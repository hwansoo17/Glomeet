# Glomeet 클라이언트

## 소개

Glomeet은 재학생과 교환학생 간의 교류를 활성화하기 위한 매칭과 미팅 서비스입니다.
최근 국내 대학교에서 교환학생의 비율이 높아지고 있는것에 비해 교환학생과의 교류가 적은 것에 아쉬움을 느껴 기획했습니다.
서비스는 실시간 매칭, 채팅, JWT 기반 로그인 등 다양한 기능을 제공합니다.


## 배포

서비스 시작 - 24.05.27 ~
앱스토어 : https://apps.apple.com/kr/app/glomeet/id6502836378

## 프로젝트 정보

- **개발 인원:** 2명
- **개발 기간:** 2024.01.01 ~

## 기술 스택
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=yellow">


### 협업 툴

<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=yellow"> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=yellow">

## 기능 시연 및 구현 방법

### 읽지 않은 메시지 개수 및 마지막 메시지

https://github.com/swoolee97/glomeet-server/assets/73256853/31926cf9-cbc1-4be0-a542-ad7fe2de6547

- 메시지의 타입을 ENTER, EXIT으로 나누어 사용자가 채팅방에 입장, 퇴장할 때를 파악했습니다.
- ENTER, EXIT 타입의 메시지가 발행되면 서버는 MongoDB의 LastReadAt 컬렉션을 업데이트합니다.
- 채팅탭으로 들어가면 LastReadAt을 찾고, 그 시간 이후의 메시지 중 해당 채팅방의 SEND 타입인 메시지를 찾아 카운트하여 반환합니다.
- 각 메시지가 저장되는 시간은 밀리초까지 저장하여 카운트의 정확도를 높일 수 있었습니다.
- **마지막 메시지**는 SEND타입의 메시지가 발행되면 채팅방 별 LastMessage를 캐싱하여 관리했습니다.

---

### 모임 참여 : 운동, 문화 등 교류할 수 있는 활동을 만들고 참여하는 기능

https://github.com/swoolee97/glomeet-server/assets/73256853/11a908cc-9fe2-4ba2-a94f-4a6e29b4fd7c

- 미팅에 속한 유저는 상태를 ACTIVE, INACTIVE로 분류하여 관리했습니다.
- MeetingUser또한 입장시간을 밀리초까지 저장하여 입장한 이후의 메시지만 표시할 수 있도록 구현했습니다.
- 나가거나 신고당한 유저는 INACTIVE로 변경됩니다.

---

### 매칭 시작/취소

https://github.com/swoolee97/glomeet-server/assets/73256853/fa55e362-3ba5-4905-8a46-3e8bc8d5cf35

--- 

### 프로필사진 변경

https://github.com/swoolee97/glomeet-server/assets/73256853/b07a5636-25b8-4558-9c5d-7ef5a0d48fc6

---

### 매칭 성사 : 관심사가 맞는 재학생과 교환학생을 매칭

https://github.com/swoolee97/glomeet-server/assets/73256853/2b3cd0db-7f2c-4d4e-a30c-13d4fd6687fd

- 매칭은 재학생/외국인학생 두 분류의 Redis 큐로 나누어 관리했습니다.
- 대기열에 있는 두 유저의 성향을 확인한 후 일치하는 성향이 있는 유저들을 우선 매칭시킵니다.
- 만약 성향이 일치하는 유저가 없다면 무작위로 두 유저가 매칭됩니다.
- Spring 스케쥴러를 사용해 5초마다 매칭을 시도하도록 구현하였습니다.

---

### 유저 차단 : 차단한 이후의 메시지와 컨텐츠를 볼 수 없습니다.

https://github.com/swoolee97/glomeet-server/assets/73256853/aa7a7ddd-4370-4571-a578-bb7bf05ad014

- 채팅방에 입장시 본인이 차단한 유저들의 닉네임을 주어 해당 유저들이 발행한 메시지를 볼 수 없게 필터링했습니다.

---

## ERD

<img width="788" alt="image" src="https://github.com/swoolee97/glomeet-server/assets/73256853/1fc63869-0768-486b-8135-4df6bcc3a564">

## 디렉토리 구조

```bash
├── GlomeetApplication.java
├── auth
│   ├── ExceptionHandlerFilter.java
│   ├── JwtAuthenticationFilter.java
│   └── JwtTokenProvider.java
├── config
│   ├── FCMConfig.java
│   ├── MessageConfig.java
│   ├── MongoConfig.java
│   ├── MyBatisConfig.java
│   ├── RedisConfig.java
│   ├── S3Config.java
│   ├── SecurityConfig.java
│   └── WebSocketConfig.java
├── constants
│   ├── AdditionalInfo.java
│   ├── RedisConstants.java
│   └── WebSocketConstants.java
├── controller
│   ├── AuthController.java
│   ├── BlockController.java
│   ├── ChattingController.java
│   ├── FCMController.java
│   ├── HealthyController.java
│   ├── ImageController.java
│   ├── MailController.java
│   ├── MatchController.java
│   ├── MatchingController.java
│   ├── MatchingListRequestDTO.java
│   ├── MeetingController.java
│   ├── MessageController.java
│   ├── NotificationController.java
│   ├── PointController.java
│   ├── ReportController.java
│   ├── TokenController.java
│   └── UserController.java
├── dto
│   ├── BlockDTO.java
│   ├── ChatInfoDTO.java
│   ├── ChatMessageDTO.java
│   ├── ChattingStatusDTO.java
│   ├── CountMeetingDTO.java
│   ├── FCMMessage.java
│   ├── LoginResponseDTO.java
│   ├── MatchingMessageDTO.java
│   ├── MatchingResultDTO.java
│   ├── MeetingCreateRequestDTO.java
│   ├── MeetingInfoDTO.java
│   ├── MeetingReportRequestDTO.java
│   ├── MemberDTO.java
│   ├── MemberJoinRequestDTO.java
│   ├── MessageListRequestDTO.java
│   ├── PushMessageRequestDTO.java
│   ├── ResponseBody.java
│   ├── TokenDTO.java
│   ├── UpdateLastReadTimeDTO.java
│   ├── UserDTO.java
│   └── UserReportRequestDTO.java
├── entity
│   ├── Block.java
│   ├── ChatInfoInterface.java
│   ├── ChatRoom.java
│   ├── FcmToken.java
│   ├── MatchingRoom.java
│   ├── MatchingUser.java
│   ├── MatchingUserId.java
│   ├── Meeting.java
│   ├── MeetingInfoInterface.java
│   ├── MeetingReport.java
│   ├── MeetingUser.java
│   ├── MeetingUserId.java
│   ├── Member.java
│   ├── Message.java
│   ├── Point.java
│   ├── RefreshToken.java
│   └── UserReport.java
├── exception
│   ├── AccessDeniedHandlerImpl.java
│   ├── DuplicatedUserBlockException.java
│   ├── FCMTokenNotFoundException.java
│   ├── FCMTokenNotFoundExceptionHandler.java
│   ├── GlobalExceptionHandler.java
│   └── InvalidSchoolEmailException.java
├── mapper
│   └── MatchingMapper.java
├── message
│   ├── DatabaseMessageRetriever.java
│   ├── MessageFinder.java
│   ├── MessageRetriever.java
│   └── RedisMessageRetriever.java
├── mongo
│   └── model
│       ├── ChatMessage.java
│       ├── LastReadTime.java
│       ├── MeetingMessage.java
│       └── Sequence.java
├── repository
│   ├── BlockRepository.java
│   ├── ChatMessageRepository.java
│   ├── ChatMessageRepositoryCustom.java
│   ├── ChatMessageRepositoryCustomImpl.java
│   ├── EmitterRepository.java
│   ├── FCMTokenRepository.java
│   ├── LastReadTimeRepository.java
│   ├── MatchingRepository.java
│   ├── MatchingRoomRepository.java
│   ├── MatchingUserRepository.java
│   ├── MeetingReportRepository.java
│   ├── MeetingRepository.java
│   ├── MeetingUserRepository.java
│   ├── MemberRepository.java
│   ├── PointRepository.java
│   ├── RefreshTokenRepository.java
│   ├── UserReportRepository.java
│   └── VerificationRepository.java
├── response
│   └── Response.java
├── security
│   └── CustomAuthenticationEntryPoint.java
├── service
│   ├── AuthService.java
│   ├── BlockService.java
│   ├── ChattingService.java
│   ├── CustomSessionExpiredStrategy.java
│   ├── FCMService.java
│   ├── ImageService.java
│   ├── MailService.java
│   ├── MatchService.java
│   ├── MatchingService.java
│   ├── MeetingService.java
│   ├── MemberService.java
│   ├── MessageService.java
│   ├── NotificationService.java
│   ├── PointService.java
│   ├── ReportService.java
│   ├── S3Service.java
│   ├── StompHandler.java
│   ├── TokenService.java
│   ├── UserDetailsServiceImpl.java
│   └── UserService.java
```
