import Navbar from "../components/navbar-components/Navbar";
import Footer from "../components/footer-components/Footer";
import "./Layout.css"
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <main className="page-wrapper">{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
