import Showcase from "./Showcase";
import TrustSection from './TrustSection';
import EditorShowcase from './EditorShowcase';
import PopdropExperience from './PopdropExperience';
import FeatureSection from './FeatureSection';
import PremiumSection from './PremiumSection';
import ReviewSlider from './ReviewSlider';
import Snowfall from "react-snowfall";

function HomePageHere({ isLoggedIn }) {
  return (
    <>
      <Snowfall color="#82C3D9" />
      <Showcase />
      <TrustSection />
      <EditorShowcase />
      <PopdropExperience />
      <FeatureSection />
      <PremiumSection isLoggedIn={isLoggedIn} />
      {isLoggedIn && <ReviewSlider isLoggedIn={isLoggedIn} />}
    </>
  )
}

export default HomePageHere;
