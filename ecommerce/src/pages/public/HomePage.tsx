import Navbar from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Hero } from '../../components/home/Hero';
// import { Categories } from '../../components/home/Categories';
// import { FeaturedProducts } from "../../components/home/FeaturedProducts";
// import { Newsletter } from "../../components/home/Newsletter";
import { AwardsSection } from '../../components/home/AwardsSection';
import { AboutIntro } from '../../components/home/AboutIntro';
import { TestimonialsSection } from '../../components/home/TestimonialsSection';
// import { WhyChooseUs } from '../../components/home/WhyChooseUs';
import { WhyStyliste } from '../../components/home/WhyStyliste';
import { FeaturedProducts } from '../../components/home/FeaturedProducts copy';
import { ServicesSection } from '../../components/home/ServiceSection';
import { HowItWorksSection } from '../../components/home/HowItWorksSection';
import { BookAppointmentSection } from '../../components/home/BookAppointmentSection';
import { StatsSection } from '../../components/home/StatsSection';
import { FAQSection } from '../../components/home/FAQSection';
import { Helmet } from "react-helmet-async";


const HomePage = () => {
  return (
    <div className="min-h-screen w-full">
       {/* ✅ SEO START */}
      <Helmet>
        <title>Custom Fashion Boutique in Thane | Styliste Couturier</title>
        <meta
          name="description"
          content="Premium custom stitching, bridal wear, and doorstep tailoring in Thane. Perfect fit, designer finish, and personalized fashion consultations."
        />
      </Helmet>
      {/* ✅ SEO END */}
      <Navbar />
      <Hero />
      <AwardsSection />
      <AboutIntro />
      <StatsSection />
      {/* <WhyChooseUs /> */}
      <WhyStyliste />
      <FeaturedProducts />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <BookAppointmentSection />
      {/* <Categories /> */}
      {/* <FeaturedProducts /> */}
      {/* <Newsletter /> */}
      <Footer />
    </div>
  );
};

export default HomePage;