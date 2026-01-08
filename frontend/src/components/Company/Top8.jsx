import grpPhoto from "../../assets/grp_photo.jpg";
import hoverPhoto from "../../assets/your-illustration.png";

const teamMembers = [
  {
    id: 1,
    name: "Viktor Kardos",
    role: "CRO Expert",
    image: grpPhoto,
    hoverImage: hoverPhoto, // agar nahi ho toh null
  },
  {
    id: 2,
    name: "Laszlo Szotak",
    role: "CRO Expert",
    image: grpPhoto,
    hoverImage: null, // hover disable automatically
  },
];

import TeamCard from "./TeamCard";

export default function TeamSection() {
  return (
    <section className="team-section bg-white">
      <h2 className="team-title">Our team</h2>
      <p className="team-subtitle">
        Working around the clock to make personalization possible for every
        ecommerce entrepreneur
      </p>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
