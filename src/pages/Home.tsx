import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import HistorySection from '../components/home/HistorySection';
import ServicesSection from '../components/home/ServicesSection';
import StatisticsSection from '../components/home/StatisticsSections';
import WeatherMapSection from '../components/home/WeatherMapSection';
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
      <main className="grow">
        <Hero />
        <ServicesSection />
        <GovernmentActivitySection />
        <StatisticsSection />
        <WeatherMapSection />
        <HistorySection />
      </main>
    </>
  );
};

export default Home;
