import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRef } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { getCompanyRoles } from "../redux/features/roleSlice";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getUsersByCompany } from "../redux/features/userSlice";
import { fetchActivities } from "../redux/features/activitiesSlice";
import ProgressModal from "../components/ProgressModal";
import axios from "axios";

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
  const [currentPage, setCurrentPage] = useState(1);
  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const [userSteps, setUserSteps] = useState([]);

  const itemsPerPage = 3;

  const totalPages = Math.ceil(Object.keys(usersByRole).length / itemsPerPage);

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

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

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
        const randomPercentage = Math.floor(Math.random() * 71) + 30;
        return randomPercentage;
      });
    }, 5000);

    intervalRef.current = interval;

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza la petición GET y espera a que se resuelva
        const response = await axios.get("http://localhost:3001/userStep");
        setUserSteps(response.data);
      } catch (error) {
        console.error("Error al obtener datos de UserSteps:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Realiza cualquier otro trabajo con userSteps aquí, una vez que estén disponibles
    if (userSteps.length > 0) {
      // Filtra las actividades que tienen roleId igual a 1
      const activitiesWithRoleId1 = activities.filter(
        (activity) => activity.roleId === 1
      );

      // Calcula la suma de numberSteps de las actividades con roleId 1
      const sumOfNumberSteps = activitiesWithRoleId1.reduce(
        (total, activity) => total + activity.numberSteps,
        0
      );

      // Inicializa el arreglo ARREGLORO
      const usersRoles = [[], []];

      // Obtén todos los userId únicos de userSteps y colócalos en el índice 0 de ARREGLORO
      usersRoles[0] = [...new Set(userSteps.map((step) => step.UserId))];

      // Verifica si hay usuarios disponibles en currentUsers antes de asignar roles
      if (currentUsers.length > 0) {
        // Obtén los roleIds correspondientes de currentUsers y colócalos en el índice 1 de ARREGLORO
        usersRoles[1] = usersRoles[0].map((userId) => {
          const user = currentUsers.find((user) => user.id === userId);
          if (user && user.roleId !== undefined) {
            return user.roleId;
          } else {
            // Si no existe roleId, emite una advertencia
            console.warn("aun no hay roles");
          }
        });

        // Verifica si todos los roleIds son definidos antes de console.log
        if (usersRoles[1].every((roleId) => roleId !== undefined)) {
          // Console.loguea ARREGLORO solo si todos los roleIds están definidos
          console.log("ARREGLORO:", usersRoles);
        }
      } else {
        // Si no hay usuarios disponibles, genera un error
        console.warn("Esperando roles");
      }
    }
  }, [userSteps, activities, currentUsers]);

  const handleButtonClick = () => {
    setShowProgressModal(true);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
  };
  // currentUsers.length > 0 ? console.warn("currentUsers:", currentUsers) : null;
  // currentUsers.length > 0 ? console.warn("activities:", activities) : null;

  return (
    <div className="flex">
      <div className="w-[100%]">
        <div className="p-5">
          <h3 className="text-xl font-semibold">
            Progreso general de Actividades:{" "}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                rounded
                severity="info"
                icon="pi pi-arrow-left"
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-primary"
              ></Button>
              <Button
                rounded
                severity="info"
                icon="pi pi-arrow-right"
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-primary"
                style={{ marginLeft: "10px" }} // Agregamos un margen izquierdo de 10px
              ></Button>
            </div>
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
            {Object.entries(usersByRole)
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map(([roleName, users]) => (
                <div key={roleName} className="col-4 col-md-4">
                  <div className="border-2 shadow-2xl p-4 rounded-2xl">
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
