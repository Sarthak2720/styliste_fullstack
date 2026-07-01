import Navbar from "./Navbar";
import { FloatingAppointmentButton } from "../../pages/public/FloatingAppointmentButton";
// import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { WhatsAppButton } from "../../pages/public/WhatsAppButton";

// type Props = {
//   children: React.ReactNode;
// };

const MainLayout = () => {
  return (
    <>
      <Navbar />

      {/* All pages render here */}
      <Outlet />

      {/* Floating button on EVERY page */}
      <FloatingAppointmentButton />
      <WhatsAppButton />

      <Footer />
    </>
  );
};

export default MainLayout;

