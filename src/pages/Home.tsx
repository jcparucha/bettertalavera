import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import HistorySection from '../components/home/HistorySection';
import ServicesSection from '../components/home/ServicesSection';
import Hero from '../components/sections/Hero';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Official website of your local government. Access government services, information, and resources."
        keywords="government, local government, services, public services, civic services"
      />
      <main className="flex-grow">
        <Hero />
        <ServicesSection />
        <GovernmentActivitySection />
        <HistorySection />
      </main>
    </>
  );
};

export default Home;
