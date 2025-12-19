import { useState } from "react";
import "./Home.css";

export default function PopdropExperience() {
  const [activeTab, setActiveTab] = useState("Templates");

  /* ===============================
      LEFT SIDE TAB CONTENT
  ================================== */
  const leftContent = {
    Templates: (
      <>
        <p className="exp-small-title">TEMPLATE EXPERIENCES</p>
        <h2 className="exp-title">
          One template,<br /> personalized for multiple projects
        </h2>
        <p className="exp-desc">
          PopDrop allows you to personalize templates instantly.
          Choose a popup design, select a category, and apply different
          variants for landing pages, ecommerce, SaaS, blogs and more.
        </p>
        <p className="exp-desc">
          Every template includes HTML, Bootstrap, and React versions —
          copy & paste instantly with zero setup.
        </p>
      </>
    ),

    Categories: (
      <>
        <p className="exp-small-title">TEMPLATE CATEGORIES</p>
        <h2 className="exp-title">
          Pre-built popup sets<br /> for every industry
        </h2>
        <p className="exp-desc">
          Explore categories like ecommerce discounts, SaaS onboarding,
          blogs, lead magnets, announcements & more.
        </p>
        <p className="exp-desc">
          Each category contains 5–12 handcrafted templates ready to use.
        </p>
      </>
    ),

    "Code Snippets": (
      <>
        <p className="exp-small-title">DEVELOPER SNIPPETS</p>
        <h2 className="exp-title">
          Clean, reusable code<br /> for faster development
        </h2>
        <p className="exp-desc">
          PopDrop includes JS logic for animations, triggers,
          timing, delayed popups, exit-intent popups & more.
        </p>
        <p className="exp-desc">
          Built for developers — copy classes, JS logic and React hooks instantly.
        </p>
      </>
    ),

    "AI-Generated": (
      <>
        <p className="exp-small-title">AI BASED POPUPS</p>
        <h2 className="exp-title">
          Generate popup designs<br /> instantly with AI
        </h2>
        <p className="exp-desc">
          Type your goal — “More signups”, “Offer discount”, “Grow email list”.
          PopDrop AI generates layout, color theme & content instantly.
        </p>
        <p className="exp-desc">
          Export in HTML, Bootstrap, or React with one click.
        </p>
      </>
    ),

    "Smart Tags": (
      <>
        <p className="exp-small-title">PERSONALIZATION ENGINE</p>
        <h2 className="exp-title">
          Personalize popups<br /> with Smart-Tags
        </h2>
        <p className="exp-desc">
          Smart Tags allow dynamic text like user name, location, time,
          and campaign data. No backend required.
        </p>
        <p className="exp-desc">
          Perfect for ecommerce offers, SaaS trials, regional discounts & more.
        </p>
      </>
    ),
  };

  /* ===============================
      RIGHT SIDE CONTENT (Dynamic)
  ================================== */
  const rightContent = {
    Templates: (
      <div className="exp-card mt-3">
        <div className="exp-card-header"><span>Popular Template Sets</span></div>

        <div className="exp-item"><span className="exp-index">1</span>
          <div><h6 className="exp-item-title">Ecommerce Popups</h6>
            <p className="exp-item-sub">7 Templates · Drag & Drop</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">2</span>
          <div><h6 className="exp-item-title">SaaS Signup Boosters</h6>
            <p className="exp-item-sub">5 Templates · React + Bootstrap</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">3</span>
          <div><h6 className="exp-item-title">Blogs & Readers</h6>
            <p className="exp-item-sub">4 Templates · Lightweight</p></div>
        </div>

        <div className="exp-item mb-0"><span className="exp-index">4</span>
          <div><h6 className="exp-item-title">General Purpose</h6>
            <p className="exp-item-sub">12 Templates · Universal</p></div>
        </div>
      </div>
    ),

    Categories: (
      <div className="exp-card">
        <div className="exp-card-header"><span>Category Sets</span></div>

        <div className="exp-item"><span className="exp-index">1</span>
          <div><h6 className="exp-item-title">Discount Popups</h6>
            <p className="exp-item-sub">6 Templates · Sales Focus</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">2</span>
          <div><h6 className="exp-item-title">Lead Generation</h6>
            <p className="exp-item-sub">8 Templates · High Conversion</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">3</span>
          <div><h6 className="exp-item-title">Product Announcements</h6>
            <p className="exp-item-sub">5 Templates · Modern UI</p></div>
        </div>

        <div className="exp-item mb-0"><span className="exp-index">4</span>
          <div><h6 className="exp-item-title">Newsletter Signup</h6>
            <p className="exp-item-sub">10 Templates · Clean Layouts</p></div>
        </div>
      </div>
    ),

    "Code Snippets": (
      <div className="exp-card">
        <div className="exp-card-header"><span>Reusable Snippets</span></div>

        <div className="exp-item"><span className="exp-index">1</span>
          <div><h6 className="exp-item-title">Open on Scroll</h6>
            <p className="exp-item-sub">JS Trigger · 10 lines</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">2</span>
          <div><h6 className="exp-item-title">Exit Intent Popup</h6>
            <p className="exp-item-sub">JS Logic · High Conversion</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">3</span>
          <div><h6 className="exp-item-title">Timer + Delay Popup</h6>
            <p className="exp-item-sub">JS + CSS Animation</p></div>
        </div>

        <div className="exp-item mb-0"><span className="exp-index">4</span>
          <div><h6 className="exp-item-title">React Hook Popup</h6>
            <p className="exp-item-sub">Custom Hook · Easy Use</p></div>
        </div>
      </div>
    ),

    "AI-Generated": (
      <div className="exp-card">
        <div className="exp-card-header"><span>AI Powered Sets</span></div>

        <div className="exp-item"><span className="exp-index">1</span>
          <div><h6 className="exp-item-title">AI Signup Boosters</h6>
            <p className="exp-item-sub">Auto-Generated Layouts</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">2</span>
          <div><h6 className="exp-item-title">AI Discount Offers</h6>
            <p className="exp-item-sub">Dynamic Colors · Auto UI</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">3</span>
          <div><h6 className="exp-item-title">AI Newsletter Popups</h6>
            <p className="exp-item-sub">Clean Modern Design</p></div>
        </div>

        <div className="exp-item mb-0"><span className="exp-index">4</span>
          <div><h6 className="exp-item-title">AI Promo Boxes</h6>
            <p className="exp-item-sub">Instant Export</p></div>
        </div>
      </div>
    ),

    "Smart Tags": (
      <div className="exp-card">
        <div className="exp-card-header"><span>Smart-Tag Based Sets</span></div>

        <div className="exp-item"><span className="exp-index">1</span>
          <div><h6 className="exp-item-title">Location Based Offers</h6>
            <p className="exp-item-sub">Auto detects region</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">2</span>
          <div><h6 className="exp-item-title">Time-Based Popups</h6>
            <p className="exp-item-sub">Good Morning / Evening</p></div>
        </div>

        <div className="exp-item"><span className="exp-index">3</span>
          <div><h6 className="exp-item-title">Device Based Popups</h6>
            <p className="exp-item-sub">Mobile · Desktop · Tablet</p></div>
        </div>

        <div className="exp-item mb-0"><span className="exp-index">4</span>
          <div><h6 className="exp-item-title">User Interest Popups</h6>
            <p className="exp-item-sub">Dynamic Personalization</p></div>
        </div>
      </div>
    ),
  };

  return (
    <>
      {/* ------ TOP HERO ------ */}
      <section className="popdrop-top-hero text-center py-3 bg-white">
        <div className="container mt-4">
          <h1 className="popdrop-main-heading">More customization,</h1>
          <h1 className="popdrop-secondary-heading">more creativity, less effort</h1>
          <p className="popdrop-main-subtext">
            Build powerful popups with clean code, reusable templates and zero complexity.
          </p>
        </div>
      </section>


      {/* ------- EXPERIENCE SECTION ------- */}
      <section className="popdrop-experience-section bg-white">
        <div className="container py-4">

          {/* Tabs */}
          <div className="experience-tabs d-flex flex-wrap justify-content-center gap-3 mb-5">
            {["Templates", "Categories", "Code Snippets", "AI-Generated", "Smart Tags"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`exp-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* MAIN BOX */}
          <div className="exp-box-wrapper p-5">
            <div className="row">

              {/* LEFT SIDE */}
              <div className="col-lg-6">{leftContent[activeTab]}</div>

              {/* RIGHT SIDE */}
              <div className="col-lg-6 mt-4 mt-lg-0">{rightContent[activeTab]}</div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}
