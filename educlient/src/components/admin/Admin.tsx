import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getRolesByArea } from "../../redux/features/roleSlice";
import Roles from "./Roles";

function Admin() {
  const dispatch = useAppDispatch();
  const areas = useSelector((state: RootState) => state.areas.areas);
  const currentArea = useSelector(
    (state: RootState) => state.areas.currentArea
  );

  const firstArea = areas[0];
  useEffect(() => {
    if (areas.length > 0 && currentArea.id === 0) {
      if (firstArea.id) {
        dispatch(getRolesByArea(firstArea.id));
      }
    }
  }, [areas]);

  return (
    <>
      <div className="container">
        <div className="card my-3">
          {/* {currentArea.id === 0 ? <h3 className="text-center my-2 text-indigo-500">{firstArea.name}</h3>: ''} */}
          {areas.length > 0 ? (
            <Roles />
          ) : (
            <h1 className="text-center mt-5">
              Aún no existen áreas en esta empresa - Crea una para comenzar tu
              experiencia
            </h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;
