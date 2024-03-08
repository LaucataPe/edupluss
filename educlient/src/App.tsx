import { Routes, Route } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import Activity from "./pages/Activity";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import AddStep from "./components/admin/AddStep";
import AddActivity from "./components/admin/AddActivity";
import ActivitySteps from "./components/admin/ActivitySteps";
import Login from "./components/Login";
import Landing from "./pages/LandingPage";
import Admin from "./components/admin/Admin";
import AdminActivities from "./components/admin/AdminActivities";
import AddArea from "./components/admin/AddArea";
import Crud from "./components/admin/Crud";
import AddRole from "./components/admin/AddRole";
//import AppMenu from "./components/SideMenu";
import { useSelector } from "react-redux";

import "./index.css";

import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./styles/layout/layout.scss";
import { useAppDispatch } from "./hooks/typedSelectors";
import { setLogUser } from "./redux/features/userSlice";
import { setEmpresa } from "./redux/features/activitiesSlice";
import { RootState } from "./redux/store";
import { fetchCompanyAreas } from "./redux/features/areaSlice";
import Progress from "./pages/Progress";
import Dashboard from "./pages/Dashboard";
import Checkpoint from "./components/Checkpoint";
import SuperAdminHome from "./components/superAdmin/SuperAdminHome";
import UserByCompany from "./components/superAdmin/UsersByCompany";
import { AxiosInterceptor } from "./utils/interceptors/axiosInterceptor";
import { useState } from "react";
import UserProfile from "./pages/UserProfile";
import EvaluationList from "./pages/EvaluationList";
import ListEmployeesQualifications from "./pages/ListEmployeesQualifications/ListEmployeesQualifications";
import Sidebar from "./components/Sidebar";
import AreaRoles from "./components/admin/AreaRoles";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isDarkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);

    // Obtén el elemento <link> de la hoja de estilo
    const themeLink = document.getElementById("theme-css");

    if (themeLink) {
      // Cambia la ruta del archivo CSS en función del modo seleccionado
      const themePath = isDarkMode
        ? "/public/dark/theme.css"
        : "/public/tailwind-light/theme.css";
      themeLink.setAttribute("href", themePath);
    }
  };

  const logUser = useSelector((state: RootState) => state.user.logUser);
  const currentEmpresa = useSelector(
    (state: RootState) => state.user.logUser.companyId
  );
  /*const enableSideBar = useSelector(
    (state: RootState) => state.utils.handleSideBar
  );*/

  const [tokenValid, setTokenValid] = useState<Boolean>(false);

  const session = window.localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${session}`,
  };

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/login" && !session) {
      navigate("/");
    }
    if (pathname === "/login" && tokenValid) {
      navigate("/home");
    }
    if (pathname === "/home" && logUser.tipo === "admin") {
      navigate("/crud");
    }
    if (pathname === "/home" && logUser.tipo === "superadmin") {
      navigate("/main");
    }
  }, [pathname]);

  useEffect(() => {
    if (session) {
      axios
        .get(`http://localhost:3001/auth/token`, { headers })
        .then((response) => {
          console.log(headers, response)
          if (response.data) {        
            if (response.data.user?.tipo === "superadmin") {
              dispatch(setLogUser(response.data.user));
              setTokenValid(true);
            } else {           
              dispatch(setLogUser(response.data.data.user));
              dispatch(setEmpresa(response.data.findCompany));
              setTokenValid(true);
            }  
          }
        })

        .catch((error) => {
          //? mejorar este error
          console.log(error);
        });
    }
  }, [dispatch, session]);

  useEffect(() => {
    if (currentEmpresa) {
      dispatch(fetchCompanyAreas(currentEmpresa));
    }
  }, [currentEmpresa]);

  const pathAvailable = pathname !== "/" && pathname !== "/login";

  AxiosInterceptor();

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      {pathAvailable && (
        <NavBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}  />
      )}
      <div className="flex w-[100%]">
        {pathAvailable && (logUser?.tipo === "admin" || logUser?.tipo === "superadmin") && (
          <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        )}

        <div className={`w-full ${pathAvailable ? "mt-16" : ""}`}>
          <Routes>
            {/* <Route path="/empresa/seleccionar" element={<SelectEmpresa />} /> */}
            <Route path="/" element={<Landing />} />{" "}
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activity/:id" element={<Activity />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/areas" element={<Admin />} />
            <Route path="/areas/:areaId" element={<AreaRoles />} />
            <Route path="/activities/:roleId" element={<AdminActivities />} />
            <Route path="/actvitySteps/:id" element={<ActivitySteps />} />
            <Route
              path="/addActivity/:roleId/:orderId"
              element={<AddActivity />}
            />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route
              path="/editActivity/:roleId/:actId"
              element={<AddActivity />}
            />
            <Route path="/addArea" element={<AddArea />} />
            <Route path="/editArea/:areaId" element={<AddArea />} />
            <Route path="/addRole/:areaId" element={<AddRole />} />
            <Route path="/editRole/:areaId/:roleId" element={<AddRole />} />
            <Route path="/addStep/:id" element={<AddStep />} />
            <Route path="/editStep/:id/:stepId" element={<AddStep />} />
            <Route path="/crud" element={<Crud />} />
            <Route path="/main" element={<SuperAdminHome />} />
            <Route path="/allusers" element={<UserByCompany />} />
            <Route path="/evaluationsList" element={<EvaluationList />} />
            <Route
              path="/employees/qualifications/:activityId"
              element={<ListEmployeesQualifications />}
            />
            <Route path="/checkpoint/:id" element={<Checkpoint />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
