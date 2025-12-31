import React from 'react';
import './Footer.css'; // Import the dedicated CSS

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-section footer-section--about">
                    <h3>CHECKMATE AI</h3>
                    <p>Advanced Content Verification System powered by proprietary ML models and Google Gemini API. Committed to combating misinformation across text, image, URL, and audio.</p>
                </div>
                <div className="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li>Text Claim Analysis</li>
                        <li>Deepfake Image Detection</li>
                        <li>URL Source Validation</li>
                        <li>Audio Transcription & Verification</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#faq">FAQ</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer-section footer-section--contact">
                    <h4>Connect</h4>
                    <p>Email: <a href="mailto:support@checkmate.ai">support@checkmate.ai</a></p>
                    <div className="social-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} CHECKMATE AI. All rights reserved. | Built with React & Gemini.</p>
            </div>
        </footer>
    );
};

export default Footer;