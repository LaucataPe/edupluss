//@ts-nocheck
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Empresa, User } from "../../utils/interfaces";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getUsersByCompany } from "../../redux/features/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getCompanyRoles } from "../../redux/features/roleSlice";
import { Demo } from "../../utils/types/demo";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";

const UserByCompany = () => {
  const dispatch = useAppDispatch();
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const roles = useSelector((state: RootState) => state.roles.roles);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(true);
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [users, setUsers] = useState<Demo.User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Demo.User[]>([]);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false); 
  const [selectedUsers, setSelectedUsers] = useState<Demo.User[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activePassword, setActivePassword] = useState<boolean>(false);
  const dt = useRef<DataTable<Demo.User[]>>(null);
  const toast = useRef<Toast>(null);

  const emptyUser: Demo.User = {
    id: 0,
    username: "",
    email: "",
    password: "",
    active: false,
    tipo: "",
    avatarImage: "",
    companyId: logUser.companyId,
    roleId: 0,
  };
  
  interface InputValue {
    name: string;
    value: string;
}
let [user, setUser] = useState<Demo.User>(emptyUser);


  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await axios("http://localhost:3001/empresas");
        if(response){
          setCompanies(response.data);
        } else {
          console.error("Ha ocurrido un error al obtener las compañias.")
        }
      } catch (error) {
        console.error(error)
      }
    };
    if(logUser.id !== 0){
      getCompanies();
      //fetchUsers();
    }
  }, [logUser.id]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios("http://localhost:3001/users");
        if(response){
          const usersFiltered = response.data.filter((user : User)=> user.id !== logUser?.id)
          setUsers(usersFiltered);
        } else {
          console.error("Ha ocurrido un error al obtener los usuarios.")
        }
      } catch (error) {
        console.error(error)
      }
    };
    if (logUser.id !== 0) {
      getUsers();
    }
  }, [isActivated, logUser.id]);


  const onOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
   
    if (value === 'all') {
      setFlag(true);
      setFilteredUsers(users);
    } else if (value === 'superadmins') {
      setFlag(false);
      const superadmins = users.filter((user) => user.tipo === "superadmin");
      setFilteredUsers(superadmins);
    } else {
      setFlag(false);
      const selectedCompanyId = parseInt(value);
      const filtered = users.filter((user) => user.companyId === selectedCompanyId);
      setFilteredUsers(filtered);
    }
  };

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
    setActivePassword(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  let dropdownValues: InputValue[] = [
    { name: "Admin", value: "admin" },
    { name: "Superadmin", value: "superadmin" },
  ];

  const saveUser = async () => {
    setSubmitted(true);

    if (user.username.trim() && user.email.trim() && user.tipo.trim()) {
      if (user.id !== 0) {
        // Filtra las propiedades con cadenas no vacías o null
        user = Object.fromEntries(
          Object.entries(user).filter(([_, value]) => value !== "" && value !== null)
        ) as Demo.User;
        try {
          const { data } = await axios.patch(
            "http://localhost:3001/user/patch",
            user
          );
          if (data) {
            if (data.tipo === "empleado" || data.tipo === "admin") {
              //@ts-ignore
              dispatch(getUsersByCompany(user.companyId)); 
              setIsActivated(!isActivated);
              
              if (flag === false) {
                const updatedFilteredUsers = [...filteredUsers];
                const userIndex = updatedFilteredUsers.findIndex((u) => u.id === user.id);
                if (userIndex !== -1) {
                  updatedFilteredUsers[userIndex] = user;
                  setFilteredUsers(updatedFilteredUsers);
                }
              }
            } else if(data.tipo === "superadmin"){
              setIsActivated(!isActivated);
              if (flag === false) {
                const updatedFilteredUsers = [...filteredUsers];
                const userIndex = updatedFilteredUsers.findIndex((u) => u.id === user.id);
                if (userIndex !== -1) {
                  updatedFilteredUsers[userIndex] = user;
                  setFilteredUsers(updatedFilteredUsers);
                }
              }
            }
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Usuario actualizado",
              life: 3000,
            });
          }
        } catch (error: any) {
          console.log(error);
        }
      } else {
        try {
          if(user.roleId === 0){
            user.roleId = null;
          }
          
          const { data } = await axios.post("http://localhost:3001/user", user);
          if (data) {
            if (data.tipo === "admin") {
              //@ts-ignore
              dispatch(getUsersByCompany(user.companyId));
              setIsActivated(!isActivated); 
              if (flag === false) {
                const updatedFilteredUsers = [...filteredUsers];
                updatedFilteredUsers.push(data);
                setFilteredUsers(updatedFilteredUsers);
              }
            } else if(data.tipo === "superadmin"){
              setIsActivated(!isActivated);
              if (flag === false) {
                const updatedFilteredUsers = [...filteredUsers];
                updatedFilteredUsers.push(data);
                setFilteredUsers(updatedFilteredUsers);
              }
            }
            setIsActivated(!isActivated); 
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Usuario creado",
              life: 3000,
            });
          }
        } catch (error: any) {
          console.log(error);
        }
      }
      setUserDialog(false);
      setUser(emptyUser);
    }
  };

  const editUser = (user: Demo.User) => {
    setUser({ ...user, password: "" });
    if(user.tipo === "empleado" && user.companyId){
      dispatch(getCompanyRoles(user.companyId))
    }
    setUserDialog(true);
  };

  const confirmDeleteUser = (user: Demo.User) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = async () => {
    const companyId = user.companyId;
    const usersToDelete = user.id;
    let _users = users.filter((val) => val.id !== user.id);
    try {
      const response = await axios.delete(
        `http://localhost:3001/user/${companyId}`,
        { data: { usersToDelete } }      
      );
      if (response.status === 200) {
        //Si el superadmin esta viendo todos los usuarios
        setUsers(_users);
        //Si el superadmin esta viendo alguno de los filtros del select
        if(filteredUsers.length > 0){
          const currentUsersFiltered = filteredUsers.filter((user)=>user.id !== usersToDelete)
          setFilteredUsers(currentUsersFiltered)
        }
        setIsActivated(!isActivated);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuario eliminado",
          life: 3000,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = async () => {
    const companyId = selectedUsers[0].companyId;
    const usersToDelete = selectedUsers.map((e) => e.id);
    console.log(usersToDelete);
    
    try {
      const response = await axios.delete(
        `http://localhost:3001/user/${companyId}`,
        { data: { usersToDelete } }
      );
      if (response.status === 200) {
        let _users = users.filter((val) => !selectedUsers?.includes(val));
        //Si el superadmin esta viendo todos los usuarios
        setUsers(_users);
        //Si el superadmin esta viendo alguno de los filtros del select
        if(filteredUsers.length > 0){
          let currentUsersFiltered = [...filteredUsers]; 
          usersToDelete.forEach((userIdToDelete) => {
            currentUsersFiltered = currentUsersFiltered.filter((user) => user.id !== userIdToDelete);
          });
          setFilteredUsers(currentUsersFiltered);
        }
        setIsActivated(!isActivated);
        setDeleteUsersDialog(false);
        setSelectedUsers([]);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuarios eliminados",
          life: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: keyof Demo.User
  ) => {
    const { value } = e.target;
    setUser((prevState: Demo.User) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onTypeChange = (e: any) => {
    const { value } = e.target;
    setUser((prevState: Demo.User) => ({
      ...prevState,
      tipo: value,
    }));
  };

  const onSwitchChange = (e: any) => {
    const { value } = e.target;
    setUser((prevState: Demo.User) => ({
      ...prevState,
      active: value,
    }));
  };

  const onRoleChange = (e: any) => {
    const { value } = e.target;
    setUser((prevState: Demo.User) => ({
      ...prevState,
      roleId: value,
    }));
  };

  const onCompanyChange = (e: any) => {
    const { value } = e.target;
    setUser((prevState: Demo.User) => ({
      ...prevState,
      companyId: value,
    }));
  };

  const leftToolbarTemplate = () => {
    return (
      <>
        <div className="my-2 ">
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
          <Button
            label="Eliminar"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedUsers || !selectedUsers.length}
          />
        </div>
      </>
    );
  };

  const usernameBodyTemplate = (rowData: Demo.User) => {
    return <>{rowData.username}</>;
  };

  const emailBodyTemplate = (rowData: Demo.User) => {
    return <>{rowData.email}</>;
  };

  const tipoBodyTemplate = (rowData: Demo.User) => {
    return <>{rowData.tipo}</>;
  };

  const activeBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        <span
          className={classNames("p-badge", {
            "p-badge-success": rowData.active,
            "p-badge-secondary": !rowData.active,
          })}
        >
          {rowData.active ? "Sí" : "No"}
        </span>
      </>
    );
  };

  const actionBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        <div className="flex">
          <Button
            icon="pi pi-pencil"
            rounded
            disabled={selectedUsers.length > 1 ? true : false}
            className="mr-1 p-button-success"
            onClick={() => editUser(rowData)}
          />
          <Button
            icon="pi pi-trash"
            rounded
            disabled={selectedUsers.length > 1 ? true : false}
            className="p-button-danger"
            onClick={() => confirmDeleteUser(rowData)}
          />
        </div>
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Gestionar Usuarios</h5>
      <div className="flex bg-gray-100 justify-center p-3">
        <select onChange={onOptionChange} className="p-2 cursor-pointer ">
          <option value="all">Todos los Usuarios</option>
          <option value="superadmins">Superadmins</option>
          {companies.map((company: Empresa) => {
            return <option key={company.id} value={company.id}>{company.name}</option>;
          })}
        </select>
      </div>

      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  const userDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Guardar" disabled={user.tipo === "admin" && !user.companyId ? true : false} icon="pi pi-check" text onClick={saveUser} />
    </>
  );
  const deleteUserDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={hideDeleteUserDialog}
      />
      <Button label="Sí" icon="pi pi-check" text onClick={deleteUser} />
    </>
  );
  const deleteUsersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        text
        onClick={deleteSelectedUsers}
      />
    </>
  );
  
  return (
    <div className="flex crud-demo my-2 mx-2 pr-2 w-full">
    <div className="col-12 align-items-center">
      <div className=" flex flex-colum justify-content-center w-[100%]">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <Toast ref={toast} />
                <Toolbar
                  className="mb-4"
                  left={leftToolbarTemplate}
                ></Toolbar>

                <DataTable
                  ref={dt}
                  value={filteredUsers.length >= 0 && flag === false ? filteredUsers : users}
                  selection={selectedUsers}
                  onSelectionChange={(e) => setSelectedUsers(e.value as Demo.User[])}
                  dataKey="id"
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                  globalFilter={globalFilter}
                  emptyMessage="No se encontraron usuarios."
                  header={header}
                  scrollable
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                  }}
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "4rem" }}
                    frozen 
                  ></Column>
                  <Column field="id" header="ID" sortable frozen></Column>
                  <Column
                    field="username"
                    header="Usuario"
                    sortable
                    body={usernameBodyTemplate}
                  ></Column>
                  <Column
                    field="email"
                    header="Email"
                    sortable
                    body={emailBodyTemplate}
                  ></Column>
                  <Column
                    field="tipo"
                    header="Tipo"
                    sortable
                    body={tipoBodyTemplate}
                    className="capitalize"
                  ></Column>
                  <Column
                    frozen
                    field="active"
                    header="Activo"
                    body={activeBodyTemplate}
                  ></Column>
                  <Column
                    body={actionBodyTemplate}
                    frozen
                    field="edit"
                    header="Editar"
                    alignFrozen="right"
                  ></Column>
                </DataTable>

                <Dialog
                  visible={userDialog}
                  style={{ width: "450px" }}
                  header={
                    user.id !== 0
                      ? "Edición de Usuario"
                      : "Creación de Usuario"
                  }
                  modal
                  className="p-fluid"
                  footer={userDialogFooter}
                  onHide={hideDialog}
                >
                  <div className="field">
                    <label htmlFor="username">Nombre de usuario</label>
                    <InputText
                      id="username"
                      value={user.username}
                      onChange={(e) => onInputChange(e, "username")}
                      required
                      autoFocus
                      className={classNames({
                        "p-invalid": submitted && !user.username,
                      })}
                    />
                    {submitted && !user.username && (
                      <small className="p-error">
                        El nombre de usuario es obligatorio.
                      </small>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor="email">Correo electrónico</label>
                    <InputText
                      id="email"
                      value={user.email}
                      onChange={(e) => onInputChange(e, "email")}
                      required
                      className={classNames({
                        "p-invalid": submitted && !user.email,
                      })}
                    />
                    {submitted && !user.email && (
                      <small className="p-error">
                        El correo electrónico es obligatorio.
                      </small>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor="email">Contraseña</label>
                    {user.id !== 0 && (
                      <input
                        type="checkbox"
                        checked={activePassword}
                        onChange={() => setActivePassword(!activePassword)}
                        className="mx-2"
                      />
                    )}
                    <Password
                      inputId="password1"
                      value={user.password}
                      onChange={(e) => onInputChange(e, "password")}
                      toggleMask
                      className="w-full mb-5"
                      promptLabel="Ingresa una contraseña"
                      weakLabel="Poco Segura"
                      mediumLabel="Segura"
                      strongLabel="Muy Segura"
                      disabled={user.id !== 0 ? !activePassword : false}
                    ></Password>
                    {submitted && !user.password && (
                      <small className="p-error">
                        Ingrese una contraseña
                      </small>
                    )}
                  </div>
                  {
                      user.tipo === "admin" ?
                    <div className="field">
                    <label>Empresas</label>
                    <Dropdown
                      id="roles"
                      value={user.companyId}
                      options={companies}
                      onChange={onCompanyChange}
                      placeholder="Seleccionar empresa"
                      optionLabel="name"
                      optionValue="id"
                      filter
                    />
                    {submitted && user.companyId === 0 && (
                      <small className="p-error">
                        Debe seleccionar una empresa
                      </small>
                    )}
                  </div>
                  : user.tipo === "empleado" ?
                  <div className="field">
                    <label>Cargo</label>
                    <Dropdown
                      id="roles"
                      value={user.roleId}
                      options={roles}
                      onChange={onRoleChange}
                      placeholder="Seleccionar cargo"
                      optionLabel="name"
                      optionValue="id"
                      filter
                    />
                    {submitted && user.roleId === 0 && (
                      <small className="p-error">
                        Debe seleccionar un cargo
                      </small>
                    )}
                  </div>
                  :
                  null
                  }
                  
                  <div className="field">
                    <label>Tipo de Usuario</label>
                    <Dropdown
                      value={user.tipo}
                      onChange={(e) => onTypeChange(e)}
                      options={dropdownValues}
                      optionLabel="name"
                      placeholder="Seleccionar tipo"
                    />
                    {submitted && !user.tipo && (
                      <small className="p-error">
                        Debe seleccionar el tipo
                      </small>
                    )}
                  </div>

                  <div className="field flex">
                    <label className="pr-3">Activo</label>
                    <InputSwitch
                      checked={user.active}
                      onChange={(e) => onSwitchChange(e)}
                    />
                  </div>
                  <div className=" min-h-[30px]">
                  {userDialogFooter.props.children[1].props.disabled ? (
                    <p className="p-error">Seleccione una empresa para el admin.</p>
                  ) : null}
                  </div>
                </Dialog>

                <Dialog
                  visible={deleteUserDialog}
                  style={{ width: "450px" }}
                  header="Confirmar"
                  modal
                  footer={deleteUserDialogFooter}
                  onHide={hideDeleteUserDialog}
                >
                  <div className="flex items-center justify-center">
                    <i
                      className="pi pi-exclamation-triangle mr-3"
                      style={{ fontSize: "2rem" }}
                    />
                    {user && (
                      <span>
                        ¿Estás seguro de que deseas eliminar al usuario{" "}
                        <b>{user.username}</b>?
                      </span>
                    )}
                  </div>
                </Dialog>

                <Dialog
                  visible={deleteUsersDialog}
                  style={{ width: "450px" }}
                  header="Confirmar"
                  modal
                  footer={deleteUsersDialogFooter}
                  onHide={hideDeleteUsersDialog}
                >
                  <div className="flex items-center justify-center">
                    <i
                      className="pi pi-exclamation-triangle mr-3"
                      style={{ fontSize: "2rem" }}
                    />
                    {user && (
                      <span>
                        ¿Estás seguro de que deseas eliminar los usuarios
                        seleccionados?
                      </span>
                    )}
                  </div>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default UserByCompany;
