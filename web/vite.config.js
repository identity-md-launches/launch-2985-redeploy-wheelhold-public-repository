import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Deployment packaging only. The pinned application files stay byte-identical.
const stylesheet = fileURLToPath(new URL('./src/style.css', import.meta.url));
const originalFonts = "@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;600;700;800&display=swap');";
const product = 'Wheelhold — A Squeekchain Colony';

export default defineConfig({
  base: './',
  build: { outDir: '../dist', emptyOutDir: true },
  plugins: [{
    name: 'wheelhold-static-packaging',
    enforce: 'pre',
    transform(code, id) {
      if (id.split('?')[0] !== stylesheet) return;
      if (!code.startsWith(originalFonts)) throw new Error('Pinned font import changed; verify upstream provenance.');
      return { code: code.replace(originalFonts, '@import "../hosting/fonts.css";'), map: null };
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<title>[^<]*<\/title>/, `<title>${product}</title>`)
          .replace('</head>', '    <meta property="og:image" content="./og-image.png" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="Wheelhold, a Squeekchain colony, with its burrow and hamster wheel." />\n  </head>');
      }
    }
  }]
});
