import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getActivitiesByArea } from "../redux/features/activitiesSlice";
import { Link } from "react-router-dom";

function LeftMenu() {
    const dispatch = useAppDispatch()

    const areas = useSelector((state: RootState) => state.areas.areas)
    const logUser = useSelector((state: RootState) => state.user.logUser)

    const changeArea = (id: number = 1) => {
      dispatch(getActivitiesByArea(id))
    }

    return (
      <>
      {logUser.tipo === 'admin' && <div>Dashboard</div>}
      <div>
        {areas?.map((area) => (
            <div key={area?.id} onClick={() => changeArea(area.id)}>
                <button>{area.name}</button>
            </div>
        ))}
      </div>
      {logUser.tipo === 'admin' && (
        <Link to='/addArea'><button className="py-2 px-4 flex justify-center items-center rounded-full 
        font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-2xl
         dark:focus:ring-offset-gray-800">+</button></Link>
      )}
      </>
    );
  }
  
  export default LeftMenu;