import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true, // 포트가 사용 중이면 에러를 발생시켜 강제로 8080 사용
    // 프록시 설정 제거 - 직접 API 호출 사용
  },
});
