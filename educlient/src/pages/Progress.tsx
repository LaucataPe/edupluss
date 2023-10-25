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

function Progress() {
  const dispatch = useAppDispatch();
  const currentUsers = useSelector((state: RootState) => state.user.users);
  const currentEmpresa = useSelector(
    (state: RootState) => state.user.logUser.companyId
  );
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
  const [generalProgress, setGeneralProgress] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [visibleUsers, setVisibleUsers] = useState(5);

  const handleShowMore = () => {
    setVisibleUsers(visibleUsers + 5);
  };

  const handleCollapseAll = () => {
    setVisibleUsers(5);
  };

  const itemsPerPage = 3;

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

  const totalPages = Math.ceil(Object.keys(usersByRole).length / itemsPerPage);
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
        const response = await axios.get("http://localhost:3001/userStep");
        setUserSteps(response.data);
      } catch (error) {
        console.error("Error al obtener datos de UserSteps:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userSteps.length > 0 && currentUsers.length > 0) {
      //@ts-ignore
      const uniqueUserIds = [...new Set(userSteps.map((step) => step.UserId))]; //@ts-ignore
      const roleIds = uniqueUserIds.map((userId) => {
        const user = currentUsers.find((user) => user.id === userId);
        if (user && user.roleId !== undefined) {
          return user.roleId;
        } else {
          console.warn("aun no hay roles");
        }
      });
      //@ts-ignore

      setUsersRoles([uniqueUserIds, roleIds]);
    }
  }, [userSteps, currentUsers]);

  useEffect(() => {
    const userIds: any = [];
    const stepsCount: any = [];

    userSteps.forEach((step) => {
      //@ts-ignore
      const userId = step.UserId;
      const userIndex = userIds.indexOf(userId);

      if (userIndex === -1) {
        userIds.push(userId);
        stepsCount.push(1);
      } else {
        stepsCount[userIndex]++;
      }
    });

    setUserStepsInfo([userIds, stepsCount]);
  }, [userSteps]);

  useEffect(() => {
    if (userSteps.length > 0 && currentUsers.length > 0) {
      const usersRolesTemp = [[], []];

      //@ts-ignore
      usersRolesTemp[0] = [...new Set(userSteps.map((step) => step.UserId))];
      //@ts-ignore
      usersRolesTemp[1] = usersRolesTemp[0].map((userId) => {
        const user = currentUsers.find((user) => user.id === userId);
        if (user && user.roleId !== undefined) {
          return user.roleId;
        } else {
          console.warn("aun no hay roles");
        }
      });

      if (usersRolesTemp[1] && usersRolesTemp[1].length > 0) {
        const validRoleIds = usersRolesTemp[1].filter(
          (roleId) => roleId !== undefined
        );

        validRoleIds.forEach((roleId) => {
          const activitiesWithRoleId = activities.filter(
            (activity) => activity.roleId === roleId
          );
          const sumOfNumberSteps = activitiesWithRoleId.reduce(
            //@ts-ignore
            (total, activity) => total + activity.numberSteps,
            0
          );

          setRoleIdSum((prevRoleIdSum) => ({
            ...prevRoleIdSum,
            [roleId]: sumOfNumberSteps,
          }));
        });
      } else {
        if (userSteps.length === 0) {
          console.warn("No hay pasos de usuario disponibles");
        }
        if (currentUsers.length === 0) {
          console.warn("Esperando roles");
        }
      }
    }
  }, [userSteps, activities, currentUsers]);

  const handleButtonClick = (userId: any) => {
    setShowProgressModal(true);
    setSelectedUserId(userId);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
  };

  const userIds = userStepsInfo[0];
  const stepsCount = userStepsInfo[1];

  useEffect(() => {
    const newProgress: any = [];

    userIds.forEach((userId, index) => {
      const userRoleId = usersRoles[1][usersRoles[0].indexOf(userId)];
      if (userRoleId !== undefined) {
        const totalStepsForRole =
          roleIdSum[usersRoles[1][usersRoles[0].indexOf(userId)]];
        const progress = Math.floor(
          (stepsCount[index] / totalStepsForRole) * 100
        );

        newProgress.push({ userId, progress });
      } else {
        newProgress.push({ userId, progress: 0 });
      }
    });

    setGeneralProgress(newProgress);
  }, [userIds, stepsCount, usersRoles, roleIdSum]);

  return (
    <div className="flex">
      <div className="container">
        <div className="card my-3 mx-3">
          <div className="w-[100%]">
            <div className="p-5">
              <h3 className="text-xl font-semibold">
                Progreso general de Actividades:{" "}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    rounded
                    severity="info"
                    icon="pi pi-arrow-left"
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage((prevPage) => prevPage - 1);
                      }
                    }}
                    disabled={currentPage === 1}
                    className="btn btn-primary"
                  ></Button>
                  <Button
                    rounded
                    severity="info"
                    icon="pi pi-arrow-right"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((prevPage) => prevPage + 1);
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className="btn btn-primary"
                    style={{ marginLeft: "10px" }}
                  ></Button>
                </div>
              </h3>

              {showProgressModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
                  <div className="dark:bg-[whitesmoke] bg-[#040d19] p-0 rounded-md shadow-md">
                    <ProgressModal
                      activities={activities}
                      closeModal={closeProgressModal}
                      userSteps={userSteps}
                      selectedUser={selectedUserId}
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
                      <div className=" border-[#0b213f] shadow-2xl p-4 rounded-2xl">
                        <h4>{roleName}</h4>
                        {users
                          .map((user) => (
                            <div
                              key={user.id}
                              className={`card mb-3 text-center ${
                                user.progress === 0 ? "gray-card" : ""
                              }`}
                            >
                              <strong>{user.username}</strong>
                              <div className="col-10 col-xl-3 mx-auto">
                                <ProgressBar
                                  value={
                                    generalProgress.find(
                                      //@ts-ignore
                                      (item) => item.userId === user.id //@ts-ignore
                                    )?.progress || 0
                                  }
                                />
                                <div className="col-6 col-xl-3 mx-auto">
                                  <Button
                                    rounded //@ts-ignore
                                    severity={
                                      generalProgress.find(
                                        //@ts-ignore
                                        (item) => item.userId === user.id //@ts-ignore
                                      )?.progress <= 100 &&
                                      generalProgress.find(
                                        //@ts-ignore
                                        (item) => item.userId === user.id //@ts-ignore
                                      )?.progress > 0
                                        ? "primary"
                                        : "secondary"
                                    }
                                    icon="pi pi-arrow-right"
                                    onClick={() => handleButtonClick(user.id)}
                                  ></Button>
                                </div>
                              </div>
                            </div>
                          ))
                          .slice(0, visibleUsers)}
                        {users.length > visibleUsers && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              {visibleUsers > 5 && (
                                <Button
                                  onClick={handleCollapseAll}
                                  severity="danger"
                                >
                                  Ver menos
                                </Button>
                              )}
                            </div>
                            <Button onClick={handleShowMore} severity="info">
                              Ver más
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
