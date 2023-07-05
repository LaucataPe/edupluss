import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router";
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
      <h1>{currentEmpresa ? currentEmpresa : 'Selecciona la empresa'}</h1>
      <button>Log In</button>
      <button onClick={handleChange}>Cambiar de Empresa</button>
      </>
    );
  }
  
  export default NavBar;