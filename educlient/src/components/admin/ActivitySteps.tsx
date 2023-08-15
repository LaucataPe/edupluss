import { useSelector} from "react-redux";
import {useEffect, useState} from 'react'
import { RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getStepsActivity } from "../../redux/features/stepsSlider";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';

import { LayoutType } from '../../utils/types/types';
import { Step } from "../../utils/interfaces";
import axios from "axios";


function ActivitySteps() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const steps = useSelector((state: RootState) => state.steps.steps)
    const activities = useSelector((state: RootState) => state.activities.activities)
    const role = useSelector((state: RootState) => state.roles.currentRole)

    const [layout, setLayout] = useState<LayoutType>('list');
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [stepId, setStepId] = useState(0);

    useEffect(() => {
      dispatch(getStepsActivity(Number(id)));
    }, []);
    
    const name = activities.find((activity) => activity.id === Number(id))

    const dataViewHeader = (
      <div className="flex md:flex-row md:justify-content-between items-center">
          <p className="text-5xl m-0">{name ? name.title : 'No se encontró la actividad'}</p>
          <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as LayoutType)} />
      </div>
    );

    const dialogHandler = (id: number) => {
        setDisplayConfirmation(true)
        setStepId(id)
    }

    const dataviewListItem = (data: Step) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center px-3 w-full">
                <img src='https://images.pexels.com/photos/15401447/pexels-photo-15401447/free-photo-of-texto-cartas-dados-fondo-blanco.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                         alt='Foto Random' className="w-2 shadow-2 my-2 mx-0" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <span className="font-semibold"> Paso #{data.number}</span>
                        <div className="font-bold text-xl">{data.title}</div>   
                    </div>
                    <div className="car-buttons">
                        <Link to={`/editStep/${data.activityId}/${data.id}`}><Button rounded severity="success" className="mr-2" icon="pi pi-pencil"></Button></Link> 
                        <Button rounded severity="danger" icon="pi pi-times" onClick={() => dialogHandler(data.id ?? 0)}></Button>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data: Step) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <img src='https://images.pexels.com/photos/15401447/pexels-photo-15401447/free-photo-of-texto-cartas-dados-fondo-blanco.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                         alt='Foto Random' className="w-9 shadow-2 my-3 mx-0" />
                        <span className="font-semibold"> Paso #{data.number}</span>
                        <div className="text-xl font-bold">{data.title}</div>
                    </div>
                    <div className="car-buttons text-center">
                        <Link to={`/editStep/${data.activityId}/${data.id}`}><Button rounded severity="success" className="mr-2" icon="pi pi-pencil"></Button></Link> 
                        <Button rounded severity="danger" icon="pi pi-times" onClick={() => dialogHandler(data.id ?? 0)}></Button>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data: Step, layout: LayoutType) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    const handleDelete = async () =>{
        try {
            let response = await axios.delete(`https://api.colkrea.com/step/${stepId}`);
            let data = response.data;
            if(data){
                dispatch(getStepsActivity(Number(id)));
                setDisplayConfirmation(false)
            } 
         } catch (error: any) {
          console.log(error);          
         }
    }

    const confirmationDialogFooter = (
        <>
            <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} text />
            <Button type="button" label="Sí" icon="pi pi-check" onClick={handleDelete} text autoFocus />
        </>
      );
    
    return (
        <>
        <Link to={`/activities/${role.id}`}><Button icon="pi pi-angle-double-left" label="Atrás" className="mt-3 mx-2" rounded severity="secondary" /></Link>
        <div className="list-demo relative">
                <div className="col-12">
                    <div className="card h-[700px] overflow-auto">
                        <DataView value={steps} emptyMessage="No hay pasos en este actividad" layout={layout} rows={9}  itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                    </div>
                </div>
            <Link to={`/addStep/${id}`}><Button label="+ Crear Paso" severity="info" rounded 
            className="absolute right-4 bottom-4 "/></Link>
        </div>

        <Dialog header="Eliminar Paso" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>¿Estás seguro que desea eliminar este paso?</span>
            </div>
        </Dialog>
      </>
    );
  }
  
  export default ActivitySteps;