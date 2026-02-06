import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Feed from "./pages/Feed/Feed";
import Messages from "./pages/Messages/Messages";
import Profile from "./pages/Profile/Profile";
import Layout from "./components/Layout";

function App() 
{
  return (
    <BrowserRouter>
      <Routes>
		{/*ROUTE SANS NAVBAR */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

		{/*ROUTE AVEC NAVBAR*/}
		<Route path="/feed" element={<Layout />} />
		<Route path="/messages" element={<Layout />} />
		<Route path="/profile" element={<Layout />} />

		{/*REDIRECTION PAR DEFAUT*/}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
