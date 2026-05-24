import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: March 2026</p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, upload templates, or contact us for support.</p>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you about updates and offers.</p>
                </section>

                <section>
                    <h2>3. Data Security</h2>
                    <p>We take reasonable measures to protect your personal information from loss, theft, and unauthorized access.</p>
                </section>

                <section>
                    <h2>4. Third-Party Services</h2>
                    <p>We may use third-party services to help us operate our platform. These services have their own privacy policies.</p>
                </section>

                <section>
                    <h2>5. Your Rights</h2>
                    <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>
                </section>
            </div>

            <style>{`
        .legal-container {
          min-height: 80vh;
          background: #f8fafc;
          padding: 120px 20px 60px;
          display: flex;
          justify-content: center;
        }
        .legal-card {
          max-width: 800px;
          width: 100%;
          background: #fff;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .legal-card h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .last-updated {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 40px;
        }
        .legal-card h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #6d5cff;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .legal-card p {
          color: #444;
          line-height: 1.8;
          font-size: 1.05rem;
        }
        @media (max-width: 768px) {
          .legal-card {
            padding: 30px;
          }
          .legal-card h1 {
            font-size: 2rem;
          }
        }
      `}</style>
        </div>
    );
};

export default PrivacyPolicy;
