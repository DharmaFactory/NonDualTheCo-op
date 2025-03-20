import { createGlobalStyle } from 'styled-components';

// Global styles for the neobrutalism design
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;600&family=VT323&display=swap');

  :root {
    --color-background: #FFFFFF;
    --color-background-secondary: #F5F5F5;
    --color-accent-primary: #FF6B6B;
    --color-accent-secondary: #4ECDC4;
    --color-accent-tertiary: #FFE66D;
    --color-text-primary: #1A1A1A;
    --color-text-secondary: #4A4A4A;
    --color-border: #000000;
    
    --border-width: 3px;
    --border-offset: 3px;
    --border-radius: 4px;
    
    --font-heading: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'VT323', monospace;
    
    --shadow-default: var(--border-offset) var(--border-offset) 0 0 var(--color-border);
    --transition-default: all 0.2s ease-in-out;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--color-background);
    color: var(--color-text-primary);
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
  }

  button, input, textarea, select {
    font-family: var(--font-body);
    font-size: 1rem;
  }

  button {
    cursor: pointer;
    background-color: var(--color-background);
    border: var(--border-width) solid var(--color-border);
    padding: 0.5rem 1rem;
    font-weight: 600;
    box-shadow: var(--shadow-default);
    transition: var(--transition-default);

    &:hover {
      transform: translate(-1px, -1px);
      box-shadow: calc(var(--border-offset) + 1px) calc(var(--border-offset) + 1px) 0 0 var(--color-border);
    }

    &:active {
      transform: translate(1px, 1px);
      box-shadow: calc(var(--border-offset) - 1px) calc(var(--border-offset) - 1px) 0 0 var(--color-border);
    }
  }

  input, textarea {
    border: var(--border-width) solid var(--color-border);
    padding: 0.5rem;
    background-color: var(--color-background-secondary);
    box-shadow: var(--shadow-default);

    &:focus {
      outline: none;
      box-shadow: calc(var(--border-offset) + 1px) calc(var(--border-offset) + 1px) 0 0 var(--color-border);
    }
  }

  a {
    color: var(--color-accent-primary);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Theme configuration
export const theme = {
  colors: {
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    accentPrimary: '#FF6B6B',
    accentSecondary: '#4ECDC4',
    accentTertiary: '#FFE66D',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    border: '#000000',
  },
  fonts: {
    heading: '"Space Grotesk", sans-serif',
    body: '"Inter", sans-serif',
    mono: '"VT323", monospace',
  },
  borders: {
    width: '3px',
    offset: '3px',
    radius: '4px',
  },
  shadows: {
    default: '3px 3px 0 0 #000000',
  },
  transitions: {
    default: 'all 0.2s ease-in-out',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
  },
};
