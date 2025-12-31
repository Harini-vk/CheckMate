import React from 'react';
import styles from './AboutSection.module.css';

const commitmentData = [
  { 
    icon: '🎯', 
    title: 'Accuracy', 
    description: 'We continuously train our models on verified datasets to maintain industry-leading accuracy rates.' 
  },
  { 
    icon: '👥', 
    title: 'Accessibility', 
    description: 'Our platform is designed to be user-friendly and accessible to everyone, regardless of technical expertise.' 
  },
  { 
    icon: '⚖️', 
    title: 'Trust', 
    description: 'Transparency and privacy are at our core. We never store your data and always show our confidence levels.' 
  },
];

const AboutSection = () => {
  return (
    <section className={styles.aboutContainer} id="about">
      <h2 className={styles.mainTitle}>About CHECKMATE</h2>
      <p className={styles.subtitle}>
        Empowering people with the tools to verify information and combat misinformation in the digital age
      </p>

      {/* Mission Card */}
      <div className={styles.missionCard}>
        <h3 className={styles.missionTitle}>Our Mission</h3>
        <p className={styles.missionText}>
          In an era where misinformation spreads faster than facts, CHECKMATE stands as your defense against fake news. We believe 
          everyone deserves access to truth and the tools to verify it. Our AI-powered platform analyzes content across multiple dimensions
          —linguistic patterns, source credibility, metadata, and cross-references—to provide you with reliable verification results.
        </p>
        <p className={styles.missionText}>
          Built by a team of data scientists, journalists, and engineers, CHECKMATE combines cutting-edge machine learning with traditional 
          fact-checking methodologies to create a comprehensive verification system that's both powerful and accessible.
        </p>
      </div>

      {/* Commitments Grid */}
      <div className={styles.commitmentGrid}>
        {commitmentData.map((item, index) => (
          <div key={index} className={styles.commitmentCard}>
            <div className={styles.icon}>{item.icon}</div>
            <h4 className={styles.cardTitle}>{item.title}</h4>
            <p className={styles.cardDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;