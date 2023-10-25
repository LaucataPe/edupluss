import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getRolesByArea } from "../../redux/features/roleSlice";
import { setCurrentArea } from "../../redux/features/areaSlice";
import { useParams, Link } from "react-router-dom";
import { Button } from "primereact/button";
import Roles from "./Roles";

function AreaRoles() {
    const {areaId} = useParams()
    const dispatch = useAppDispatch();
    const areas = useSelector((state: RootState) => state.areas.areas);
    const currentArea = useSelector((state: RootState) => state.areas.currentArea);

    useEffect(() => {
        if(currentArea.id && currentArea.id !== 0){
            dispatch(getRolesByArea(currentArea.id))
        }else{
            const area = areas.find(area => area.id == areaId)
            if(area) dispatch(setCurrentArea(area)) 
        }
    }, [currentArea, areas])

    return (
        <>
            <div className="card m-3 relative">
                <Link to={`/areas`}>
                    <Button icon="pi pi-angle-double-left" className="z-50 absolute top-1 left-1" rounded severity="secondary"/>
                </Link>
                <Roles />
            </div>
        </>
  );
}

export default AreaRoles;
