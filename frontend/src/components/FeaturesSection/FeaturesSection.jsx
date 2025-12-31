import React from 'react';
import styles from './FeaturesSection.module.css';
// You'll need an icon library like 'react-icons' for actual icons, 
// or use placeholders. I'll use simple text/emoji placeholders.

const featuresData = [
  { icon: '🛡️', title: 'AI-Powered Detection', description: 'Advanced machine learning models analyze content patterns to identify misinformation.' },
  { icon: '⚡', title: 'Instant Results', description: 'Get verification results in under 2 seconds with our optimized processing pipeline.' },
  { icon: '🌐', title: 'Multi-Source Analysis', description: 'Cross-reference information across hundreds of trusted fact-checking databases.' },
  { icon: '🧠', title: 'Deep Learning', description: 'Neural networks trained on millions of verified and fake news articles.' },
  { icon: '🔒', title: 'Privacy First', description: 'Your data is never stored or shared. All processing happens securely and privately.' },
  { icon: '✅', title: 'High Accuracy', description: '98% accuracy rate backed by continuous learning and model improvements.' },
];

const FeaturesSection = () => {
  return (
    <section className={styles.featuresContainer} id="features">
      <h2 className={styles.mainTitle}>Powerful Features</h2>
      <p className={styles.subtitle}>
        Built with cutting-edge AI technology to combat misinformation effectively
      </p>

      <div className={styles.grid}>
        {featuresData.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.icon}>{feature.icon}</div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;