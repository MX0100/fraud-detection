import "./Blog.css";

const ContactPage = () => {
    return (
        <div className="contact-container">
            <h1>Contact Me</h1>
            <p>If you'd like to get in touch, feel free to reach out through any of the methods below.</p>
            <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:lucaswang0402@gmail.com">lucaswang0402@gmail.com</a></p>
                <p><strong>Location:</strong> St. John's, Newfoundland and Labrador</p>
                <p><strong>Available:</strong> Mon–Fri, 9:00 AM – 5:00 PM</p>
                <p><strong>GitHub:</strong> <a href="https://github.com/MX0100" target="_blank">github.com/MX0100</a></p>
                <p><strong>Blog:</strong> <a href="https://mx0100.github.io/blog" target="_blank">mx0100.github.io/blog</a></p>
            </div>
        </div>
    );
};

export default ContactPage;
