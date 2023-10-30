import { DataTable } from "primereact/datatable";
import { useEffect, useState, useRef } from "react";
import { Empresa } from "../../utils/interfaces";
import axios from "axios";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";

const SuperAdminHome = () => {
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string>("");
  const [currentNIT, setCurrentNIT] = useState<number>(0);
  const [switchActiveValue, setSwitchActiveValue] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [currentRow, setCurrentRow] = useState<Empresa>({
    id: 0,
    name: "",
    nit: 0,
    active: false,
  });
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const getCompanies = async () => {
      const res = await axios("http://localhost:3001/empresas");
      const { data } = res;
      if(data){
        setCompanies(data);
      }else {
        console.error("Ha ocurrido un error al obtener las empresas.")
      }
    };
    getCompanies();
  }, [isActivated]);

  useEffect(()=>{
    setCurrentRow({
      id: 0,
      name: "",
      nit: 0,
      active: false,
    })
  },[showCreate])

  const openCreateCompany = () => {
    setShowCreate(true);
  };

  const openEditCompany = (row: Empresa) => {
    setCurrentRow(row);
    setSwitchActiveValue(row.active);
    setCurrentName(row.name);
    setCurrentNIT(row.nit);
    setShowEdit(true);
  };

  const tableHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Gestionar Empresas</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setFilter(e.currentTarget.value)}
          placeholder="Buscar..."
        />
      </span>
      <Button
        label="Nuevo"
        icon="pi pi-plus"
        className="p-button-success mr-2"
        onClick={openCreateCompany}
      />
    </div>
  );

  const activeTemplate = (row: Empresa) => {
    return (
      <span
        className={`p-badge ${
          row.active ? "p-badge-success" : "p-badge-secondary"
        }`}
      >
        {row.active ? "Sí" : "No"}
      </span>
    );
  };

  const actionBodyTemplate = (row: Empresa) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          className="mr-1 p-button-success"
          onClick={() => openEditCompany(row)}
        />
      </>
    );
  };

  const handleChangeEditCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRow({
      ...currentRow,
      [name]: value,
    });
  };

  const handleSubmitEdit = async () => {
    try {
      const body = {
        ...currentRow,
        active: switchActiveValue,
      };
      //@ts-ignore
      body.nit = parseInt(body.nit)
      
      const response = await axios.patch("http://localhost:3001/empresa/update", body);
      if(response){
        setIsActivated(!isActivated);
        setCurrentRow({
          id: 0,
          name: "",
          nit: 0,
          active: false,
        })
        setShowEdit(false);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Se ha editado la información de la empresa.",
          life: 3000,
        });
      }else {
        console.error("Ha ocurrido un error al actualizar la empresa.")
      }
      //? Agregar un toast de error?
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Ups, algo salio mal!",
        detail: "No se pudo actualizar la empresa.",
        life: 3000,
      });
    }
  };

  const handleSubmitCreate = async () => {
    try {
      const body = {
        ...currentRow,
      };
      //@ts-ignore
      body.nit = parseInt(body.nit)

      const response = await axios.post("http://localhost:3001/empresa", body);
      if (response) {
        setIsActivated(!isActivated);
        setShowCreate(false);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Se ha creado la empresa.",
          life: 3000,
        });
      }else {
        console.error("Ha ocurrido un error al crear la empresa.")
      }
      //? Agregar un mensaje o toast de error
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Ups, algo salio mal!",
        detail: "No se puedo crear la empresa.",
        life: 3000,
      });
    }
  };

  const editCompanyfooter = (action: string) => {
    return (
      <>
        <Button
          label="Cancelar"
          rounded
          icon="pi pi-times"
          onClick={
            action === "create"
              ? () => setShowCreate(false)
              : () => setShowEdit(false)
          }
        />

        <Button
          label="Confirmar"
          rounded
          icon="pi pi-check"
          onClick={action === "create" ? handleSubmitCreate : handleSubmitEdit}
        />
      </>
    );
  };

  return (
    <section className="relative md:px-2 bg-white h-[calc(100vh-96px)]">
      <Toast ref={toast} />

      <DataTable
        value={companies}
        scrollable
        header={tableHeader}
        globalFilter={filter}
        className="datatable-responsive p-datatable-responsive  overflow-auto"
      >
        <Column field="id" header="ID" sortable />
        <Column field="name" header="Empresa" sortable />
        <Column field="nit" header="NIT" sortable />
        <Column field="active" header="Activo" body={activeTemplate} sortable />
        <Column body={actionBodyTemplate}></Column>
      </DataTable>

      <Dialog
        visible={showCreate}
        header="Crear nueva empresa"
        style={{ width: "400px" }}
        onHide={() => setShowCreate(false)}
        footer={editCompanyfooter("create")}
      >
        <div className="flex flex-col py-2">
          <label htmlFor="nombre" className="mb-2">
            Nombre de la empresa
          </label>
          <InputText
            id="nombre"
            name="name"
            onChange={handleChangeEditCompany}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="flex flex-col py-2">
          <label htmlFor="NIT" className="mb-2">
            NIT
          </label>
          <InputText
            id="NIT"
            name="nit"
            onChange={handleChangeEditCompany}
            placeholder="NIT"
            required
          />
        </div>
      </Dialog>

      <Dialog
        visible={showEdit}
        header="Editar empresa"
        style={{ width: "400px" }}
        onHide={() => setShowEdit(false)}
        footer={editCompanyfooter("edit")}
      >
        <div className="flex flex-col py-2">
          <label htmlFor="nombre" className="mb-2">
            Nombre de la empresa
          </label>
          <InputText
            id="nombre"
            name="name"
            onChange={handleChangeEditCompany}
            value={currentRow.name}
            placeholder={`Nombre actual: ${currentName}`}
            required
          />
        </div>
        <div className="flex flex-col py-2">
          <label htmlFor="NIT" className="mb-2">
            NIT
          </label>
          <InputText
            id="NIT"
            name="nit"
            onChange={handleChangeEditCompany}
            placeholder={`NIT actual: ${currentNIT}`}
            //@ts-ignore
            value={currentRow.nit}
            required
          />
        </div>
        <div className="flex py-2">
          <label htmlFor="active" className="mr-2">
            Activo
          </label>
          <InputSwitch
            id="active"
            checked={switchActiveValue}
            onChange={(e) => setSwitchActiveValue(e.value ?? false)}
          />
        </div>
      </Dialog>
    </section>
  );
};

export default SuperAdminHome;
