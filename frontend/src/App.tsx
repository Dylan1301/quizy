import { Button } from "@chakra-ui/react";
import "./App.css";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <h1 className="font-bold text-4xl">Quizy</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis
          quas enim id nulla temporibus deserunt ea possimus? Odio, iusto
          consequuntur!
        </p>
        <Link to="/">
          <Button className="mb-4 mx-4">Go to Home page</Button>
        </Link>
        <Link to="/users">
          <Button className="mb-4" variant={"outline"}>
            Go to Users page
          </Button>
        </Link>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
