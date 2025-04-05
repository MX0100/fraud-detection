import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Spring Boot后端地址
        changeOrigin: true,
        rewrite: (path) => path, // 保持路径不变
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("代理错误:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("发送请求到:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("收到响应:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
