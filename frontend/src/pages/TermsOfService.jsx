import React from "react";

const TermsOfService = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>Terms of Service</h1>
                <p className="last-updated">Last Updated: March 2026</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using PopDrop, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                </section>

                <section>
                    <h2>2. Use of Services</h2>
                    <p>You agree to use PopDrop only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the platform.</p>
                </section>

                <section>
                    <h2>3. Intellectual Property</h2>
                    <p>All content on PopDrop, including templates, designs, and code, is the property of PopDrop or its creators and is protected by intellectual property laws.</p>
                </section>

                <section>
                    <h2>4. Limitation of Liability</h2>
                    <p>PopDrop is provided "as is" without any warranties. We are not liable for any damages arising from your use of the platform.</p>
                </section>

                <section>
                    <h2>5. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. Your continued use of the platform after changes constitutes acceptance of the new terms.</p>
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

export default TermsOfService;
