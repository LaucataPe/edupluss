import { useSelector} from "react-redux";
import {useEffect, useState} from 'react'
import { RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getStepsActivity } from "../../redux/features/stepsSlider";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

import { LayoutType } from '../../utils/types/types';
import { Step } from "../../utils/interfaces";


function ActivitySteps() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const steps = useSelector((state: RootState) => state.steps.steps)
    const activities = useSelector((state: RootState) => state.activities.activities)

    const [layout, setLayout] = useState<LayoutType>('grid');

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

    const dataviewListItem = (data: Step) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb0F6jSm5InKXo4zd2UdiyuE0k36u1ZzHBEw&usqp=CAU'
                         alt='Foto Random' className="w-2 shadow-2 my-3 mx-0" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <span className="font-semibold"> Paso #{data.number}</span>
                        <div className="font-bold text-2xl">{data.title}</div>   
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
                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb0F6jSm5InKXo4zd2UdiyuE0k36u1ZzHBEw&usqp=CAU'
                         alt='Foto Random' className="w-9 shadow-2 my-3 mx-0" />
                        <span className="font-semibold"> Paso #{data.number}</span>
                        <div className="text-2xl font-bold">{data.title}</div>
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
    
    return (
      <>
      <Link to={`/admin`}><Button icon="pi pi-angle-double-left" label="Atrás" className="m-2" rounded severity="secondary" /></Link>
      <div className="list-demo relative">
            <div className="col-12">
                <div className="card">
                    <DataView value={steps} emptyMessage="No hay pasos en este actividad" layout={layout} rows={9}  itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                </div>
            </div>
      <Link to={`/addStep/${id}`}><Button label="+ Añadir Paso" severity="info" rounded 
        className="absolute right-4 bottom-4 "/></Link>
      </div>
      </>
    );
  }
  
  export default ActivitySteps;