import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

function LeftMenu() {

    const areas = useSelector((state: RootState) => state.areas.areas)

    return (
      <>
      <div>
        {areas.map((area) => (
            <div key={area.id}>
                <span>{area.name}</span>
            </div>
        ))}
      </div>
      </>
    );
  }
  
  export default LeftMenu;