import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
//import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
//import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
//import { UserService } from '../../../demo/service/UserService';
import { Demo } from '../../utils/types/types';
//import { es } from 'date-fns/locale';
import { Area } from '../../utils/interfaces';
import { useAppDispatch } from '../../hooks/typedSelectors';
import { fetchUsers } from '../../redux/features/userSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchCompanyAreas } from '../../redux/features/areaSlice';

const Crud = () => {
  const dispatch = useAppDispatch()
  const emptyUser: Demo.User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    active: false,
    tipo: '',
    companyId: 0,
    areas: []
  };
  interface InputValue {
    name: string;
    code: string;
  }
  const currentUsers = useSelector((state: RootState) => state.user.users)
  const areas = useSelector((state: RootState) => state.areas.areas)
  const currentEmpresa = useSelector((state: RootState) => state.user.logUser.companyId)

  const [users, setUsers] = useState<Demo.User[]>([]);
  const [userDialog, setUserDialog] = useState(false);
  const [ready, setReady] = useState<boolean>(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [user, setUser] = useState<Demo.User>(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState<Demo.User[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Demo.User[]>>(null);

  useEffect(() => {
    if(currentUsers.length === 0){
      dispatch(fetchUsers())
      dispatch(fetchCompanyAreas(currentEmpresa))
      setReady(true)
    }
  }, [dispatch]);
  
  useEffect(() => {
    if(ready){
      setUsers(currentUsers)
    }
  }, [ready, currentUsers]);

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const dropdownValues: InputValue[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];

  const saveUser = () => {
    setSubmitted(true);

    if (user.username.trim() && user.email.trim() && user.tipo.trim()) {
      let _users = [...users];
      let _user = { ...user };

      if (user.id) {
        const index = findIndexById(user.id);

        _users[index] = _user;
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado', life: 3000 });
      } else {
        _user.id = createId();
        _users.push(_user);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado', life: 3000 });
      }

      setUsers(_users);
      setUserDialog(false);
      setUser(emptyUser);
    }
  };

  const editUser = (user: Demo.User) => {
    setUser({ ...user });
    setUserDialog(true);
  };

  const confirmDeleteUser = (user: Demo.User) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    let _users = users.filter((val) => val.id !== user.id);
    setUsers(_users);
    setDeleteUserDialog(false);
    setUser(emptyUser);
    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado', life: 3000 });
  };

  const findIndexById = (id: number) => {
    let index = -1;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    return Math.max(...users.map((user) => user.id)) + 1;
  };


  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = () => {
    let _users = users.filter((val) => !selectedUsers?.includes(val));
    setUsers(_users);
    setDeleteUsersDialog(false);
    setSelectedUsers([]);
    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuarios eliminados', life: 3000 });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Demo.User) => {
    const { value } = e.target;
    setUser((prevState: Demo.User) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUser((prevState: Demo.User) => ({
      ...prevState,
      tipo: value
    }));
  };

  const onAreaChange = (e: { value: Area[] }) => {
    setUser((prevState: Demo.User) => ({
      ...prevState,
      areas: e.value
    }));
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button label="Nuevo" icon="pi pi-plus" className="p-button p-component p-button-success mr-2" onClick={openNew} />
          <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
        </div>
      </React.Fragment>
    );
  };

  const itemTemplate = (option: InputValue) => {
    return (
        <div className="flex align-items-center">
            <span className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px', height: '12px' }} />
            <span>{option.name}</span>
        </div>
    );
};


  const usernameBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        {rowData.username}
      </>
    );
  };

  const emailBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        {rowData.email}
      </>
    );
  };

  const tipoBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        {rowData.tipo}
      </>
    );
  };

  const areasBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        {rowData.areas.map((area: Area) => (
          <span key={area.id} className="p-badge p-mr-1">
            {area.name}
          </span>
        ))}
      </>
    );
  };

  const activeBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        <span className={classNames('p-badge', { 'p-badge-success': rowData.active, 'p-badge-secondary': !rowData.active })}>
          {rowData.active ? 'Sí' : 'No'}
        </span>
      </>
    );
  };

  const actionBodyTemplate = (rowData: Demo.User) => {
    return (
      <>
        <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" rounded className="p-button-warning" onClick={() => confirmDeleteUser(rowData)} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Gestionar Usuarios</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
      </span>
    </div>
  );

  const userDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" text onClick={saveUser} />
    </>
  );
  const deleteUserDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
      <Button label="Sí" icon="pi pi-check" text onClick={deleteUser} />
    </>
  );
  const deleteUsersDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
      <Button label="Sí" icon="pi pi-check" text onClick={deleteSelectedUsers} />
    </>
  ); 

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value as Demo.User[])}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
            globalFilter={globalFilter}
            emptyMessage="No se encontraron usuarios."
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
            <Column field="id" header="ID" sortable></Column>
            <Column field="username" header="Nombre de usuario" sortable body={usernameBodyTemplate}></Column>
            <Column field="email" header="Correo electrónico" sortable body={emailBodyTemplate}></Column>
            <Column field="tipo" header="Tipo" sortable body={tipoBodyTemplate} className='capitalize'></Column>
            <Column field="areas" header="Áreas" body={areasBodyTemplate}></Column>
            <Column field="active" header="Activo" body={activeBodyTemplate}></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog visible={userDialog} style={{ width: '450px' }} header="Creación de Usuario" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
            <div className="field">
              <label htmlFor="username">Nombre de usuario</label>
              <InputText
                id="username"
                value={user.username}
                onChange={(e) => onInputChange(e, 'username')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !user.username })}
              />
              {submitted && !user.username && <small className="p-error">El nombre de usuario es obligatorio.</small>}
            </div>
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <InputText
                id="email"
                value={user.email}
                onChange={(e) => onInputChange(e, 'email')}
                required
                className={classNames({ 'p-invalid': submitted && !user.email })}
              />
              {submitted && !user.email && <small className="p-error">El correo electrónico es obligatorio.</small>}
            </div>
            <div className="field">
              <label htmlFor="email">Contraseña</label>
              <InputText
                id="password"
                type='password'
                value={user.password}
                onChange={(e) => onInputChange(e, 'password')}
                required
                className={classNames({ 'p-invalid': submitted && !user.password })}
              />
              {submitted && !user.password && <small className="p-error">Ingrese una contraseña</small>}
            </div>
            <div className="field">
              <label htmlFor="tipo">Tipo</label>
              {/* <Dropdown value={user.tipo} onChange={(e) => onInputChange(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" /> */}
              {submitted && !user.tipo && <small className="p-error">El tipo es obligatorio.</small>}
            </div>
            <div className="field">
              <label htmlFor="areas">Áreas</label>
              <MultiSelect
                id="areas"
                value={user.areas}
                options={areas}
                onChange={onAreaChange}
                placeholder="Seleccionar áreas"
                optionLabel="name"
                optionValue="id"
              />
            </div>
          </Dialog>

          <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
            <div className="flex items-center justify-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {user && (
                <span>
                  ¿Estás seguro de que deseas eliminar al usuario <b>{user.username}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
            <div className="flex items-center justify-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {user && <span>¿Estás seguro de que deseas eliminar los usuarios seleccionados?</span>}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Crud;
