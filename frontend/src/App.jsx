import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Callback from "./pages/Callback/Callback";
import Feed from "./pages/Feed/Feed";
import Messages from "./pages/Messages/Messages";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Layout from "./components/Layout";
import Followers from "./pages/Followers/Followers";
import Notifications from "./pages/Notifications/Notifications";

function App() 
{
  return (
    <BrowserRouter>
      <Routes>
		{/*ROUTE SANS NAVBAR */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/callback" element={<Callback />} />

		{/*ROUTE AVEC NAVBAR*/}
		<Route path="/feed" element={<Layout><Feed /></Layout>} />
		<Route path="/messages" element={<Layout><Messages /></Layout>}  />
		<Route path="/notifications" element={<Layout><Notifications /></Layout>}  />
		<Route path="/profile" element={<Layout><Profile /></Layout>} />
		<Route path="/settings" element={<Layout><Settings /></Layout>} />
		<Route path="/followers" element={<Layout><Followers /></Layout>} />

		{/*REDIRECTION PAR DEFAUT*/}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
