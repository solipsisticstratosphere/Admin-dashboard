// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../../pages/LoginPage/LoginPage";

// This would be your actual home page component
const HomePage = () => {
  return <div>Home Page / Admin Dashboard</div>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
``;
