import { useState, useEffect } from "react";
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
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowContent(true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🛠️ 提交交易到后端 API
    const handleSubmit = async () => {
        if (transactions.length === 0) {
            alert("No transactions to submit.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/transactions/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactions),
                credentials: "include",
            });

            const result = await response.text();
            alert(`Server Response: ${result}`);
        } catch (error) {
            console.error("Error sending transactions:", error);
            alert("Failed to send transactions.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="hero-section">
                <h1 className="hero-title">Advanced ACH Processor</h1>
                <p className="hero-subtitle">Seamless, Fast, and Secure ACH File Processing</p>
                <div className="scroll-indicator">↓ Scroll Down ↓</div>
            </div>
            <div className={`content-container ${showContent ? "visible" : ""}`}>
                <h2>Upload ACH File</h2>
                <Dropzone onFileParsed={setTransactions} />
                <TransactionTable transactions={transactions} />
                <Button onClick={handleSubmit} label="Submit Transactions" />
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
