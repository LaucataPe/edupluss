import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getActivitiesByArea } from "../redux/features/activitiesSlice";
import { Link } from "react-router-dom";
import { setCurrentArea } from "../redux/features/areaSlice";
import { Area } from "../utils/interfaces";
import { FaPuzzlePiece, FaPlusCircle, FaChartLine } from "react-icons/fa";

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
      <div className="sidebar top-0 bottom-0 lg:left-0 p-2 w-[200px] 
        overflow-y-auto text-center bg-blue-100">
          {logUser.tipo === 'admin' && 
          <div className="p-2.5 mt-1 flex items-center cursor-pointer hover:border border-blue-700">
            <FaChartLine/>
            <span className="font-bold text-blue-700 text-[15px] ml-3 text-xl">Dashboard</span>
          </div>}
          <div className="p-2.5 mt-1 flex items-center">
              <FaPuzzlePiece clasName="text-blue-700"/>
              <h1 className="font-bold text-blue-700 text-[15px] ml-3 text-xl">Áreas</h1>
          </div>
          <div className="my-2 bg-blue-600 h-[1px]"></div>
        
        
        {areas?.map((area) => (
            <div key={area?.id} onClick={() => changeArea(area)}
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 
              cursor-pointer text-blue-500 hover:bg-blue-600 hover:text-white">
                 <span className="text-[15px] ml-1  
                 font-bold ">{area.name}</span>
            </div>
        ))}

        {logUser.tipo === 'admin' && (
          <Link to='/addArea'>
            <div className="my-2 bg-blue-600 h-[1px]"></div>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 
              cursor-pointer text-blue-500 hover:bg-blue-600 hover:text-white">
                <FaPlusCircle/>
                <span className="text-[15px] ml-1 font-bold ">Agregar Área</span>
            </div>
          </Link>
        )}
      </div>
      
      </>
    );
  }
  
  export default LeftMenu;