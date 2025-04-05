import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/HomePage";
import About from "./pages/About/About"
import Contact from "./pages/Contact/Contact"
import Blog from "./pages/Blog/Blog"
import Layout from "./layouts/Layout";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;
