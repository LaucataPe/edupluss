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
import { userInfo } from "os";

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
  const [usersRoles, setUsersRoles] = useState([[], []]);
  const [userStepsInfo, setUserStepsInfo] = useState([[], []]);
  const [roleIdSum, setRoleIdSum] = useState({});
  const [generalProgress, setGeneralProgress] = useState([]); // Inicializa el estado como un arreglo vacío

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
    if (userSteps.length > 0 && currentUsers.length > 0) {
      // Obtén todos los userId únicos de userSteps y colócalos en el índice 0 de ARREGLORO
      //@ts-ignore
      const uniqueUserIds = [...new Set(userSteps.map((step) => step.UserId))]; //@ts-ignore
      // Obtén los roleIds correspondientes de currentUsers y colócalos en el índice 1 de ARREGLORO
      const roleIds = uniqueUserIds.map((userId) => {
        const user = currentUsers.find((user) => user.id === userId);
        if (user && user.roleId !== undefined) {
          return user.roleId;
        } else {
          // Si no existe roleId, emite una advertencia
          console.warn("aun no hay roles");
        }
      });
      //@ts-ignore

      // Actualiza el estado con los valores calculados
      setUsersRoles([uniqueUserIds, roleIds]);
    }
  }, [userSteps, currentUsers]);

  useEffect(() => {
    // Inicializa los arreglos
    const userIds: any = [];
    const stepsCount: any = [];

    // Tu lógica para calcular userStepsInfo, similar a lo que mencioné anteriormente...
    userSteps.forEach((step) => {
      //@ts-ignore
      const userId = step.UserId;
      const userIndex = userIds.indexOf(userId);

      if (userIndex === -1) {
        // Si el UserID no está en el arreglo userIds, agrégalo y establece el contador en 1
        userIds.push(userId);
        stepsCount.push(1);
      } else {
        // Si el UserID ya está en el arreglo userIds, incrementa el contador en 1
        stepsCount[userIndex]++;
      }
    });

    // Después de calcular userStepsInfo, actualiza el estado usando setUserStepsInfo
    setUserStepsInfo([userIds, stepsCount]);
  }, [userSteps]);

  useEffect(() => {
    // Realiza cualquier otro trabajo con userSteps aquí, una vez que estén disponibles

    if (userSteps.length > 0 && currentUsers.length > 0) {
      // Inicializa el arreglo ARREGLORO
      const usersRolesTemp = [[], []];

      // Obtén todos los userId únicos de userSteps y colócalos en el índice 0 de ARREGLORO
      //@ts-ignore
      usersRolesTemp[0] = [...new Set(userSteps.map((step) => step.UserId))];
      // Obtén los roleIds correspondientes de currentUsers y colócalos en el índice 1 de ARREGLORO
      //@ts-ignore
      usersRolesTemp[1] = usersRolesTemp[0].map((userId) => {
        const user = currentUsers.find((user) => user.id === userId);
        if (user && user.roleId !== undefined) {
          return user.roleId;
        } else {
          // Si no existe roleId, emite una advertencia
          console.warn("aun no hay roles");
        }
      });

      // Verificar si usersRolesTemp[1] existe antes de continuar
      if (usersRolesTemp[1] && usersRolesTemp[1].length > 0) {
        // Filtra los roleId válidos (que no son undefined)
        const validRoleIds = usersRolesTemp[1].filter(
          (roleId) => roleId !== undefined
        );

        // Calcular la suma de numberSteps para cada roleId válido
        validRoleIds.forEach((roleId) => {
          const activitiesWithRoleId = activities.filter(
            (activity) => activity.roleId === roleId
          );
          const sumOfNumberSteps = activitiesWithRoleId.reduce(
            //@ts-ignore
            (total, activity) => total + activity.numberSteps,
            0
          );

          // console.log(`Pasos totales del Rol ${roleId}: ${sumOfNumberSteps}`);

          // Actualizar el estado roleIdSum con el nuevo valor
          setRoleIdSum((prevRoleIdSum) => ({
            ...prevRoleIdSum,
            [roleId]: sumOfNumberSteps,
          }));
        });
      } else {
        // Si no hay usuarios disponibles o pasos de usuario, emite una advertencia o error según corresponda
        if (userSteps.length === 0) {
          console.warn("No hay pasos de usuario disponibles");
        }
        if (currentUsers.length === 0) {
          console.warn("Esperando roles");
        }
      }
    }
  }, [userSteps, activities, currentUsers]);

  const handleButtonClick = () => {
    setShowProgressModal(true);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
  };

  const userIds = userStepsInfo[0];
  const stepsCount = userStepsInfo[1];

  useEffect(() => {
    const newProgress: any = []; // Crear un nuevo arreglo para el progreso actualizado

    userIds.forEach((userId, index) => {
      const userRoleId = usersRoles[1][usersRoles[0].indexOf(userId)];
      if (userRoleId !== undefined) {
        const totalStepsForRole =
          roleIdSum[usersRoles[1][usersRoles[0].indexOf(userId)]];
        const progress = Math.floor(
          (stepsCount[index] / totalStepsForRole) * 100
        );

        // Agregar un objeto que contiene userId y progreso al nuevo arreglo
        newProgress.push({ userId, progress });
      } else {
        // Agregar un objeto con userId y progreso 0 en caso de que no haya coincidencia de rol
        newProgress.push({ userId, progress: 0 });
      }
    });

    setGeneralProgress(newProgress); // Actualiza el estado "generalProgress" con el nuevo progreso
  }, [userIds, stepsCount, usersRoles, roleIdSum]); // Dependencias del efecto

  console.warn(generalProgress);

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
                      <div
                        key={user.id}
                        className={`card mb-3 text-center ${
                          user.progress === 0 ? "gray-card" : ""
                        }`}
                      >
                        <strong>{user.username}</strong>
                        <div className="col-10 col-xl-3 mx-auto">
                          {/* Utiliza el progreso real del usuario desde generalProgress */}
                          <ProgressBar
                            value={
                              generalProgress.find(
                                //@ts-ignore
                                (item) => item.userId === user.id //@ts-ignore
                              )?.progress || 0
                            }
                          />
                          <div className="col-6 col-xl-3 mx-auto">
                            {/* Aquí deberías tener tu componente Button */}
                            <Button
                              rounded
                              severity={
                                generalProgress.find(
                                  //@ts-ignore
                                  (item) => item.userId === user.id //@ts-ignore
                                )?.progress <= 100 &&
                                generalProgress.find(
                                  //@ts-ignore
                                  (item) => item.userId === user.id //@ts-ignore
                                )?.progress > 0
                                  ? "info"
                                  : "secondary"
                              }
                              icon="pi pi-arrow-right"
                              onClick={handleButtonClick}
                            ></Button>
                          </div>
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
