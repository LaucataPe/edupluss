import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function NavBar() {
    const currentEmpresa = useSelector<RootState>((state) => state.activities.selectEmpresa.name)
    console.log(currentEmpresa);
    
    return (
      <>
      <h1>{currentEmpresa ? 'currentEmpresa' : 'Selecciona la empresa'}</h1>
      <button>Log In</button>
      </>
    );
  }
  
  export default NavBar;