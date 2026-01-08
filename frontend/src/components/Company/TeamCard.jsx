import { useState } from "react";

const BACKEND_URL = "http://localhost:8000";

export default function TeamCard({ member }) {
  const [hovered, setHovered] = useState(false);

  const hasHoverImage = Boolean(member.hover_image);

  const mainImage = member.image
    ? `${BACKEND_URL}${member.image}`
    : "";

  const hoverImage = member.hover_image
    ? `${BACKEND_URL}${member.hover_image}`
    : "";

  console.log(mainImage, " ", hoverImage);

  return (
    <div className="team-card">
      <div
        className="team-image-wrapper"
        onMouseEnter={() => hasHoverImage && setHovered(true)}
        onMouseLeave={() => hasHoverImage && setHovered(false)}
      >
        <img
          src={hovered && hasHoverImage ? hoverImage : mainImage}
          alt={member.name}
          className="team-image"
        />
      </div>

      <h4 className="team-name">{member.name}</h4>
      <p className="team-role">{member.role}</p>
    </div>
  );
}
