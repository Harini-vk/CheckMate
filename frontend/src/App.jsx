import React from 'react';
import './styles.css'; 

// Component Imports
import NavBar from './components/NavBar/NavBar';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import AboutSection from './components/AboutSection/AboutSection';
import ContactSection from './components/ContactSection/ContactSection';
import Footer from './components/footer/footer';
import ContentVerifier from "./components/ContentVerifier/ContentVerifier";

function App() {
  return (
    <div className="App-container">
      <NavBar />
      <HeroSection />
      {/* Use the correct component here */}
      <ContentVerifier /> 
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
