import { useEffect } from "react";
import { useSelector } from "react-redux";
import Activities from "../components/Activities";
import { useAppDispatch } from "../hooks/typedSelectors";
import { RootState } from "../redux/store";
import { getActivitiesByRole } from "../redux/features/activitiesSlice";
//import AppMenu from "../components/SideMenu";

function Home() {
    const Mydispatch = useAppDispatch()
    const logUser = useSelector((state: RootState) => state.user.logUser)

    useEffect(() => {
      if(logUser.roleId){
        Mydispatch(getActivitiesByRole(logUser.roleId))
      }
    }, [logUser]);

    return (
      <>
       <div className="flex">
        <div className="w-[100%]">
          <h2 className="text-3xl font-semibold text-center p-5">Hola {logUser.username}</h2>
          <Activities />
        </div>
      </div>
      
      </>
    );
  }
  
  export default Home;