import { useEffect } from "react";

const CRT_STYLES = `
  @keyframes flicker {
    0% { opacity: 0.97; }
    5% { opacity: 0.95; }
    10% { opacity: 0.97; }
    15% { opacity: 0.94; }
    20% { opacity: 0.98; }
    25% { opacity: 0.95; }
    30% { opacity: 0.97; }
    35% { opacity: 0.96; }
    40% { opacity: 0.99; }
    45% { opacity: 0.97; }
    50% { opacity: 0.99; }
    55% { opacity: 0.95; }
    60% { opacity: 0.98; }
    65% { opacity: 0.97; }
    70% { opacity: 0.95; }
    75% { opacity: 0.97; }
    80% { opacity: 0.96; }
    85% { opacity: 0.98; }
    90% { opacity: 0.97; }
    95% { opacity: 0.95; }
    100% { opacity: 0.98; }
  }

  .crt-flicker {
    animation: flicker 0.15s infinite;
  }
  
  body {
    overflow-x: hidden;
  }
  
  .scanlines {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.02) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 100% 2px;
    z-index: 999;
    pointer-events: none;
    opacity: 0.3;
  }
  
  .crt-corners:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    box-shadow: inset 0 0 100px 40px rgba(0,0,0,0.9);
    z-index: 10;
    pointer-events: none;
  }
  
  .retro-text {
    text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
    letter-spacing: 1px;
  }
  
  .retro-button-hover {
    transition: all 0.2s ease;
    box-shadow: 0 0 0px rgba(255,255,255,0);
  }
  
  .retro-button-hover:hover {
    box-shadow: 0 0 10px rgba(255,255,255,0.5);
  }
`;

export function useCRTEffects() {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = CRT_STYLES;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
}
