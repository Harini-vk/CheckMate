import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const stats = [
    { value: '92.2%', label: 'Accuracy' },
    { value: '45+', label: 'Verified' },
    { value: '<5s', label: 'Response' },
  ];

  return (
    <section className={styles.heroContainer}>
      <div className={styles.contentOverlay}>
        <h1 className={styles.mainHeading}>Verify News in <br /> Seconds</h1>
        <p className={styles.subText}>
          Combat misinformation with AI-powered fact-checking. Upload text, images, or audio to instantly verify authenticity.
        </p>

        <div className={styles.buttonGroup}>
          <button
  className={styles.btnDark}
  onClick={() => {
    document
      .getElementById("content-verifier")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Start Verification
</button>

<button
  className={styles.btnLight}
  onClick={() => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Learn More
</button>

        </div>

        <div className={styles.statsGroup}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <h2 className={styles.statValue}>{stat.value}</h2>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;