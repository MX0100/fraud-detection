import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/navbar-components/Navbar";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* add other pages*/}
            </Routes>
        </Router>
    );
}

export default App;
