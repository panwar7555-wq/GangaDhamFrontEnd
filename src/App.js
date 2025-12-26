import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./Pages/UserPage.js";
import AddUserPage from "./Pages/AddUserPage";
import TransactionsPage from "./Pages/TransactionsPage.js";
import EditUserPage from "./Pages/EditUserPage.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/add" element={<AddUserPage />} />
        <Route path="/transactions/:id" element={<TransactionsPage />} />
        <Route path="/edit/:id" element={<EditUserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
