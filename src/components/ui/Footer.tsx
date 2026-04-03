import "../../assets/styles/Footer.css";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer_inner">
          <p className="footer_copy">
            © 2025 <span>WebLens</span>. Built with Aindrila Mukherjee.
          </p>
          <nav className="footer__links">
            {["Privacy", "Terms", "Contact", "GitHub"].map((l) => (
              <button key={l} className="footer_link">
                {l}
              </button>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
};
export default Footer;
