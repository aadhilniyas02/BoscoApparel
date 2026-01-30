import Image from "next/image";
import Hero from "./componenets/Hero";
// import Newest from "./components/Newest";
import Newest from "./componenets/Newest";
// import Footer from "./components/Footer";
import Footer from "./componenets/Footer";
import TopNavBar from "./componenets/TopNavBar";
import CosmeticCategories from "./componenets/Categories";
import AboutUs from "./componenets/AboutUs";
import ContactUs from "./componenets/ContactUs";
import TopRankedProducts from "./componenets/TopRankedProducts";
import UserLayout from "./componenets/UserLayout";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <UserLayout>
      <div className="bg-white">
        <Hero />
        {/* <div className="max-w-[1400px] w-[95%] mx-auto"> */}
        <div>
          <Newest />
          {/* <TopRankedProducts /> */}
          <CosmeticCategories />
        </div>
        {/* <AboutUs /> */}
        {/* <ContactUs />   */}
      </div>
    </UserLayout>
  );
}
