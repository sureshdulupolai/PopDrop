import React from "react";

const ProfilePopup = ({ type, title, text, onClose }) => {
  const icons = {
    success: "bi-check-lg",
    error: "bi-x-lg",
    warning: "bi-exclamation-lg",
    info: "bi-info-lg",
  };

  return (
    <div className="popup-bg">
      <div className={`popup-card ${type}`}>
        <div className="popup-header"></div>
        <div className="popup-icon">
          <i className={`bi ${icons[type]}`}></i>
        </div>
        <div className="popup-body">
          <h5>{title}</h5>
          <p>{text}</p>
          <button className="popup-btn" onClick={onClose}>
            Okay
          </button>
        </div>
      </div>

      <style>{`
      .popup-bg {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .popup-card {
          width: 320px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          text-align: center;
          padding: 0;
          animation: pop .3s ease;
        }
        @keyframes pop { from {transform: scale(.85); opacity:0} to {transform: scale(1); opacity:1} }
        .popup-header { height:70px; }
        .popup-icon {
          width:60px;
          height:60px;
          border-radius:50%;
          background:#fff;
          margin:-30px auto 0;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:26px;
          box-shadow:0 10px 25px rgba(0,0,0,0.18);
        }
        .popup-body { padding:18px 20px 22px; }
        .popup-body h5 { margin-top:12px; }
        .popup-body p { color:#777; font-size:14px; margin-top:6px; }
        .popup-btn {
          margin-top:16px;
          padding:7px 26px;
          border-radius:20px;
          font-size:14px;
          background:transparent;
          color:#f65b3b;
          border:1.5px solid #f65b3b;
          cursor:pointer;
          transition: all .25s ease;
        }
        .popup-btn:hover { background:#f65b3b;color:#fff; }

        .success .popup-header{background:#2ecc71;}
        .success .popup-icon{color:#2ecc71;}
        .error .popup-header{background:#ff4d4f;}
        .error .popup-icon{color:#ff4d4f;}
        .warning .popup-header{background:#f4b400;}
        .warning .popup-icon{color:#f4b400;}
        .info .popup-header{background:#1a73e8;}
        .info .popup-icon{color:#1a73e8;}
      `}</style>
    </div>
  );
};

export default ProfilePopup;
