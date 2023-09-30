import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { useRef } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { getCompanyRoles } from "../redux/features/roleSlice";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getUsersByCompany } from "../redux/features/userSlice"; // Asegúrate de importar la acción correcta si no está en el mismo archivo

function Dashboard() {
  const dispatch = useAppDispatch();
  const currentUsers = useSelector((state: RootState) => state.user.users);
  const currentEmpresa = useSelector(
    (state: RootState) => state.user.logUser.companyId
  );
  const [value, setValue] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // const LoggedUser = useSelector((state: RootState) => state.user.logUser.id);
  const roles = useSelector((state: RootState) => state.roles.roles);
  console.log(roles);
  useEffect(() => {
    try {
      dispatch(getCompanyRoles(currentEmpresa));
    } catch (error) {
      console.error(error); // Puedes registrar el error si es necesario
      alert("No se han encontrado roles");
    }
  }, [dispatch, currentEmpresa]);

  useEffect(() => {
    try {
      dispatch(getUsersByCompany(currentEmpresa)); // Llamamos a getUsersByCompany con el ID de la empresa actual
    } catch (error) {
      console.error(error);
      alert("No se han encontrado usuarios por empresa");
    }
  }, [dispatch, currentEmpresa]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => {
        const newVal = prevValue + Math.floor(Math.random() * 10) + 1;
        return newVal >= 100 ? 100 : newVal;
      });
    }, 1500);

    intervalRef.current = interval;

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    };
  }, []);

  return (
    <div className="flex">
      <div className="w-[100%]">
        {/* <h2 className="text-3xl font-semibold text-center p-5">
          En producción 😅
        </h2> */}
        <div className="p-5">
          <h3 className="text-xl font-semibold">
            Progreso general de Actividades:
          </h3>
          {/* Empresa:{currentEmpresa}
          <br />
          Usuario Actual:{LoggedUser}
          <br />
          <div>
            Posibles Roles:
            {roles.map((role) => (
              <div key={role.id}>
          
                <p>{role.name}</p>
              </div>
            ))}
          </div> */}
          <ul>
            {currentUsers.map((user) => (
              <li key={user.id}>
                <div className="card flex justify-content-between mb-3">
                  <div className="col-2 lg:col-3 xl:col-6">
                    <strong>Usuario:</strong> {user.username}
                  </div>
                  <div className="col xs:col-6 xl:col-3">
                    <ProgressBar value={value} />
                  </div>
                  <Link to={`/activities/3/3`}>
                    {/*Hardcode de /activities/${role.id} */}
                    <Button
                      rounded
                      severity="info"
                      icon="pi pi-arrow-right"
                    ></Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
