import Header from "../components/ui/Header";
import AmbientOrbs from "../components/ui/AmbientOrbs";
import HeroSection from "../components/ui/HeroSection";
import "../assets/styles/Home.css";
import Footer from "../components/ui/Footer";
import SummaryCard from "../components/ui/SummaryCard";

const Home = () => {
  return (
    <>
     
     <div className="website-container">
         <Header />
      <AmbientOrbs
        style={{
          width: 320,
          height: 320,
          top: "8%",
          left: "-6%",
          animation: "float 7s ease-in-out infinite",
        }}
      />
      <AmbientOrbs
        style={{
          width: 260,
          height: 260,
          bottom: "12%",
          right: "-4%",
          animation: "float 9s 1.5s ease-in-out infinite",
        }}
      />
      <AmbientOrbs
        style={{
          width: 180,
          height: 180,
          top: "38%",
          right: "10%",
          animation: "pulse 6s 0.8s ease-in-out infinite",
        }}
      />
      <AmbientOrbs
        style={{
          width: 140,
          height: 140,
          bottom: "30%",
          left: "8%",
          animation: "pulse 8s 2s ease-in-out infinite",
        }}
      />
      <div className="hero-section">
         <HeroSection />
        
      </div>
       <SummaryCard />
      <Footer />
    </div>
    </>
  );
};

export default Home;
