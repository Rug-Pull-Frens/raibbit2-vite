import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { VitePluginFonts } from "vite-plugin-fonts";
import { svgBuilder } from "./src/plugins/svgBuilder";
import { vueI18n } from "@intlify/vite-plugin-vue-i18n";
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
                    @import "./src/style/mixins/_mixin.scss";
                    @import "./src/style/_main.scss";
                `,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    // proxy: {
    //     "/api": {
    //         target: "https://wijfssgy0b.execute-api.ap-northeast-1.amazonaws.com",
    //         changeOrigin: true,
    //         rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    // }
  },
  plugins: [
    vue(),
    VitePluginFonts({
      google: {
        families: ["Prompt"],
      },
    }),
    svgBuilder("./src/assets/icon/"),
    vueI18n({
      include: path.resolve(__dirname, "./src/locales/**"),
      compositionOnly: true,
    }),
  ],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
