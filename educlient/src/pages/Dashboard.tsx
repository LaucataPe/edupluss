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
import { Bar, Scatter } from "react-chartjs-2"; // Añade Scatter aquí si aún no lo has importado

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
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
  const [label, setLabel] = useState("Cargando...");

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
  console.log(
    "totalStepsByRoleId (Maximo de pasos que necesitan tener para finalizar una actividad segun el rol):",
    totalStepsByRoleId,
    "totalUsers (Info de usuarios con su roleId adentro):",
    "userSteps (Progreso total de todos los userId):",
    userSteps,
    "userIdCount (Progreso individual por userId): ",
    userIdCount
  );
  // console.warn("Suma Steps en Activity por roleId:", totalStepsByRoleId);
  // console.warn("Total de Usuarios graduados:", graduatedUsers);

  // console.log(
  //   `Usuarios graduados: ${graduatedCount}, Usuarios faltantes: ${remainingCount}`
  // );

  // #### Grafico 1 Progreso de usuarios ####

  useEffect(() => {
    if (totalUsers) {
      const usersWithCompanyId1 = totalUsers.filter(
        (user) => user.companyId === 1
      );
      const usernames = usersWithCompanyId1.map((user) => user.username);

      if (usernames.length > 0) {
        setLabel(usernames);
      } else {
        setLabel("No se encontraron usuarios");
      }
    }
  }, [totalUsers]);
  const generatePositiveRandomData = () => {
    return labels.map(() => Math.max(Math.floor(Math.random() * 200) - 100, 1));
  };
  useEffect(() => {
    if (totalUsers && totalStepsByRoleId && userIdCount) {
      const first5UserIds = [1, 2, 3, 4, 5];

      // Inicializar un objeto para almacenar el progreso de los primeros 5 usuarios
      const progressData = {};

      // Calcular el progreso para los primeros 5 usuarios
      first5UserIds.forEach((userId) => {
        const roleId = totalUsers.find((user) => user.id === userId)?.roleId;
        const totalSteps = totalStepsByRoleId[roleId] || 0;
        const individualProgress = userIdCount[userId] || 0;

        // Calcular el progreso individual * 100 / total de pasos requeridos según el rol
        const progress = (individualProgress * 100) / totalSteps;

        // Utiliza userId como clave en lugar de un índice fijo
        progressData[`Usuario ${userId}`] = progress;
      });

      // Actualizar los datos en el objeto data
      data.datasets[0].data = first5UserIds.map(
        (userId) => progressData[`Usuario ${userId}`]
      );

      console.warn(data.datasets[0].data);
    }
  }, [totalUsers, totalStepsByRoleId, userIdCount]);

  //Esto es en general, excepto el primer graficos
  const labels = [
    "Actividad 1",
    "Actividad 2",
    "Actividad 3",
    "Actividad 4",
    "Actividad 5",
    "Actividad 6",
    "Actividad 7",
  ];
  const randomData1 = generatePositiveRandomData();
  // const randomData2 = generatePositiveRandomData();

  const sortDataDescending = (data) => {
    return data.slice().sort((a, b) => b - a);
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Usuario",
        data: sortDataDescending(randomData1),
        borderColor: "#9dc065",
        backgroundColor: "#8ec640",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left" as const,
      },
      title: {
        display: true,
        text: "Progreso de actividades",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        display: "auto", // Configuración para mostrar los valores encima de las barras
        color: "black",
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
        grid: {
          display: false, // Establece display en false para ocultar las líneas de la cuadrícula en el eje X
        },
      },
      y: {
        max: 100, // Establece el valor máximo en el eje Y en 100

        grid: {
          display: false, // Establece display en false para ocultar las líneas de la cuadrícula en el eje Y
        },
      },
    },
  };

  // #### Grafico 2 Empleados por areas ####

  const randomData3 = generatePositiveRandomData();
  const randomData4 = generatePositiveRandomData();

  const data2 = {
    labels,
    datasets: [
      {
        label: "Usuario 3",
        data: sortDataDescending(randomData3),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Usuario 4",
        data: sortDataDescending(randomData4),
        borderColor: "rgb(255, 205, 86)",
        backgroundColor: "rgba(255, 205, 86, 0.5)",
      },
    ],
  };

  // #### Grafico 3 Empleados activos y su progreso ####

  function generateRandomData(numPoints) {
    const data = [];

    for (let i = 0; i < numPoints; i++) {
      data.push({
        x: Math.floor(Math.random() * 85),
        y: Math.floor(Math.random() * 100),
      });
    }

    return data;
  }

  const scatterOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const scatterData = {
    datasets: [
      {
        label: "Usuario",
        data: generateRandomData(15),
        backgroundColor: "rgba(255, 99, 132, 1)",
        pointRadius: 20,
      },
      {
        label: "Actividades",
        data: generateRandomData(15),
        backgroundColor: "#0bc8e1",
        pointRadius: 15,
      },
      {
        label: "Progreso",
        data: generateRandomData(15),
        backgroundColor: "#10481a",
        pointRadius: 5,
      },
    ],
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
            Progreso general de Usuarios:{" "}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div key={chartKey} style={{ width: "60%", height: "500px" }}>
                <Bar options={options} data={data} />
              </div>
            </div>
            Empleados por areas:{" "}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div key={chartKey} style={{ width: "60%", height: "300px" }}>
                <Bar options={options} data={data2} />
              </div>
            </div>
            <div>Acá</div>
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
