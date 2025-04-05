// src/pages/AboutPage.tsx
import { useEffect, useState } from "react";
import "./About.css";

const AboutPage = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <div className={`about-hero ${visible ? "fade-in" : ""}`}>
                <h1>About Our Mission</h1>
                <p>Innovating Secure ACH Processing with Intelligence</p>
            </div>
            <div className={`about-content ${visible ? "slide-up" : ""}`}>
                <section className="about-section">
                    <h2>Who We Are</h2>
                    <p>
                        We are a team of passionate developers and engineers led by <strong>Wenkai Wang</strong>, a top-ranked M.A.Sc. student in Computer Engineering at Memorial University. With experience in full-stack development, AI, and cloud computing, our team is committed to transforming financial security.
                    </p>
                </section>

                <section className="about-section alt">
                    <h2>Our Vision</h2>
                    <p>
                        To empower banks and financial institutions with cutting-edge tools that detect and prevent fraudulent ACH transactions in real time, leveraging RabbitMQ, Spring Boot, and AI.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Technologies We Love</h2>
                    <ul>
                        <li>Spring Boot + RabbitMQ + PostgreSQL</li>
                        <li>React + TypeScript</li>
                        <li>Docker + AWS Deployment</li>
                        <li>XGBoost + Rule-Based Fraud Detection</li>
                    </ul>
                </section>
            </div>
        </>
    );
};

export default AboutPage;
