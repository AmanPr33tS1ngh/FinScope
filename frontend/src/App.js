import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Calendar from "./pages/calendar/Calendar";
import MarketCap from "./pages/market-cap/MarketCap";
import AnalystEstimate from "./pages/analyst-estimate/AnalystEstimate";
import Constituent from "./pages/constituent/Constituent";
import IntraDay from "./pages/intra-day/IntraDay";
import SentimentAnalysis from "./pages/sentiment-analysis/SentimentAnalysis";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/analyst-estimate/:ticker" element={<AnalystEstimate />} />
        <Route path="/analyst-estimate" element={<AnalystEstimate />} />
        <Route path="/market-cap/:ticker" element={<MarketCap />} />
        <Route path="/market-cap" element={<MarketCap />} />
        <Route path="/calendar/:calendarType" element={<Calendar />} />
        <Route path="/" element={<Constituent />} />
        <Route path="/constituent/:slug" element={<Constituent />} />
        <Route path="/intra-day" element={<IntraDay />} />
        <Route path="/intra-day/:ticker" element={<IntraDay />} />
        <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
