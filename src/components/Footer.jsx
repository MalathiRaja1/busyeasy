import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>BuyEasy</h4>
          <Link to="/about-us">About Us</Link>
          <Link to="/contact-us">Contact Us</Link>
        </div>
        <div className="footer-column">
          <h4>Policies</h4>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund & Return Policy</Link>
        </div>
      </div>
      <p className="footer-copyright">© 2026 BuyEasy. All rights reserved.</p>
    </footer>
  );
}

export default Footer;