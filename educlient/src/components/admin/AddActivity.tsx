import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Activity } from "../../utils/interfaces";
import { RootState } from "../../redux/store";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
  getCompanyRoles,
  setCurrentRole,
} from "../../redux/features/roleSlice";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import {
  handleActivityCreatedModal,
  handleActivityEditedModal,
} from "../../redux/features/utilsSlice";

function AddActivity() {
  const { roleId, orderId, actId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const roles = useSelector((state: RootState) => state.roles.roles);
  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const currentRole = useSelector(
    (state: RootState) => state.roles.currentRole
  );
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const [activity, setActivity] = useState<Activity>({
    title: "",
    roleId: currentRole.id ?? 0,
    orderId: Number(orderId),
  });
  const [error, setError] = useState();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(getCompanyRoles(logUser.companyId));
    }
    const findRole = roles.find((role) => role.id === Number(roleId));
    if (currentRole.id === 0 && findRole?.id) {
      dispatch(setCurrentRole(findRole));
      if (!actId) {
        setActivity({ ...activity, roleId: findRole.id });
      }
    }
  }, [roles, logUser]);

  useEffect(() => {
    if (actId) {
      if (activities.length === 0 && roleId) {
        dispatch(getActivitiesByRole(Number(roleId)));
      }
      const findActivity = activities.find((act) => act.id === Number(actId));
      if (findActivity) {
        setActivity({ title: findActivity.title, roleId: findActivity.roleId });
      }
    }
  }, [actId, roles]);

  const handleSubmit = async () => {
    if (activity.roleId !== 0) {
      try {
        const response = await axios.post(
          "http://localhost:3001/activity",
          activity
        );
        if (response) {
          // console.log("soy activities submited");
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          dispatch(getActivitiesByRole(Number(roleId)));
          dispatch(handleActivityCreatedModal(true));
          navigate(`/activities/${roleId}`);
        }
        setActivity({
          title: "",
          roleId: 0,
        });
      } catch (error: any) {
        setError(error);
      }
    } else {
      return toast.current?.show({
        severity: "error",
        summary: "Error!",
        detail: "Ha ocurrido un error",
        life: 2000,
      });
    }
  };

  const handleEdit = async () => {
    if (activity.roleId !== 0) {
      const data = { id: Number(actId), title: activity.title };
      try {
        const response = await axios.patch(
          "http://localhost:3001/activity/update",
          data
        );
        if (response) {
          // toast.current?.show({
          //   severity: "success",
          //   summary: "Editado!",
          //   detail: "Actividad editada",
          //   life: 2000,
          // });
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          dispatch(getActivitiesByRole(Number(roleId)));
          dispatch(handleActivityEditedModal(true));
          navigate(`/activities/${roleId}`);
        }
        setActivity({
          title: "",
          roleId: 0,
        });
      } catch (error: any) {
        setError(error);
      }
    } else {
      return toast.current?.show({
        severity: "error",
        summary: "Error!",
        detail: "Ha ocurrido un error",
        life: 2000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Link to={`/activities/${roleId}`}>
        <Button
          icon="pi pi-angle-double-left"
          label="Atrás"
          className="m-2"
          rounded
          severity="secondary"
        />
      </Link>
      <div className="card p-fluid my-3 mx-[10%]">
        {actId ? <h5>Editando Actividad</h5> : <h5>Creando Actividad</h5>}
        <div className="field">
          <label>Nombre</label>
          <InputText
            type="text"
            value={activity.title}
            onChange={(e) =>
              setActivity({ ...activity, title: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label>Cargo</label>
          <InputText type="text" value={currentRole?.name} disabled />
        </div>
        <Button
          label={actId ? "Editar" : "Crear Actividad"}
          severity="info"
          onClick={actId ? handleEdit : handleSubmit}
          disabled={
            activity.title.length > 0 && activity.roleId !== 0 ? false : true
          }
        />
      </div>
      <p className="text-red-500 font-semibold">{error}</p>
    </>
  );
}

export default AddActivity;
