import React, { useEffect, useState } from "react";
import { useLoading } from "./LoadingContext";
import logo from "../../assets/logo.png";

const GlobalLoader = ({ forceShow = false }) => {
  const { loading } = useLoading();
  const [show, setShow] = useState(false);

  // Buffer to avoid flickering for ultra-fast requests
  useEffect(() => {
    let timeout;
    if (loading || forceShow) {
      timeout = setTimeout(() => setShow(true), 150);
    } else {
      setShow(false);
    }
    return () => clearTimeout(timeout);
  }, [loading, forceShow]);

  if (!show) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="logo-container">
          <img src={logo} alt="PopDrop Logo" className="loader-logo" />
          <div className="logo-pulse"></div>
        </div>
        <div className="loader-progress">
          <div className="progress-bar"></div>
        </div>
        <p className="loader-text">Initializing Magic...</p>
      </div>

      <style>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px) saturate(180%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          transition: opacity 0.4s ease-in-out;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px;
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo-container {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          z-index: 2;
          filter: drop-shadow(0 10px 20px rgba(109, 92, 255, 0.2));
        }

        .logo-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(109, 92, 255, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse-ring 2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
          z-index: 1;
        }

        .loader-progress {
          width: 200px;
          height: 4px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          position: absolute;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, #6d5cff, #a28eff);
          border-radius: 10px;
          animation: loading-bar 1.5s infinite ease-in-out;
        }

        .loader-text {
          font-weight: 700;
          color: #1a1a1a;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.8;
          margin: 0;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        @keyframes loading-bar {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Dark mode support if needed */
        @media (prefers-color-scheme: dark) {
          .loader-overlay {
            background: rgba(10, 10, 15, 0.9);
          }
          .loader-text {
            color: #ffffff;
          }
          .loader-progress {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;
