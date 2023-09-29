import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRef } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { getCompanyRoles } from "../redux/features/roleSlice";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getUsersByCompany } from "../redux/features/userSlice";
import ProgressModal from "../components/ProgressModal";

function Dashboard() {
  const dispatch = useAppDispatch();
  const currentUsers = useSelector((state: RootState) => state.user.users);
  const currentEmpresa = useSelector(
    (state: RootState) => state.user.logUser.companyId
  );
  const [value, setValue] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const roles = useSelector((state: RootState) => state.roles.roles);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const usersByRole: { [roleName: string]: any[] } = {};

  currentUsers.forEach((user) => {
    const roleId = user.roleId;
    const roleName = roles.find((role) => role.id === roleId)?.name;

    if (roleName) {
      if (!usersByRole[roleName]) {
        usersByRole[roleName] = [];
      }
      usersByRole[roleName].push(user);
    }
  });

  for (const roleName in usersByRole) {
    console.log(`Rol: ${roleName}`);
    console.log(usersByRole[roleName]);
  }
  useEffect(() => {
    try {
      dispatch(getCompanyRoles(currentEmpresa));
    } catch (error) {
      console.error(error);
      alert("No se han encontrado roles");
    }
  }, [dispatch, currentEmpresa]);

  useEffect(() => {
    try {
      dispatch(getUsersByCompany(currentEmpresa));
    } catch (error) {
      console.error(error);
      alert("No se han encontrado usuarios por empresa");
    }
  }, [dispatch, currentEmpresa]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(() => {
        const randomPercentage = Math.floor(Math.random() * 71) + 30; // Genera un número aleatorio entre 30 y 100.
        return randomPercentage;
      });
    }, 3000);

    intervalRef.current = interval;

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    };
  }, []);

  const activities = [
    { id: 1, title: "Actividad 1", roleId: 1, active: true },
    { id: 2, title: "Actividad 2", roleId: 2, active: false },
    { id: 3, title: "Actividad 3", roleId: 3, active: true },
    { id: 4, title: "Actividad 4", roleId: 4, active: false },
  ];

  // Función para manejar el clic en el botón
  const handleButtonClick = () => {
    // Muestra el modal de progreso al hacer clic en el botón
    setShowProgressModal(true);
  };

  // Función para cerrar el modal de progreso
  const closeProgressModal = () => {
    setShowProgressModal(false);
  };

  return (
    <div className="flex">
      <div className="w-[100%]">
        <div className="p-5">
          <h3 className="text-xl font-semibold">
            Progreso general de Actividades:
          </h3>
          {showProgressModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-0 rounded-md shadow-md">
                <ProgressModal
                  activities={activities}
                  closeModal={closeProgressModal}
                />
              </div>
            </div>
          )}
          <div className="flex">
            {Object.entries(usersByRole).map(([roleName, users]) => (
              <div key={roleName} className="col-4 col-md-4">
                <div className=" border-2 shadow-2xl p-4 rounded-2xl">
                  <h4>Rol: {roleName}</h4>
                  {users.map((user) => (
                    <div key={user.id} className="card mb-3 text-center">
                      <strong>Usuario:</strong> {user.username}
                      <div className="col-10 col-xl-3 mx-auto">
                        {/* Aquí deberías tener tu componente ProgressBar */}
                        <ProgressBar value={value} />
                      </div>
                      <div className="col-6 col-xl-3 mx-auto">
                        {/* Aquí deberías tener tu componente Button */}
                        <Button
                          rounded
                          severity="info"
                          icon="pi pi-arrow-right"
                          onClick={handleButtonClick}
                        ></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
