import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InvoiceAssignment } from "@/pages/InvoiceAssignment";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceAssignment />} />
      </Routes>
    </Router>
  );
}

export default App;
