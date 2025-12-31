import React from 'react';
import styles from './ContactSection.module.css';
// Using placeholders for icons

const ContactSection = () => {
  return (
    <section className={styles.contactContainer} id="contact">
      <h2 className={styles.mainTitle}>Get in Touch</h2>
      <p className={styles.subtitle}>
        Have questions or feedback? We'd love to hear from you.
      </p>

      <div className={styles.contentGrid}>
        
        {/* Left Column: Contact Form */}
        <div className={styles.formCard}>
          <form className={styles.contactForm}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your name" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="your@email.com" required />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" placeholder="Tell us what's on your mind..." required></textarea>

            <button type="submit" className={styles.sendButton}>
              <span role="img" aria-label="send">✉️</span> Send Message
            </button>
          </form>
        </div>

        {/* Right Column: Info Cards and FAQs */}
        <div className={styles.infoColumn}>
          
          {/* Email Us Card */}
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>✉️</div>
            <div className={styles.infoText}>
              <h4 className={styles.infoTitle}>Email Us</h4>
              <p className={styles.infoDetail}>Our team typically responds within 24 hours</p>
              <a href="mailto:support@checkmate.ai" className={styles.emailLink}>support@checkmate.ai</a>
            </div>
          </div>
          
          {/* Community Card */}
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>💬</div>
            <div className={styles.infoText}>
              <h4 className={styles.infoTitle}>Community</h4>
              <p className={styles.infoDetail}>Join our community to discuss fact-checking and misinformation</p>
              <a href="#forum" className={styles.forumLink}>Visit Community Forum</a>
            </div>
          </div>

          {/* FAQs Card */}
          <div className={styles.faqCard}>
            <h4 className={styles.infoTitle}>FAQs</h4>
            <ul className={styles.faqList}>
              <li>• How does the verification work?</li>
              <li>• Is my data stored or shared?</li>
              <li>• What's the accuracy rate?</li>
              <li>• Can I verify in bulk?</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;