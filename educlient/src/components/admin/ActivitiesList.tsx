import { Button } from "primereact/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import { Dialog } from "primereact/dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import axios from "axios";

const ActivitiesList = ({ act, enableDrag }) => {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const dispatch = useDispatch();
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [actId, setActId] = useState(0);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: act.id, disabled: enableDrag });

  const dialogHandler = (id: number) => {
    setDisplayConfirmation(true);
    setActId(id);
  };

  const handleState = async (id: number = 1, roleId: number) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3001/activity/state?id=${id}`
      );
      dispatch(getActivitiesByRole(roleId));
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      let response = await axios.delete(
        `http://localhost:3001/activity/${actId}`
      );
      let data = response.data;
      if (data) {
        dispatch(getActivitiesByRole(Number(roleId)));
        setDisplayConfirmation(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const confirmationDialogFooter = (
    <>
      <Button
        type="button"
        label="No"
        icon="pi pi-times"
        onClick={() => setDisplayConfirmation(false)}
        text
      />
      <Button
        type="button"
        label="Sí"
        icon="pi pi-check"
        onClick={handleDelete}
        text
        autoFocus
      />
    </>
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="py-1 px-2 border rounded m-3 flex items-center hover:bg-[#182d4a] hover:text-white"
    >
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-center w-full">
          <div className="flex-1 flex flex-row md:text-left items-center gap-2">
            <div className="w-[48px] h-[48px] rounded-full bg-[#6836cc] text-white relative flex items-center justify-center">
              <div>{act.orderId + 1}</div>
            </div>
            <div className="font-bold text-2xl">{act.title}</div>
          </div>
          <div className="car-buttons">
            <Button
              disabled={!enableDrag}
              icon="pi pi-arrow-right"
              rounded
              severity="info"
              className="mx-2"
              onClick={() => navigate(`/actvitySteps/${act.id}`)}
            />
            <Button
              disabled={!enableDrag}
              icon="pi pi-pencil"
              rounded
              severity="success"
              className="mx-2"
              onClick={() => navigate(`/editActivity/${roleId}/${act.id}`)}
            />
            <Button
              disabled={!enableDrag}
              icon="pi pi-times"
              rounded
              severity="danger"
              className="mx-2"
              onClick={() => dialogHandler(act.id ?? 0)}
            />
          </div>
          <div className="mx-2">
            {act.active ? (
              <Button
                disabled={!enableDrag}
                label="Desactivar"
                severity="danger"
                outlined
                onClick={() => handleState(act.id, act.roleId)}
              />
            ) : (
              <Button
                label="Activar"
                severity="success"
                outlined
                onClick={() => handleState(act.id, act.roleId)}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog
        header="Eliminar Actividad"
        visible={displayConfirmation}
        onHide={() => setDisplayConfirmation(false)}
        style={{ width: "350px" }}
        modal
        footer={confirmationDialogFooter}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span>
            ¿Estás seguro de eliminar esta{" "}
            <strong>actividad y sus pasos</strong>?
          </span>
        </div>
      </Dialog>
    </div>
  );
};

export default ActivitiesList;
