# Door

- RESTful api를 활용한 고객 데이터 분석 기반 중고 명품 거래 사이트

데이터 분석을 통해 고객의 니즈에 부합하는 중고 물품과 판매자의 정보를 제공하는 서비스입니다.<br>
고객들의 중고 명품 거래를 위한 효율적인 의사 결정에 도움에 큰 도움이 될것입니다.<br>
시연 영상 : https://www.youtube.com/watch?v=Ss3O0jh82lg<br>
노션 페이지 : https://www.notion.so/25abe3e80fcc4dcc8a645cc959c0c986?v=5e0c92bd9e4e4eaba6a6c7d7e6a57c04<br>
<br>

## 1. 제작 기간 , 참여 인원

- 2024.04.04 ~ 2024.05.23
- 4명
  <br>

## 2. 사용 기술

- Java 17
- Spring Boot 3.2.3
- Spring web MVC
- Spring data JPA
- jwt
- MySQL

- HTML 5
- CSS 3
- JavaScript
- React
- Redux
- Redux-toolkit
  <br>

## 3. 주요 기능

- 메인 페이지 - 중고 상품 목록, 일반 검색, 지도 검색, 현재 진행중인 경매 섹션
- 경매 페이지 - 경매 물품 목록, 물품 상세 페이지, 1:N 경매 입찰 채팅
- 중고 판매 등록 - 중고 거래 희망 상품 등록, 지도로 위치 등록
- 중고 물품 상세 - 1:1 채팅, 희망 거래 장소 지도로 확인
- 찜 목록 - 찜 목록에 물품 담기
- 로그인, 회원가입 페이지 - 로그인과 회원가입
- 마이 페이지 - 판매 목록, 진행 중인 경매, 참여 채팅창 확인
- 공개 프로필 페이지 - 판매 목록, 최다 판매 카테고리·평균 거래가·주요 거래 지역 데이터 제공
  <br>

## 4. 분석 패키지 구조도

![구조도](https://github.com/camp-recommerce/recommerce/blob/test/Re_InformationArchitecture.PNG)
<br>

## 5. 개체-관계 모델(ERD)

![ERD](https://github.com/camp-recommerce/recommerce/blob/test/Re_ERD.png)

<br>

## 6. 개발 팀 소개

- 이재우(https://github.com/ljwc6020) : 서버 스케쥴링 기능을 통한 경매 상태 자동 변경, 경매/채팅 알림, 마이 페이지 내 채팅 방/경매 내역 구현, 1:1/1:N 채팅, 찜 목록, 경매 페이지, 카테고리/검색 구현

- 임형욱(https://github.com/limhyeonguk): 사용자 JWT토큰, 로그인, 카카오 로그인, 회원 가입/정보 수정/탈퇴, 비밀번호 찾기, 마이 페이지, 마이 페이지 내 판매 목록 구현, 공개 프로필 페이지, 웹 페이지 시연 영상 촬영

- 신승훈(https://github.com/overguy723) : 경매 backend, 공개 프로필 판매자 데이터 분석 비즈니스 로직 구성, 메인 페이지 지도/장소 검색, 팀 프로젝트 PDF 제작

- 최혜선(https://github.com/choihyeseon1217) : 중고 상품, 중고 상품 리스트 페이지(메인 페이지) 구축
메인 페이지 CSS(header 디자인, 부트스트랩 / 반응형 이미지 / 무한 스크롤) 구성, 결제 API(토스 페이먼츠)

  <br>

## 주의사항

- 저작권 문제로 이미지는 전부 삭제했습니다.
- 또한 개인정보가 들어간 서비스 키와 같은 데이터도 전부 제외했습니다.
