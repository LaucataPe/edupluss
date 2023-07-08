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
      <nav className="grid grid-cols-10 gap-4 py-3 bg-blue-500 text-white">
        <h1 className="text-3xl font-bold col-span-7 text-center">{currentEmpresa ? currentEmpresa : 'Selecciona la empresa'}</h1>
        <button onClick={handleChange} className="box-border rounded py-1 border-2 col-span-2
        hover:bg-white hover:text-blue-500">Cambiar de Empresa</button>
        <Link to='/login'><button className="box-border rounded  py-1 px-3 border-2 col-span-1
        hover:bg-white hover:text-blue-500"
        >Log In</button></Link>
      </nav>
      </>
    );
  }
  
  export default NavBar;