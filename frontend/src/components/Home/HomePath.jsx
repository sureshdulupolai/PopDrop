import Showcase from "./Showcase";
import TrustSection from './TrustSection';
import EditorShowcase from './EditorShowcase';
import PopdropExperience from './PopdropExperience';
import FeatureSection from './FeatureSection';
import PremiumSection from './PremiumSection';
import ReviewSlider from './ReviewSlider';

function HomePageHere({ isLoggedIn }) {
  return (
    <>
      <Showcase />
      <TrustSection />
      <EditorShowcase />
      <PopdropExperience />
      <FeatureSection />
      <PremiumSection isLoggedIn={isLoggedIn} />
      <ReviewSlider />
    </>
  )
}

export default HomePageHere;
