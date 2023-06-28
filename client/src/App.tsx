import { Routes, Route, useNavigate } from "react-router";
import Activity from "./pages/Activity";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import SelectEmpresa from "./components/SelectEmpresa";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

function App() {
  const navigate = useNavigate()
  const selectEmpresa = useSelector<RootState>((state) => state.activities.selectEmpresa.id)

  useEffect(() => {
    navigate('/empresa/seleccionar')
  }, [])


  return (
    <>
    <NavBar/>
    <Routes>
				<Route path="/empresa/seleccionar" element={<SelectEmpresa />} />
				<Route path="/" element={<Home />} />
				<Route path="/activity/:id" element={<Activity />} />
		</Routes>
    </>
  );
}

export default App;
