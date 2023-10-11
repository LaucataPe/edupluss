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

  // console.log("Cantidad total de usuarios:", totalUsers);
  // console.warn("Suma Steps en Activity por roleId:", totalStepsByRoleId);
  console.warn("Total de Usuarios graduados:", graduatedUsers);
  const graduatedCount = graduatedUsers.filter((user) => user.graduated).length;
  const remainingCount = graduatedUsers.length - graduatedCount;

  console.log(
    `Usuarios graduados: ${graduatedCount}, Usuarios faltantes: ${remainingCount}`
  );
  // #### Grafico 1 Progreso de usuarios ####
  const generatePositiveRandomData = () => {
    return labels.map(() => Math.max(Math.floor(Math.random() * 200) - 100, 1));
  };

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
  const randomData2 = generatePositiveRandomData();

  const sortDataDescending = (data) => {
    return data.slice().sort((a, b) => b - a);
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Usuario 1",
        data: sortDataDescending(randomData1),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Usuario 2",
        data: sortDataDescending(randomData2),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
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
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Progreso de actividades",
      },
    },
  };

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

  return (
    <div className="flex">
      <div className="w-[100%]">
        <div className="p-5">
          <h3 className="text-xl font-semibold">
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
          <h3 className="text-xl font-semibold">
            Progreso general de Actividades:{" "}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div key={chartKey} style={{ width: "100%", height: "300px" }}>
                <Bar options={options} data={data} />
              </div>
            </div>
            Empleados por areas:{" "}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div key={chartKey} style={{ width: "100%", height: "300px" }}>
                <Bar options={options} data={data2} />
              </div>
            </div>
            Empleados activos y su progreso:{" "}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div key={chartKey} style={{ width: "100%", height: "500px" }}>
                <Scatter options={scatterOptions} data={scatterData} />
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
