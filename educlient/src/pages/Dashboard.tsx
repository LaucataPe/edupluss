import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2"; // Añade Scatter aquí si aún no lo has importado
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { getUsersByCompany } from "../redux/features/userSlice";
import { useAppDispatch } from "../hooks/typedSelectors";
// import { User } from "../utils/interfaces";
// import { getEmpresaActivities } from "../redux/features/activitiesSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
function Dashboard() {
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const companyUsers = useSelector((state: RootState) => state.user.users); //@ts-ignore

  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const [chartKey, setChartKey] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const dispatch = useAppDispatch();
  const [totalUsers, setTotalUsers] = useState(null);
  const [activitiesInfo, setActivitiesInfo] = useState(null);
  //@ts-ignore
  const [stepsInfo, setStepsInfo] = useState(null);
  const [totalActiveUsers, setTotalActiveUsers] = useState(null);
  const [totalActivities, setTotalActivities] = useState(null);
  const [totalStepsByRoleId, setTotalStepsByRoleId] = useState({});
  const [userSteps, setUserSteps] = useState([]);
  const [userIdCount, setUserIdCount] = useState({});
  const [graduatedUsers, setGraduatedUsers] = useState([]); //@ts-ignore

  const [labels, setLabels] = useState([]);
  const [usersWithProgress, setUsersWithProgress] = useState([]); //@ts-ignore

  const [areas, setAreas] = useState([]); //@ts-ignore

  const [roles, setRoles] = useState([]);
  const [employeesByArea, setEmployeesByArea] = useState([]);
  const [totalChanges, setTotalChanges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (logUser.companyId) {
        try {
          await dispatch(getUsersByCompany(logUser.companyId));
          // Filtra los usuarios con active = true
          if (companyUsers.length) {
            const activeUsers = companyUsers.filter(
              (user) => user?.active === true && user?.id !== logUser.id
            );
            // Establece el total de usuarios activos en el estado
            //@ts-ignore
            setTotalUsers(activeUsers); //@ts-ignore
            setTotalActiveUsers(activeUsers.length);
          }
        } catch (error) {
          console.error("Error al obtener datos de usuarios:", error);
        }
      }
    };

    fetchData();
  }, [logUser, companyUsers.length]);

  useEffect(() => {
    const fetchData = async () => {
      if (logUser.id) {
        try {
          const response = await axios.get(
            `http://localhost:3001/activities/${logUser.companyId}`
          );
          const activities = response.data;
          // Calcula la cantidad total de actividades
          const total = activities.length;

          const totalSteps: any = {};

          activities.forEach((activity: any) => {
            const { roleId, numberSteps } = activity;
            if (roleId in totalSteps) {
              totalSteps[roleId] += numberSteps;
            } else {
              totalSteps[roleId] = numberSteps;
            }
          });
          setTotalActivities(total);
          setActivitiesInfo(activities);
          // Establece el objeto totalStepsByRoleId en el estado
          setTotalStepsByRoleId(totalSteps);
        } catch (error) {
          console.error("Error al obtener las actividades:", error);
        }
      }
    };

    fetchData();
  }, [logUser.id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/userStep");
        const userSteps = response?.data;
        setUserSteps(userSteps);
        const count = {};

        userSteps.forEach((userStep: any) => {
          const userId = userStep?.UserId;

          if (userId in count) {
            //@ts-ignore
            count[userId] += 1;
          } else {
            //@ts-ignore
            count[userId] = 1;
          }
        });

        setUserIdCount(count);
      } catch (error) {
        console.error("Error al obtener datos de UserSteps:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/steps");
        const steps = response.data;
        setStepsInfo(steps);
      } catch (error) {
        console.error("Error al obtener datos de steps:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (totalUsers && totalStepsByRoleId && userIdCount) {
      // Comparación para determinar si un usuario ha "graduado"
      //@ts-ignore
      const graduatedUsers = totalUsers.map((user) => {
        const roleIdExists = user.roleId in totalStepsByRoleId;
        const isEmployee = user.tipo === "empleado"; // Verifica si el usuario es "empleado"

        return {
          userId: user.id,
          graduated:
            user.active && // Solo usuarios activos pueden graduarse
            isEmployee && // Verifica si el usuario es "empleado"
            roleIdExists && //@ts-ignore
            (user.id in userIdCount ? userIdCount[user.id] : 0) >= //@ts-ignore
              totalStepsByRoleId[user.roleId],
        };
      });
      setGraduatedUsers(graduatedUsers);
    }
  }, [totalUsers, totalStepsByRoleId, userIdCount]);

  const graduatedCount = graduatedUsers.filter(
    //@ts-ignore
    (user) => user?.graduated
  ).length;
  const remainingCount = graduatedUsers.length - graduatedCount;
  // #### Grafico 1 Progreso de usuarios ####

  useEffect(() => {
    if (totalUsers && logUser) {
      //@ts-ignore
      const usersWithLogUserCompanyId = totalUsers.filter(
        (user: any) =>
          user.companyId === logUser.companyId &&
          user.id !== logUser.id &&
          user.tipo !== "admin"
      );
      // Almacenar las etiquetas en el estado
      const usernames = usersWithLogUserCompanyId.map(
        (user: any) => user.username
      );
      const usersWithProgress = usersWithLogUserCompanyId.map((user: any) => {
        const userId = user.id; //@ts-ignore
        const completedSteps = userIdCount[userId] || 0; //@ts-ignore
        const totalSteps = totalStepsByRoleId[user.roleId] || 0;

        // Calcular el progreso en porcentaje
        const progress =
          totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

        return {
          username: user.username,
          progreso: Math.round(progress), // Redondear el progreso a un número entero
        };
      });

      setUsersWithProgress(usersWithProgress);
      setLabels(usernames);
    }
  }, [totalUsers, userIdCount, totalStepsByRoleId, logUser]);
  const data = {
    //@ts-ignore
    labels: usersWithProgress.map((user) => user.username),
    datasets: [
      {
        label: "Usuario", //@ts-ignore
        data: usersWithProgress.map((user) => user.progreso),
        borderColor: "#9dc065",
        backgroundColor: "#8ec640",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Progreso general de actividades",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        display: "auto",
        color: "white",
        formatter: (value: any) => {
          return value + "%";
        },
      },
    },
    scales: {
      x: {
        max: 150,
        display: true,
      },
      y: {
        max: 100,
        grid: {
          display: false,
        },
      },
    },
  };

  // #### Grafico 2 Empleados por areas ####
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (logUser && logUser.tipo === "admin") {
          const companyId = logUser.companyId;
          const response = await axios.get(
            `http://localhost:3001/areas/${companyId}`
          );
          const areas = response.data;
          setAreas(areas);
        }
      } catch (error) {
        console.error("Error al obtener datos de UserSteps:", error);
      }
    };
    fetchData();
  }, [logUser]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (logUser && logUser.tipo === "admin" && areas && totalUsers) {
          //@ts-ignore
          const allRoles = [];

          for (const area of areas) {
            const response = await axios.get(
              //@ts-ignore
              `http://localhost:3001/roles/${area.id}`
            );
            const roles = response.data;
            allRoles.push(...roles);
          }
          //@ts-ignore
          setRoles(allRoles);

          // Cálculo de employeesByArea
          const calculatedEmployeesByArea = {};

          areas.forEach((area) => {
            //@ts-ignore
            calculatedEmployeesByArea[area?.name] = 0;
          });
          //@ts-ignore
          totalUsers.forEach((user) => {
            //@ts-ignore
            const role = allRoles.find((r) => r.id === user?.roleId);
            if (role) {
              //@ts-ignore
              const area = areas.find((a) => a.id === role?.areaId);
              if (area) {
                //@ts-ignore
                calculatedEmployeesByArea[area.name]++;
              }
            }
          });

          // Actualizar el estado con el resultado
          //@ts-ignore
          setEmployeesByArea(calculatedEmployeesByArea);
        }
      } catch (error) {
        console.error("Error al obtener datos de UserSteps:", error);
      }
    };

    fetchData();
  }, [logUser, areas, totalUsers]);

  const data2 = {
    labels: Object.keys(employeesByArea), // Nombres de las áreas
    datasets: [
      {
        label: "Cantidad de Empleados",
        data: Object.values(employeesByArea), // Cantidad de empleados
        borderColor: "rgb(3, 152, 152)",
        backgroundColor: "rgb(6, 145, 145)",
      },
    ],
  };

  const options2 = {
    indexAxis: "x" as const,
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Empleados por Area",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        display: "auto",
        color: "white",
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        max: Math.max(...Object.values(employeesByArea)) + 2,
        grid: {
          display: true,
        },
      },
    },
  };

  // ### Escalamiento de graficos ###

  const refreshChart = () => {
    setChartKey(chartKey + 1);
  };

  useEffect(() => {
    const handleResize = () => {
      //@ts-ignore
      clearTimeout(window.resizeTimeout); //@ts-ignore
      window.resizeTimeout = setTimeout(() => {
        refreshChart();
      }, 500);

      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleOrientationChange = () => {
      //@ts-ignore
      clearTimeout(window.resizeTimeout); //@ts-ignore
      window.resizeTimeout = setTimeout(() => {
        refreshChart();
      }, 500);

      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  const hasZoomed = (prevDimensions: any, currentDimensions: any) => {
    const widthChange = prevDimensions.width !== currentDimensions.width;
    const heightChange = prevDimensions.height !== currentDimensions.height;
    return widthChange || heightChange;
  };

  useEffect(() => {
    if (
      hasZoomed(windowDimensions, {
        width: window.innerWidth,
        height: window.innerHeight,
      })
    ) {
      refreshChart();
    }
  }, [windowDimensions]);
  //Notificaciones

  const now: any = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);
  useEffect(() => {
    if (
      userSteps &&
      userSteps.length > 0 &&
      totalUsers && //@ts-ignore
      totalUsers.length > 0
    ) {
      const updateTotalChanges = () => {
        const now: any = new Date();
        const newTotalChanges: any = [];

        userSteps.forEach((step, index) => {
          //@ts-ignore
          const createdAt: any = new Date(step.createdAt);
          const timeDifference = now - createdAt;

          if (timeDifference <= 24 * 60 * 60 * 1000) {
            const timeParts = {
              days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
              hours: Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              ),
              minutes: Math.floor(
                (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
              ),
              seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
            };
            //@ts-ignore
            const userId = step?.UserId; //@ts-ignore
            const user = totalUsers.find((user) => user.id === userId);
            const activityInfo = activitiesInfo?.[index];
            const activityName = activityInfo //@ts-ignore
              ? activityInfo.title
              : "Actividad no encontrada";

            const hoursDifference = timeParts.hours;
            const minutesDifference = timeParts.minutes;
            const daysDifference = timeParts.days;
            let timeAgo = "";

            switch (true) {
              case hoursDifference === 0:
                timeAgo =
                  timeParts.days !== 0
                    ? timeParts.days === 1
                      ? `hace 1 día`
                      : `hace ${daysDifference} días`
                    : minutesDifference === 1
                    ? `hace 1 minuto`
                    : `hace ${minutesDifference} minutos`;
                break;
              case hoursDifference === 1:
                timeAgo = `hace 1 hora`;
                if (minutesDifference !== 0) {
                  timeAgo += `, ${minutesDifference} minutos`;
                }
                break;
              default:
                timeAgo =
                  timeParts.days !== 0
                    ? timeParts.days === 1
                      ? `hace 1 día`
                      : `hace ${daysDifference} días`
                    : minutesDifference === 1
                    ? `hace 1 minuto`
                    : `hace ${minutesDifference} minutos`;
                if (hoursDifference !== 0) {
                  timeAgo += `, ${hoursDifference} horas`;
                }
            }

            const message = `El usuario ${
              user?.username || "Usuario desconocido"
            } completó la actividad "${activityName}" ${timeAgo}.`;

            if (Object.values(timeParts).some((part) => part > 0)) {
              newTotalChanges[index + 1] = {
                user: user?.username || "Usuario desconocido",
                step: index + 1,
                activity: activityName,
                date: createdAt,
                message: message,
              };
            }
          }
        });

        setTotalChanges(newTotalChanges);
      };
      updateTotalChanges();
      const intervalId = setInterval(
        updateTotalChanges,
        Math.floor(500 + Math.random() * 1500)
      );

      return () => clearInterval(intervalId);
    }
  }, [userSteps, totalUsers, activitiesInfo]);

  const todayNotifications: any = [];
  const yesterdayNotifications: any = [];
  const momentNotifications: any = [];

  for (const stepIndex in totalChanges) {
    const change = totalChanges[stepIndex]; //@ts-ignore
    const date = new Date(change.date);

    if (date >= fiveMinutesAgo && date <= now) {
      momentNotifications.push(change);
    } else if (date >= twentyFourHoursAgo && date < fiveMinutesAgo) {
      todayNotifications.push(change);
    } else if (date < twentyFourHoursAgo) {
      yesterdayNotifications.push(change);
    }
  }

  return (
    <div className="flex">
      <div className="card my-3 mx-3">
        <div className="w-[100%]">
          <div className="p-5">
            <div className="grid justify-center">
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0  p-3">
                  <div className="flex justify-content-around mb-0 ">
                    <div
                      className="flex align-items-center justify-content-center bg-orange-100 border-round "
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    >
                      <i className="pi pi-users text-orange-500 text-4xl" />
                    </div>
                    <div>
                      <span className="block text-500 font-medium mb-1">
                        Usuarios activos:
                      </span>
                      <div className="text-900 font-medium text-xl text-center">
                        {totalActiveUsers
                          ? totalActiveUsers
                          : "Sin información"}
                      </div>
                    </div>
                  </div>
                  {/* <span className="text-green-500 font-medium">
                Quedan{" "}
                {remainingCount ? remainingCount : "Esperando graduados..."}
              </span>
              <span className="text-500"> a la espera de graduarse</span>
              <div>
                <strong>
                  {graduatedCount && remainingCount
                    ? ((graduatedCount / remainingCount) * 100).toFixed(2) +
                      "%"
                    : "No se puede calcular el porcentaje en este momento."}{" "}
                  Porcentaje de graduados
                </strong>
              </div> */}
                </div>
              </div>
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0  p-3">
                  <div className="flex justify-content-around mb-0">
                    <div
                      className="flex align-items-center justify-content-center bg-cyan-100 border-round "
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    >
                      <i className="pi pi-book text-cyan-500 text-4xl" />
                    </div>
                    <div className="">
                      <span className="block text-500 font-medium mb-1 ">
                        Actividades activas:
                      </span>
                      <div className="text-900 font-medium text-xl text-center">
                        {totalActivities ? totalActivities : "Sin información"}
                      </div>
                    </div>
                  </div>
                  {/* <span className="text-green-500 font-medium">
                Quedan{" "}
                {remainingCount ? remainingCount : "Esperando graduados..."}
              </span>
              <span className="text-500"> a la espera de graduarse</span>
              <div>
                <strong>
                  {graduatedCount && remainingCount
                    ? ((graduatedCount / remainingCount) * 100).toFixed(2) +
                      "%"
                    : "No se puede calcular el porcentaje en este momento."}{" "}
                  Porcentaje de graduados
                </strong>
              </div> */}
                </div>
              </div>
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0  p-3">
                  <div className="flex justify-content-around mb-0">
                    <div
                      className="flex align-items-center justify-content-center bg-blue-100 border-round "
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    >
                      <i className="pi pi-check-circle text-blue-500 text-4xl" />
                    </div>
                    <div>
                      <span className="block text-500 font-medium mb-1">
                        Graduados:{" "}
                      </span>
                      <div className="text-900 font-medium  text-xl text-center">
                        {graduatedCount ? graduatedCount : "Sin información"}
                      </div>
                    </div>
                  </div>
                  {/* <span className="text-green-500 font-medium">
                Quedan{" "}
                {remainingCount ? remainingCount : "Esperando graduados..."}
              </span>
              <span className="text-500"> a la espera de graduarse</span>
              <div>
                <strong>
                  {graduatedCount && remainingCount
                    ? ((graduatedCount / remainingCount) * 100).toFixed(2) +
                      "%"
                    : "No se puede calcular el porcentaje en este momento."}{" "}
                  Porcentaje de graduados
                </strong>
              </div> */}
                </div>
              </div>
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0  p-3">
                  <div className="flex justify-content-around mb-0">
                    <div
                      className="flex align-items-center justify-content-center bg-blue-100 border-round"
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    >
                      <i className="pi pi-percentage text-blue-500 text-4xl" />
                    </div>
                    <div>
                      <span className="block text-500 font-medium mb-1">
                        de graduados:{" "}
                      </span>
                      <div className="text-900 font-medium text-xl text-center">
                        {graduatedCount && remainingCount
                          ? ((graduatedCount / remainingCount) * 100).toFixed(
                              2
                            ) + "%"
                          : "Sin información"}
                      </div>
                    </div>
                  </div>
                  {/* <span className="text-green-500 font-medium">
                Quedan{" "}
                {remainingCount ? remainingCount : "Esperando graduados..."}
              </span>
              <span className="text-500"> a la espera de graduarse</span>
              <div>
                <strong>
                  {graduatedCount && remainingCount
                    ? ((graduatedCount / remainingCount) * 100).toFixed(2) +
                      "%"
                    : "No se puede calcular el porcentaje en este momento."}{" "}
                  Porcentaje de graduados
                </strong>
              </div> */}
                </div>
              </div>
            </div>
            <div className="grid justify-center">
              <div className="col-18 lg:col-6 xl:col-7 my-2">
                <div className="card mb-0 p-1">
                  <Link to="/areas">
                    <div style={{ width: "100%", height: "400px" }}>
                      {/*@ts-ignore*/}
                      <Bar options={options2} data={data2} />
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-18 lg:col-6 xl:col-5 my-2">
                <div className="card mb-0">
                  <Link to="/progress">
                    <div style={{ width: "100%", height: "400px" }}>
                      {/*@ts-ignore*/}
                      <Bar options={options} data={data} />
                    </div>
                  </Link>
                </div>
              </div>
              <div className="card">
                <div className="flex align-items-center justify-content-between mb-4">
                  <h5>Notifications</h5>
                </div>
                {momentNotifications?.length > 0 && (
                  <div>
                    <span className="block text-600 font-medium mb-3">
                      Últimas actualizaciones
                    </span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                      {momentNotifications?.map(
                        (notification: any, index: any) => (
                          <li
                            key={index}
                            className="flex align-items-center py-2 border-bottom-1 surface-border"
                          >
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                              <i className="pi pi-book text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                              El usuario {notification.user} realizó el paso{" "}
                              {notification.step} de esta actividad{" "}
                              {notification.activity}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {todayNotifications?.length > 0 && (
                  <div>
                    <span className="block text-600 font-medium mb-3">Hoy</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                      {todayNotifications?.map(
                        (notification: any, index: any) => (
                          <li
                            key={index}
                            className="flex align-items-center py-2 border-bottom-1 surface-border"
                          >
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                              <i className="pi pi-book text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                              El usuario {notification.user} realizó el paso{" "}
                              {notification.step} de esta actividad{" "}
                              {notification.activity}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {yesterdayNotifications.length > 0 && (
                  <div>
                    <span className="block text-600 font-medium mb-3">
                      YESTERDAY
                    </span>
                    <ul className="p-0 m-0 list-none">
                      {yesterdayNotifications.map(
                        (notification: any, index: any) => (
                          <li
                            key={index}
                            className="flex align-items-center py-2 border-bottom-1 surface-border"
                          >
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                              <i className="pi pi-dollar text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                              El usuario {notification.user} realizó el paso{" "}
                              {notification.step} de esta actividad{" "}
                              {notification.activity}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex justify-center">
              <Button label="Escalar y Reiniciar" onClick={refreshChart} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
