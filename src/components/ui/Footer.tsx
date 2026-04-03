import "../../assets/styles/Footer.css";
const Footer = () => {
  const footerLinks = [
    {
      label: "GitHub",
      url: "https://github.com/aindm98/website-summariser-web-app",
    },
  ];

  return (
    <>
      <footer className="footer">
        <div className="footer_inner">
          <p className="footer_copy">
            © 2025 <span>WebLens</span>. Built by Aindrila Mukherjee.
          </p>
          <nav className="footer_links">
            {footerLinks.map((item) => (
              <a
                key={item.label}
                href={item.url}
                className="footer_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
};
export default Footer;
