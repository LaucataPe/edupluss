import { Routes, Route } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
import Crud from "./components/admin/Crud";
import AddRole from "./components/admin/AddRole";
import AppMenu from "./components/SideMenu";
import { useSelector } from "react-redux";

import "./index.css";
import "../public/tailwind-light/theme.css";

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
import EvaluationList from "./pages/EvaluationList";
import ListEmployeesQualifications from "./pages/ListEmployeesQualifications";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logUser = useSelector((state: RootState) => state.user.logUser);
  const currentEmpresa = useSelector(
    (state: RootState) => state.user.logUser.companyId
  );

  const [tokenValid, setTokenValid] = useState<Boolean>(false);

  const session = window.localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${session}`,
  };

  useEffect(() => {
    // if(pathname !== '/' && !session){
    // 	navigate('/login')
    // }

    if (pathname !== "/" && pathname !== "/login" && !session) {
      navigate("/");
    }
    // if(pathname === '/login' && session){
    // 	navigate('/home')
    // }
    if (pathname === "/login" && tokenValid) {
      navigate("/home");
    }
    if (pathname === "/home" && logUser.tipo === "admin") {
      navigate("/crud");
    }
  }, [pathname]);

  useEffect(() => {
    if (session) {
      axios
        .get(`http://localhost:3001/auth/token`, { headers })
        .then((response) => {
          if (response) {
            dispatch(setLogUser(response.data.data.user));
            dispatch(setEmpresa(response.data.findCompany));
            setTokenValid(true);
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

  AxiosInterceptor();

  return (
    <>
      {pathname !== "/" && pathname !== "/login" && <NavBar />}
      <div className="grid max-w-[100%]">
        {pathname !== "/" &&
          pathname !== "/login" &&
          logUser.tipo === "admin" && <AppMenu />}
        <div className="col overflow-hidden">
          <Routes>
            {/* <Route path="/empresa/seleccionar" element={<SelectEmpresa />} /> */}
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activity/:id" element={<Activity />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/activities/:roleId" element={<AdminActivities />} />
            <Route path="/actvitySteps/:id" element={<ActivitySteps />} />
            <Route path="/addActivity/:roleId/:orderId" element={<AddActivity />} />

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

            <Route path="/activitiesList" element={<EvaluationList />} />
            <Route path="/employees/qualifications/:activityId" element={<ListEmployeesQualifications />} />
            <Route path="/checkpoint/:id" element={<Checkpoint />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
