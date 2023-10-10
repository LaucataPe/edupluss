import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { getCompanyRoles } from "../redux/features/roleSlice";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getUsersByCompany } from "../redux/features/userSlice";
import { fetchActivities } from "../redux/features/activitiesSlice";
import ProgressModal from "../components/ProgressModal";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const dispatch = useAppDispatch();
  const currentUsers = useSelector((state: RootState) => state.user.users);
  const currentEmpresa = useSelector(
    (state: RootState) => state.user.logUser.companyId
  );
  const roles = useSelector((state: RootState) => state.roles.roles);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const usersByRole: { [roleName: string]: any[] } = {};

  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );

  const [chartKey, setChartKey] = useState(0); // Estado para controlar el gráfico
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Función para generar valores aleatorios positivos mayores que 0
  const generatePositiveRandomData = () => {
    return labels.map(() => Math.max(Math.floor(Math.random() * 200) - 100, 1));
  };

  // Generar valores aleatorios iniciales
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

  // Función para ordenar los datos de manera descendente
  const sortDataDescending = (data) => {
    return data.slice().sort((a, b) => b - a);
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Usuario 1",
        data: sortDataDescending(randomData1), // Ordenar los datos de Dataset 1
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Usuario 2",
        data: sortDataDescending(randomData2), // Ordenar los datos de Dataset 2
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

  // Función para volver a renderizar el gráfico
  const refreshChart = () => {
    setChartKey(chartKey + 1);
  };

  useEffect(() => {
    // Función para manejar el evento de cambio de tamaño de la ventana
    const handleResize = () => {
      // Después de un retraso de 2 segundos, vuelve a renderizar el gráfico
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        refreshChart();
      }, 500);

      // Actualizar las dimensiones de la ventana
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Función para manejar el evento de cambio de orientación del dispositivo o zoom
    const handleOrientationChange = () => {
      // Después de un retraso de 2 segundos, vuelve a renderizar el gráfico
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        refreshChart();
      }, 500);

      // Actualizar las dimensiones de la ventana
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Agregar escuchadores de eventos para el cambio de tamaño y cambio de orientación
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Retirar los escuchadores de eventos cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []); // La matriz vacía [] asegura que este efecto solo se ejecute una vez al montar el componente

  // Compara las dimensiones antes y después del cambio de tamaño para detectar un cambio de zoom
  const hasZoomed = (prevDimensions, currentDimensions) => {
    const widthChange = prevDimensions.width !== currentDimensions.width;
    const heightChange = prevDimensions.height !== currentDimensions.height;
    return widthChange || heightChange;
  };

  useEffect(() => {
    // Compara las dimensiones antes y después del cambio de tamaño para detectar un cambio de zoom
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
          <h3 className="text-xl font-semibold">
            Progreso general de Actividades:{" "}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {/* Envuelve el componente Bar en un contenedor con un tamaño relativo */}
              <div key={chartKey} style={{ width: "100%", height: "300px" }}>
                <Bar options={options} data={data} />
              </div>
            </div>
            <div>Acá</div>
          </h3>
          {/* Botón para volver a renderizar el gráfico */}
          <Button label="Escalar y Reiniciar" onClick={refreshChart} />
          {showProgressModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-0 rounded-md shadow-md"></div>
            </div>
          )}
          <div className="flex"></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
