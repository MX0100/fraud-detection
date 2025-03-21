import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <p>© {new Date().getFullYear()} ACH Processor. All Rights Reserved.</p>
                </div>
                <div className="footer-center">
                    <ul>
                        <li><a href="/terms">Terms of Use</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/security">Security</a></li>
                    </ul>
                </div>
                <div className="footer-right">
                    <div id="google_translate_element"></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
