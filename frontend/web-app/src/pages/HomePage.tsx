import { useEffect, useState } from "react";
import Dropzone from "../components/dropzone-components/Dropzone";
import Button from "../components/button-components";
import TransactionTable from "../components/table-components/TransactionTable";
import Navbar from "../components/navbar-components/Navbar";
import Footer from "../components/footer-components/Footer";
import "./HomePage.css";

interface Transaction {
    routingNumber: string;
    accountNumber: string;
    amount: number;
    individualName: string;
    traceNumber: string;
}

const HomePage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShowContent(true);
                }
            },
            { threshold: 0.3 } // Trigger animation when 30% of the section is visible
        );

        const contentSection = document.querySelector(".content-container");
        if (contentSection) {
            observer.observe(contentSection);
        }

        return () => {
            if (contentSection) {
                observer.unobserve(contentSection);
            }
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="hero-section">
                <h1 className="hero-title">Advanced ACH Processor</h1>
                <p className="hero-subtitle">Seamless, Fast, and Secure ACH File Processing</p>
                <div className="scroll-indicator" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
                    ↓ Scroll Down ↓
                </div>
            </div>
            <div className={`content-container ${showContent ? "visible" : ""}`}>
                <h2>Upload ACH File</h2>
                <Dropzone onFileParsed={setTransactions} />
                <TransactionTable transactions={transactions} />
                <Button />
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
