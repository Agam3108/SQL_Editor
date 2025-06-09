/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // primary-blue
          600: '#5855eb', // primary-blue-hover
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3',
        },
        
        // Background Colors
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        },
        
        // Border Colors
        border: {
          DEFAULT: '#e2e8f0',
          hover: '#cbd5e1',
        },
        
        // Text Colors
        text: {
          primary: '#1e293b',
          secondary: '#64748b',
          muted: '#94a3b8',
        },
        
        // Success Colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // success-green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        
        // Danger Colors
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // danger-red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Syntax Highlighting Colors
        syntax: {
          keyword: '#8b5cf6',
          string: '#059669',
          number: '#dc2626',
          comment: '#6b7280',
          function: '#2563eb',
          operator: '#374151',
        },
        
        // Editor Specific Colors
        editor: {
          background: '#ffffff',
          'line-number': '#94a3b8',
          'line-highlight': '#f8fafc',
          'selection': '#ddd6fe',
          'cursor': '#6366f1',
        },
        
        // Table Colors
        table: {
          'header-bg': '#f8fafc',
          'row-hover': '#f1f5f9',
          'border': '#e5e7eb',
        },
        
        // Status Colors
        status: {
          connected: '#10b981',
          disconnected: '#ef4444',
          loading: '#f59e0b',
        },
      },
      
      spacing: {
        // Custom Spacing
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '2.5rem',   // 40px
        '3xl': '3rem',     // 48px
        
        // Editor Specific Spacing
        'tab-height': '2.5rem',
        'sidebar-width': '16rem',
        'toolbar-height': '3rem',
      },
      
      borderRadius: {
        // Custom Border Radius
        'xs': '0.125rem',  // 2px
        'sm': '0.25rem',   // 4px
        'md': '0.375rem',  // 6px
        'lg': '0.5rem',    // 8px
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',     // 16px
      },
      
      boxShadow: {
        // Custom Shadows
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        
        // Editor Specific Shadows
        'editor': '0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'notification': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      
      fontFamily: {
        // Custom Font Families
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', 'monospace'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      
      fontSize: {
        // Custom Font Sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        
        // Code/Editor Specific
        'code': ['0.875rem', { lineHeight: '1.5rem' }], // 14px for code
        'code-sm': ['0.75rem', { lineHeight: '1.25rem' }], // 12px for small code
      },
      
      animation: {
        // Custom Animations
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
      },
      
      keyframes: {
        // Custom Keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      
      zIndex: {
        // Custom Z-Index
        'modal': '50',
        'notification': '60',
        'tooltip': '70',
        'dropdown': '40',
      },
      
      backdropBlur: {
        // Custom Backdrop Blur
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      
      transitionProperty: {
        // Custom Transition Properties
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      
      transitionDuration: {
        // Custom Transition Durations
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      
      screens: {
        // Custom Breakpoints
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        
        // Editor Specific Breakpoints
        'editor-sm': '640px',
        'editor-md': '768px',
        'editor-lg': '1024px',
      },
    },
  },
  plugins: [
    // Add any additional plugins here
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};