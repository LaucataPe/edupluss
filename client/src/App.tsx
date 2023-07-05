import { Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";

import Activity from "./pages/Activity";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import SelectEmpresa from "./components/SelectEmpresa";
import AddStep from "./components/AddStep";
import AddActivity from "./components/AddActivity";

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const empresa = window.localStorage.getItem("empresa");
    if(empresa){
      navigate('/')
    }else{
      navigate('/empresa/seleccionar')
    }
   
  }, [])


  return (
    <>
    
    <NavBar/>
    <Routes>
				<Route path="/empresa/seleccionar" element={<SelectEmpresa />} />
				<Route path="/" element={<Home />} />
				<Route path="/activity/:id" element={<Activity />} />
		</Routes>
    <Routes>
				<Route path="/addActivity" element={<AddActivity />} />
				<Route path="/addStep" element={<AddStep />} />
		</Routes>
    </>
  );
}

export default App;
