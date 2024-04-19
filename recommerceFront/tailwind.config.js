/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        100: "100%", // '100' 클래스 이름으로 100% 너비 추가
      },
      height: {
        62: "15.5rem", // 예시로 15.5rem을 추가
      },
    },
  },
  plugins: [],
};
