import * as react from 'react';
import {
  randomColor,
  randomEmail,
  randomName,
  randomPhoneNumber,
} from '@mui/x-data-grid-generator';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams
} from '@mui/x-data-grid';

import { renderEmail } from './cell-renderers/email';
import { renderAvatar } from './cell-renderers/avartar';



const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'avatar',
    headerName: 'Avatar',
    display: 'flex',
    renderCell: renderAvatar,
    valueGetter: (value, row) =>
      row.name == null || row.avatar == null
        ? null
        : { name: row.name, color: row.avatar },
    sortable: false,
    filterable: false,
  } as GridColDef<any, { color: string; name: string }>,
  {
    field: 'name',
    headerName: 'Name',
    width: 250,
    editable: true,
  },
  {
    field: 'id',
    headerName: 'User ID',
    width: 150,
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    renderCell: renderEmail,
    width: 200,
    editable: true,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 150,
  },
  {
    field: 'company',
    headerName: 'Companry',
    width: 250,
  }, {
    field: 'actions',
    type: 'actions',
    
  }

];

const rows = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  name: randomName({}, {}),
  avatar: randomColor(),
  email: randomEmail(),
  phoneNumber: randomPhoneNumber(),
  //role
  role: 'admin',
  company: 'iquri',
}));

export default function DataTable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid checkboxSelection disableRowSelectionOnClick rows={rows} columns={columns} />
    </div>
  );
}