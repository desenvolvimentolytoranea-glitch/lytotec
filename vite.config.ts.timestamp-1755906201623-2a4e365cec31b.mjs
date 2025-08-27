// vite.config.ts
import { defineConfig } from "file:///C:/Users/siste/Desktop/lytoraneatec/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/siste/Desktop/lytoraneatec/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/siste/Desktop/lytoraneatec/node_modules/lovable-tagger/dist/index.js";
import { VitePWA } from "file:///C:/Users/siste/Desktop/lytoraneatec/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\siste\\Desktop\\lytoraneatec";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectManifest: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        // 10 MB
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"]
      },
      includeAssets: [
        "favicon.ico",
        "icons/*.png",
        "apple-touch-icon.png",
        "masked-icon.svg"
      ],
      manifest: {
        name: "Lytor\xE2nea Construtora - Sistema ERP",
        short_name: "LYTOTEC ERP",
        description: "Sistema ERP completo para gest\xE3o de empresas de constru\xE7\xE3o civil",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        id: "app.lytotec.erp",
        launch_handler: {
          client_mode: "focus-existing"
        },
        icons: [
          {
            src: "icons/icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/maskable-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "icons/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    sourcemap: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select", "@radix-ui/react-toast"],
          charts: ["recharts"],
          supabase: ["@supabase/supabase-js"],
          xlsx: ["xlsx"],
          "react-query": ["@tanstack/react-query"],
          "date-utils": ["date-fns", "date-fns-tz"],
          "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "routing": ["react-router-dom"],
          "lucide": ["lucide-react"]
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzaXN0ZVxcXFxEZXNrdG9wXFxcXGx5dG9yYW5lYXRlY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc2lzdGVcXFxcRGVza3RvcFxcXFxseXRvcmFuZWF0ZWNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3Npc3RlL0Rlc2t0b3AvbHl0b3JhbmVhdGVjL3ZpdGUuY29uZmlnLnRzXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiYgY29tcG9uZW50VGFnZ2VyKCksXHJcbiAgICBWaXRlUFdBKHtcclxuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgICAgIGluamVjdFJlZ2lzdGVyOiAnYXV0bycsXHJcbiAgICAgIHN0cmF0ZWdpZXM6ICdpbmplY3RNYW5pZmVzdCcsXHJcbiAgICAgIHNyY0RpcjogJ3NyYycsXHJcbiAgICAgIGZpbGVuYW1lOiAnc3cudHMnLFxyXG4gICAgICBpbmplY3RNYW5pZmVzdDoge1xyXG4gICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiAxMCAqIDEwMjQgKiAxMDI0LCAvLyAxMCBNQlxyXG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyx3b2ZmLHdvZmYyfSddXHJcbiAgICAgIH0sXHJcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcclxuICAgICAgICAnZmF2aWNvbi5pY28nLCBcclxuICAgICAgICAnaWNvbnMvKi5wbmcnLCBcclxuICAgICAgICAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnLCBcclxuICAgICAgICAnbWFza2VkLWljb24uc3ZnJ1xyXG4gICAgICBdLFxyXG4gICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgIG5hbWU6ICdMeXRvclx1MDBFMm5lYSBDb25zdHJ1dG9yYSAtIFNpc3RlbWEgRVJQJyxcclxuICAgICAgICBzaG9ydF9uYW1lOiAnTFlUT1RFQyBFUlAnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2lzdGVtYSBFUlAgY29tcGxldG8gcGFyYSBnZXN0XHUwMEUzbyBkZSBlbXByZXNhcyBkZSBjb25zdHJ1XHUwMEU3XHUwMEUzbyBjaXZpbCcsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjM2I4MmY2JyxcclxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICAgIGRpc3BsYXlfb3ZlcnJpZGU6IFsnd2luZG93LWNvbnRyb2xzLW92ZXJsYXknLCAnc3RhbmRhbG9uZScsICdtaW5pbWFsLXVpJ10sXHJcbiAgICAgICAgb3JpZW50YXRpb246ICdwb3J0cmFpdC1wcmltYXJ5JyxcclxuICAgICAgICBzY29wZTogJy8nLFxyXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxyXG4gICAgICAgIGlkOiAnYXBwLmx5dG90ZWMuZXJwJyxcclxuICAgICAgICBsYXVuY2hfaGFuZGxlcjoge1xyXG4gICAgICAgICAgY2xpZW50X21vZGU6ICdmb2N1cy1leGlzdGluZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ2ljb25zL2ljb24tNDh4NDgucG5nJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICc0OHg0OCcsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAnaWNvbnMvaWNvbi03Mng3Mi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzcyeDcyJyxcclxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnknXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdpY29ucy9pY29uLTk2eDk2LnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnOTZ4OTYnLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ2ljb25zL2ljb24tMTQ0eDE0NC5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE0NHgxNDQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ2ljb25zL2ljb24tMTkyeDE5Mi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ2ljb25zL2ljb24tNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ2ljb25zL21hc2thYmxlLWljb24tMTkyeDE5Mi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ21hc2thYmxlJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAnaWNvbnMvbWFza2FibGUtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ21hc2thYmxlJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgZGV2T3B0aW9uczoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgdHlwZTogJ21vZHVsZSdcclxuICAgICAgfVxyXG4gICAgfSlcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxyXG4gICAgICAgICAgdWk6IFsnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JywgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCddLFxyXG4gICAgICAgICAgY2hhcnRzOiBbJ3JlY2hhcnRzJ10sXHJcbiAgICAgICAgICBzdXBhYmFzZTogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcclxuICAgICAgICAgIHhsc3g6IFsneGxzeCddLFxyXG4gICAgICAgICAgJ3JlYWN0LXF1ZXJ5JzogWydAdGFuc3RhY2svcmVhY3QtcXVlcnknXSxcclxuICAgICAgICAgICdkYXRlLXV0aWxzJzogWydkYXRlLWZucycsICdkYXRlLWZucy10eiddLFxyXG4gICAgICAgICAgJ2Zvcm1zJzogWydyZWFjdC1ob29rLWZvcm0nLCAnQGhvb2tmb3JtL3Jlc29sdmVycycsICd6b2QnXSxcclxuICAgICAgICAgICdyb3V0aW5nJzogWydyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICAnbHVjaWRlJzogWydsdWNpZGUtcmVhY3QnXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdA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
