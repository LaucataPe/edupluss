import { Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";

import Activity from "./pages/Activity";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
//import SelectEmpresa from "./components/SelectEmpresa";
import AddStep from "./components/admin/AddStep";
import AddActivity from "./components/admin/AddActivity";
import ActivitySteps from "./components/admin/ActivitySteps";
import Login from "./components/Login";
import Landing from "./pages/LandingPage";
import Admin from "./components/admin/Admin";
import AdminActivities from "./components/admin/AdminActivities";
import AddArea from "./components/admin/AddArea";

function App() {

  return (
    <>
    <NavBar/>
    <Routes>
				{/* <Route path="/empresa/seleccionar" element={<SelectEmpresa />} /> */}
				<Route path="/" element={<Landing />} />
				<Route path="/home" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/activity/:id" element={<Activity />} />
        		<Route path="/admin" element={<Admin />} />
        		<Route path="/activities" element={<AdminActivities />} />
				<Route path="/actvitySteps/:id" element={<ActivitySteps />} />
				<Route path="/addActivity" element={<AddActivity />} />
				<Route path="/addArea" element={<AddArea />} />
				<Route path="/addStep/:id" element={<AddStep />} />
		</Routes>
    </>
  );
}

export default App;

