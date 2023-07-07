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
      <nav>
        <h1>{currentEmpresa ? currentEmpresa : 'Selecciona la empresa'}</h1>
        <Link to='/login'><button>Log In</button></Link>
        <button onClick={handleChange}>Cambiar de Empresa</button>
      </nav>
      </>
    );
  }
  
  export default NavBar;