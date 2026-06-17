import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      'react': 'https://esm.sh/react@18.3.1',
      'react-dom/client': 'https://esm.sh/react-dom@18.3.1/client',
      'react-dom': 'https://esm.sh/react-dom@18.3.1',
      'react/jsx-runtime': 'https://esm.sh/react@18.3.1/jsx-runtime',
      'react/jsx-dev-runtime': 'https://esm.sh/react@18.3.1/jsx-dev-runtime'
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
