import "../styles/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="copyright-footer">
      <img src="/pdmr.png" alt="PDMR" className="footer-logo" />
      <span>© {currentYear} PDMR, All Rights Reserved.</span>
    </footer>
  );
}

export default Footer;