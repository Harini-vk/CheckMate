import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("features");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const sections = ["features", "about", "contact", "content-verifier"];
      for (let sec of sections) {
        const el = document.getElementById(sec);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          setActiveSection(sec);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <span className={styles.checkmark}></span> CHECKMATE
      </div>

      <nav className={styles.navLinksContainer}>
        <a
          className={`${styles.navLink} ${activeSection === "features" ? styles.activeLink : ""}`}
          onClick={() => handleClick("features")}
        >
          Features
        </a>

        <a
          className={`${styles.navLink} ${activeSection === "about" ? styles.activeLink : ""}`}
          onClick={() => handleClick("about")}
        >
          About
        </a>

        <a
          className={`${styles.navLink} ${activeSection === "contact" ? styles.activeLink : ""}`}
          onClick={() => handleClick("contact")}
        >
          Contact
        </a>

        <button
          className={styles.tryNowButton}
          onClick={() => handleClick("content-verifier")}
        >
          Try Now
        </button>
      </nav>
    </header>
  );
};

export default NavBar;
