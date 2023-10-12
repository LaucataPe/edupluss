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
    if (totalUsers && totalStepsByRoleId && userIdCount) {
      // Comparación para determinar si un usuario ha "graduado"
      const graduatedUsers = totalUsers.map((user) => ({
        userId: user.id,
        graduated:
          user.active && // Solo usuarios activos pueden graduarse
          (user.id in userIdCount ? userIdCount[user.id] : 0) >=
            (user.roleId in totalStepsByRoleId
              ? totalStepsByRoleId[user.roleId]
              : 0),
      }));
      setGraduatedUsers(graduatedUsers);
    }
  }, [totalUsers, totalStepsByRoleId, userIdCount]);
  const graduatedCount = graduatedUsers.filter((user) => user.graduated).length;
  const remainingCount = graduatedUsers.length - graduatedCount;

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
        color: "black",
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
        if (logUser && logUser.tipo === "admin") {
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

  console.log("employeesByArea", employeesByArea);
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
        color: "black",
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

  return (
    <div className="flex">
      <div className="w-[100%]">
        <div className="p-5">
          <h3 className="text-xl font-semibold ">
            Graduados:{" "}
            {graduatedCount ? graduatedCount : "Esperando graduados..."} y
            faltan: {remainingCount ? remainingCount : "Esperando graduados..."}{" "}
            entonces
          </h3>
          <strong>
            {" "}
            Porcentaje de graduados:{" "}
            {graduatedCount && remainingCount
              ? ((graduatedCount / remainingCount) * 100).toFixed(2) + "%"
              : "No se puede calcular el porcentaje en este momento."}
          </strong>
          <h3 className="text-xl font-semibold">
            Numero de usuarios activos:{" "}
            {totalActiveUsers ? totalActiveUsers : "Esperando usuarios..."}
          </h3>
          <h3 className="text-xl font-semibold">
            Numero de actividades activas:{" "}
            {totalActivities ? totalActivities : "Esperando usuarios..."}
          </h3>
          <h3 className="text-xl font-semibold" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "40%", height: "400px" }}>
                <Bar options={options2} data={data2} />
              </div>
              <div style={{ width: "40%", height: "400px" }}>
                <Bar options={options} data={data} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}></div>
          </h3>
          <Button label="Escalar y Reiniciar" onClick={refreshChart} />
          {/* {false && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-0 rounded-md shadow-md"></div>
            </div>
          )} */}
          <div className="flex"></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
