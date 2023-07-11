import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate, Link } from "react-router-dom";
import { resetActivities } from "../redux/features/activitiesSlice";


function NavBar() {
  const dispatch = useDispatch()
    const navigate = useNavigate();
    const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa.name)
    
    const handleChange = () => {
      dispatch(resetActivities())
      window.localStorage.removeItem("empresa");
		  navigate("/empresa/seleccionar");
    }

    return (
      <>
      <nav className=" py-3 bg-blue-500 text-white">
        <h1 className="text-3xl font-bold text-center">{currentEmpresa ? currentEmpresa : 'Selecciona la empresa'}</h1>
      </nav>
      </>
    );
  }
  
  export default NavBar;