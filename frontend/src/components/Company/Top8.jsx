import { useEffect, useState } from "react";
import api from "../../api/axios";
import TeamCard from "./TeamCard";

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("team/members/")
      .then((res) => {
        setTeamMembers(res.data);
      })
      .catch((err) => {
        console.error("Team API error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!teamMembers.length) return null;

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
