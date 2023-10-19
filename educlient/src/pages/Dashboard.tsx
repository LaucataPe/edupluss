//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
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
import { Link } from "react-router-dom";

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
  const [chartKey, setChartKey] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [totalUsers, setTotalUsers] = useState(null);
  const [activitiesInfo, setActivitiesInfo] = useState(null);
  const [stepsInfo, setStepsInfo] = useState(null);
  const [totalActiveUsers, setTotalActiveUsers] = useState(null);
  const [totalActivities, setTotalActivities] = useState(null);
  const [totalStepsByRoleId, setTotalStepsByRoleId] = useState({});
  const [userSteps, setUserSteps] = useState([]);
  const [userIdCount, setUserIdCount] = useState({});
  const [graduatedUsers, setGraduatedUsers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [usersWithProgress, setUsersWithProgress] = useState([]);
  const [areas, setAreas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employeesByArea, setEmployeesByArea] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users");
        const users = response.data;

        // Filtra los usuarios con active = true
        const activeUsers = users.filter((user) => user.active === true);

        // Establece el total de usuarios activos en el estado
        setTotalUsers(activeUsers);
        setTotalActiveUsers(activeUsers.length);
      } catch (error) {
        console.error("Error al obtener datos de usuarios:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza una solicitud GET para obtener la lista de actividades
        const response = await axios.get("http://localhost:3001/activities");
        const activities = response.data;
        // Calcula la cantidad total de actividades
        const total = activities.length;

        // Establece la cantidad total de actividades en el estado
        setTotalActivities(total);
        setActivitiesInfo(activities);
        const totalSteps: any = {};

        activities.forEach((activity: any) => {
          const { roleId, numberSteps } = activity;
          if (roleId in totalSteps) {
            totalSteps[roleId] += numberSteps;
          } else {
            totalSteps[roleId] = numberSteps;
          }
        });

        // Establece el objeto totalStepsByRoleId en el estado
        setTotalStepsByRoleId(totalSteps);
      } catch (error) {
        console.error("Error al obtener datos de actividades:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/userStep");
        const userSteps = response.data;
        setUserSteps(userSteps);
        const count = {};

        userSteps.forEach((userStep: any) => {
          const userId = userStep.UserId;

          if (userId in count) {
            count[userId] += 1;
          } else {
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
      const graduatedUsers = totalUsers.map((user) => {
        const roleIdExists = user.roleId in totalStepsByRoleId;
        const isEmployee = user.tipo === "empleado"; // Verifica si el usuario es "empleado"

        return {
          userId: user.id,
          graduated:
            user.active && // Solo usuarios activos pueden graduarse
            isEmployee && // Verifica si el usuario es "empleado"
            roleIdExists &&
            (user.id in userIdCount ? userIdCount[user.id] : 0) >=
              totalStepsByRoleId[user.roleId],
        };
      });
      setGraduatedUsers(graduatedUsers);
    }
  }, [totalUsers, totalStepsByRoleId, userIdCount]);

  const graduatedCount = graduatedUsers?.filter(
    (user) => user.graduated
  ).length;

  const remainingCount = totalUsers?.filter(
    (user) => user.tipo === "empleado" && user.active === true
  ).length;

  // #### Grafico 1 Progreso de usuarios ####

  useEffect(() => {
    if (totalUsers) {
      const usersWithCompanyId1 = totalUsers.filter(
        (user) => user.companyId === 1
      );

      // Almacenar las etiquetas en el estado
      const usernames = usersWithCompanyId1.map((user) => user.username);
      const usersWithProgress = usersWithCompanyId1.map((user) => {
        const userId = user.id;
        const completedSteps = userIdCount[userId] || 0;
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
  }, [totalUsers, userIdCount, totalStepsByRoleId]);
  const data = {
    labels: usersWithProgress.map((user) => user.username),
    datasets: [
      {
        label: "Usuario",
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
        color: "white", // Cambia el color del texto a blanco

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
          const allRoles = [];

          for (const area of areas) {
            const response = await axios.get(
              `http://localhost:3001/roles/${area.id}`
            );
            const roles = response.data;
            allRoles.push(...roles);
          }

          setRoles(allRoles);

          // Cálculo de employeesByArea
          const calculatedEmployeesByArea = {};

          areas.forEach((area) => {
            calculatedEmployeesByArea[area.name] = 0;
          });

          totalUsers.forEach((user) => {
            const role = allRoles.find((r) => r.id === user.roleId);
            if (role) {
              const area = areas.find((a) => a.id === role.areaId);
              if (area) {
                calculatedEmployeesByArea[area.name]++;
              }
            }
          });

          // Actualizar el estado con el resultado
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
        color: "white", // Cambia el color del texto a blanco 
      },
    },
    scales: {
      x: {
        display: true, // Oculta completamente el eje X
      },
      y: {
        max: Math.max(...Object.values(employeesByArea)) + 2, // Ajusta el valor máximo del eje X
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
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        refreshChart();
      }, 500);

      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleOrientationChange = () => {
      clearTimeout(window.resizeTimeout);
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

  const hasZoomed = (prevDimensions, currentDimensions) => {
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
  // Notificaciones
  const now = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);
  const totalChanges = {};

  const momentNotifications = userSteps
    .filter((step) => step.finished)
    .map((step, index) => {
      const createdAt = new Date(step.createdAt);
      const timeDifference = now - createdAt;

      const timeParts = {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
      };

      const userId = step.UserId;
      const user = totalUsers?.find((user) => user.id === userId);
      const activityInfo = activitiesInfo[index];
      const activityName = activityInfo
        ? activityInfo.title
        : "Actividad no encontrada";

      const hoursDifference = timeParts.hours;
      const minutesDifference = timeParts.minutes;

      let timeAgo = "";

      if (hoursDifference === 0) {
        timeAgo = `hace ${minutesDifference} minutos`;
      } else if (hoursDifference === 1) {
        timeAgo = `hace 1 hora`;
      } else {
        timeAgo = `hace ${hoursDifference} horas`;
      }

      const message = `El usuario ${
        user?.username || "Usuario desconocido"
      } completó la actividad "${activityName}" ${timeAgo}.`;

      if (Object.values(timeParts).some((part) => part > 0)) {
        totalChanges[index + 1] = {
          user: user?.username || "Usuario desconocido",
          step: index + 1,
          activity: activityName,
          date: createdAt,
          message: message,
        };

        return totalChanges[index + 1];
      }
    })
    .filter((notification) => {
      return (
        notification.hoursDifference === 0 &&
        notification.minutesDifference <= 5
      );
    });

  const todayNotifications = [];
  const yesterdayNotifications = [];

  for (const stepIndex in totalChanges) {
    const change = totalChanges[stepIndex];
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
      <div className="container">
        <div className="card my-3">
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
                        <div>
                          <span className="block text-500 font-medium mb-1">
                            Usuarios:
                          </span>
                          <div className="text-900 font-medium text-xl text-center">
                            {totalActiveUsers
                              ? totalActiveUsers
                              : "Esperando usuarios..."}
                          </div>
                        </div>
                      </div>
                    </div>
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
                          Actividades:
                        </span>
                        <div className="text-900 font-medium text-xl text-center">
                          {totalActivities
                            ? totalActivities
                            : "Esperando usuarios..."}
                        </div>
                      </div>
                    </div>
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
                          {graduatedCount
                            ? graduatedCount
                            : "Esperando graduados..."}
                        </div>
                      </div>
                    </div>
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
                            : "No disponible."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid justify-center">
                <div className="col-18 lg:col-6 xl:col-7 my-2">
                  <div className="card mb-0 p-2">
                    <Link to="/admin">
                      <div style={{ width: "100%", height: "400px" }}>
                        <Bar options={options2} data={data2} />
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-18 lg:col-6 xl:col-5 my-2">
                  <div className="card mb-0 p-2">
                    <Link to="/progress">
                      <div style={{ width: "100%", height: "400px" }}>
                        <Bar options={options} data={data} />
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="card">
                  <div className="flex align-items-center justify-content-between mb-4">
                    <h5>Notificaciones</h5>
                  </div>
                  <div className="notification-section">
                    <span className="block text-600 font-medium mb-3">
                      Últimas actualizaciones
                    </span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none overflow-y-auto max-h-72">
                      {momentNotifications?.map((notification, index) => (
                        <li
                          key={index}
                          className="flex align-items-center py-2 border-bottom-1 surface-border"
                        >
                          <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-green-100 border-circle mr-3 flex-shrink-0">
                            <i className="pi pi-check text-xl text-green-500" />
                          </div>
                          <span className="text-900 line-height-3">
                            {notification.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="notification-section">
                    <span className="block text-600 font-medium mb-3">Hoy</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none overflow-y-auto max-h-72">
                      {todayNotifications?.map((notification, index) => (
                        <li
                          key={index}
                          className="flex align-items-center py-2 border-bottom-1 surface-border"
                        >
                          <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i className="pi pi-book text-xl text-blue-500" />
                          </div>
                          <span className="text-900 line-height-3">
                            {notification.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="notification-section">
                    <span className="block text-600 font-medium mb-3">
                      Ayer
                    </span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none overflow-y-auto max-h-72">
                      {yesterdayNotifications.map((notification, index) => (
                        <li
                          key={index}
                          className="flex align-items-center py-2 border-bottom-1 surface-border"
                        >
                          <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-yellow-100 border-circle mr-3 flex-shrink-0">
                            <i className="pi pi-lock text-xl text-yellow-400" />
                          </div>
                          <span className="text-900 line-height-3">
                            {notification.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* <div className="flex justify-center">
                <Button label="Escalar y Reiniciar" onClick={refreshChart} />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
