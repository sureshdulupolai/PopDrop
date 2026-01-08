import { HeroSectionCompany } from "./Top1";
import { IllustrationDivider } from "./Top2";
import { WhoWeAre } from "./Top3";
import { CompanyStats } from "./Top4";
import { CompanyStory } from "./Top5";
import { LifeAtCompany } from "./Top6";
import OurValues from "./Top7";
import TeamSection from "./Top8";
import CpmJoinTeamSection from "./Top9";
import "./Company.css";

function AppCompany() {
    return (
        <>
        <HeroSectionCompany />
        <IllustrationDivider />
        <WhoWeAre />
        <CompanyStats />
        <CompanyStory />
        <LifeAtCompany />
        <OurValues />
        <TeamSection />
        <CpmJoinTeamSection />
        </>
    )
}

export default AppCompany;