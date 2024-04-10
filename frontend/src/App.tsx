import "./App.css";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <h1 className="font-bold text-4xl">Quizy</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis quas
        enim id nulla temporibus deserunt ea possimus? Odio, iusto consequuntur!
      </p>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
