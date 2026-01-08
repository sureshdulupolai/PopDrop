import { useState } from "react";

export default function TeamCard({ member }) {
  const [hovered, setHovered] = useState(false);

  const hasHoverImage = !!member.hoverImage;

  return (
    <div className="team-card">
      <div
        className="team-image-wrapper"
        onMouseEnter={() => hasHoverImage && setHovered(true)}
        onMouseLeave={() => hasHoverImage && setHovered(false)}
      >
        <img
          src={
            hovered && hasHoverImage
              ? member.hoverImage
              : member.image
          }
          alt={member.name}
          className="team-image"
        />
      </div>

      <h4 className="team-name">{member.name}</h4>
      <p className="team-role">{member.role}</p>
    </div>
  );
}
