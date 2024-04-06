import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import Calendar from "./pages/calendar/Calendar";
import MarketCap from "./pages/market-cap/MarketCap";
import AnalystEstimate from "./pages/analyst-estimate/AnalystEstimate";
import Constituent from "./pages/constituent/Constituent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/analyst-estimate" element={<AnalystEstimate />} />
        <Route path="/market-cap/:ticker" element={<MarketCap />} />
        <Route path="/market-cap" element={<MarketCap />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/" element={<Constituent />} />
        <Route path="/constituent/:slug" element={<Constituent />} />
      </Routes>
    </Router>
  );
}

export default App;
