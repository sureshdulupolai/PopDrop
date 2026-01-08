import { useState } from "react";

const values = [
  {
    key: "A",
    title: "Always keep improving",
    desc: "Learning never ends, so keep studying, exploring, and discovering. As Aristotle said, \"the more you know, the more you realize you don’t know.\"",
  },
  {
    key: "W",
    title: "Wow your customer",
    desc: "Constantly strive to deliver the best product for our customers with the highest level of service. Make every customer interaction positive and memorable.",
  },
  {
    key: "E",
    title: "Experiment",
    desc: "Look at every idea, project or initiative with an open mind. Don’t be afraid to try new things, and seek better solutions.",
  },
  {
    key: "S",
    title: "Sweep the floor",
    desc: "Never feel that any work is beneath you. Be humble and modest, let your actions speak for you.",
  },
  {
    key: "O",
    title: "Owner mentality",
    desc: "Take a proactive approach to making things better. If you find a mistake, fix it – even if it’s not your job.",
  },
  {
    key: "M",
    title: "Mutual respect",
    desc: "We don’t tolerate bullies. Be fair to others and give them the same respect you would ask for yourself.",
  },
  {
    key: "E",
    title: "Enjoy the game",
    desc: "Work and fun don’t have to be mutually exclusive. Build a happy workplace where we can all be ourselves.",
  },
];

export default function OurValues() {
  const [active, setActive] = useState(0);

  return (
    <div className="our-values-section">
      {/* Heading */}
      <div className="text-center">
        <h2 className="fw-bold">Our values</h2>
        <p className="text-muted">Guiding our decisions and keeping us…</p>
      </div>

      {/* Circles */}
      <div className="values-circles">
        {values.map((item, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`value-circle ${active === index ? "active" : ""}`}
          >
            {item.key}
          </button>
        ))}
      </div>

      {/* Content Box */}
      <div className="row justify-content-center">
        <div className="col-lg-9 col-md-11">
          <div className="value-content-box">
            {/* Zig Zag */}
            <div className="value-zigzag" />

            <h3 className="fw-bold mb-3">
              <span className="value-key">
                {values[active].key}
              </span>
              <span>{values[active].title.slice(1)}</span>
            </h3>

            <p className="text-muted fs-6">
              {values[active].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
