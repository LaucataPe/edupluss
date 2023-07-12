import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getActivitiesByArea } from "../redux/features/activitiesSlice";
import { Link } from "react-router-dom";
import { setCurrentArea } from "../redux/features/areaSlice";
import { Area } from "../utils/interfaces";

function LeftMenu() {
    const dispatch = useAppDispatch()

    const areas = useSelector((state: RootState) => state.areas.areas)
    const logUser = useSelector((state: RootState) => state.user.logUser)

    const changeArea = (area: Area) => {
      dispatch(getActivitiesByArea(area.id ?? 0))
      dispatch(setCurrentArea(area))
    }

    return (
      <>
      {logUser.tipo === 'admin' && <div>Dashboard</div>}
      <div>
        {areas?.map((area) => (
            <div key={area?.id} onClick={() => changeArea(area)}>
                <button>{area.name}</button>
            </div>
        ))}
      </div>
      {logUser.tipo === 'admin' && (
        <Link to='/addArea'><button className="py-2 px-4 flex justify-center items-center 
        font-semibold text-blue-500 bg-white hover:bg-blue-600 transition-all text-2xl
         dark:focus:ring-offset-gray-800">+</button></Link>
      )}
      </>
    );
  }
  
  export default LeftMenu;