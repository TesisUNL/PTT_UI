import * as Yup from 'yup';
import { useEffect, useState } from 'react';
// material
import { Card, Stack, Container, Typography, Menu, MenuItem, Button} from '@mui/material';

// toast
import { toast } from 'react-toastify';
// components
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material/styles';
import Label  from '../components/Label';
import { ActiveOrDeleteForm } from '../forms/User';
import { activeUser, deleteUser, getUsers, bulkUpdateUsers } from '../services/user.service';
import Page from '../components/Page';
import LoadingIndicator from '../components/common/LoadingSpinner';

import CustomModal from '../components/common/CustomModal';
import CustomIconButton from '../components/common/CustomIconButton';
import Iconify from '../components/common/Iconify';
import { EditForm } from '../forms/User/Edit';
import { ROLES } from '../utils/constants';
import { MAvatar } from '../components/@material-extend';
import createAvatar from '../utils/createAvatar';

function RenderRole(getRole) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'ghost' : 'filled'}
      color={(getRole === 'User' && 'warning') || (getRole === 'Admin' && 'success') || 'error'}
      sx={{ textTransform: 'capitalize', mx: 'auto' }}
    >
      {getRole}
    </Label>
  );
}


export default function User() {
  const initialStateGrid = {
    filter: {
      filterModel: {
        items: [{ columnField: 'isActive', operatorValue: 'is', value: 'true' }],
      },
    },
  };

  const activeDeleteFormValues = {
    schema: Yup.object().shape({
      userId: Yup.array().required('User id is required'),
    }),
    defaultValues: {
      userId: [],
    },
  };

  const editFormValues = {
    schema: Yup.object().shape({
      userId: Yup.array().required('User id is required'),
      role: Yup.string().required('Role is required'),
    }),
    defaultValues: {
      userId: [],
      role: '',
    },
  };

  const formEditMethods = useForm({
    resolver: yupResolver(editFormValues.schema),
    defaultValues: editFormValues.defaultValues,
  });

  const { reset: resetEdit } = formEditMethods;

  const formMethods = useForm({
    resolver: yupResolver(activeDeleteFormValues.schema),
    defaultValues: activeDeleteFormValues.defaultValues,
  });

  const { reset } = formMethods;

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openActivateModal, setOpenActivateModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [countUsersDelete, setCountUsersDelete] = useState(0);
  const [multiSelectAnchorEl, setMultiSelectAnchorEl] = useState(null);
  const open = Boolean(multiSelectAnchorEl);

  const userColumns = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 64,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => {
        const getAvatar = params.getValue(params.id, 'name');
        return (
          <MAvatar color={createAvatar(getAvatar).color} sx={{ width: 36, height: 36 }}>
            {createAvatar(getAvatar).name}
          </MAvatar>
        );
      }
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'role',
      type: 'singleSelect',
      headerName: 'Role',
      width: 120,
      valueOptions: ['User', 'Any', 'Admin'],
      renderCell: (params) => {
        const getRole = params.getValue(params.id, 'role');
        return RenderRole(getRole);
      }
    },
    {
      field: 'isActive',
      headerName: 'Active',
      type: 'boolean',
      width: 120,
      renderCell: (params) => {
        const getAdmin = params.getValue(params.id, 'isActive');
        return (
          <Stack alignItems="center" sx={{ width: 1, textAlign: 'center' }}>
            {getAdmin ? (
              <Iconify sx={{ width: 20, height: 20, color: 'primary.main'}} icon="eva:checkmark-circle-2-fill"/>
            ) : (
              '-'
            )}
          </Stack>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      filterable: false,
      disableExport: true,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const { id, isActive, role } = params.row;
        return (
          <Stack alignItems={"center"} direction="row" width={"100%"} justifyContent={"center"}>
            {isActive ? (
              <>
                <CustomIconButton
                  onClick={() => {
                    reset({ userId: [id] });
                    setCountUsersDelete(1);
                    setOpenDeleteModal(true);
                  }}
                  title="Delete"
                  color="error.main"
                  icon="eva:trash-2-outline"
                />
                <CustomIconButton
                  onClick={() => {
                    resetEdit({
                      userId: [id],
                      role,
                    });
                    setOpenEditModal(true);
                  }}
                  title="Edit"
                  color="primary.main"
                  icon="eva:edit-2-outline"
                />
              </>
            ) : (
              <CustomIconButton
                onClick={async () => {
                  reset({ userId: [id] });
                  setOpenActivateModal(true);
                }}
                title="Activate"
                color="info.main"
                icon="eva:checkmark-circle-outline"
              />
            )}
          </Stack>
        );
      },
    },
  ];

  const multipleUserActions = [
    {
      label: 'Edit',
      icon: 'eva:edit-2-outline',
      color: 'secondary.main',
      onClick: () => {
        resetEdit({ userId: selectedUsers, role: '' });
        handleMenuOptionsClose();
        setOpenEditModal(true);
      },
    },
    {
      label: 'Delete',
      icon: 'eva:trash-2-outline',
      color: 'error.main',
      onClick: () => {
        reset({ userId: selectedUsers });
        setCountUsersDelete(selectedUsers.length);
        handleMenuOptionsClose();
        setOpenDeleteModal(true);
      },
    },
  ];

  const showToastMessage = (isSuccessful, messages) => {
    const messageToShow = isSuccessful ? messages.success : messages.error
    toast(messageToShow, { type: isSuccessful? 'success': 'error'})
  };

  const fetchUsers = async () => {
    const users = await getUsers();
    if (users) setUsers(users);
    setLoading(false);
  };

  const handleMenuOptionsClick = (event) => {
    setMultiSelectAnchorEl(event.currentTarget);
  };

  const handleMenuOptionsClose = () => {
    setMultiSelectAnchorEl(null);
  };

  const onSubmitEdit = async (data) => {
    const { userId, role } = data;
    const updateValues = {
      ids: userId,
      role,
    };
    const { status } = await bulkUpdateUsers(updateValues);
    const isSuccessfullyResponse = status === 200;
    const messages = {
      success: `Users successfully edited`,
      error: 'Error editing users',
    };

    showToastMessage(isSuccessfullyResponse, messages);

    if (isSuccessfullyResponse) {
      fetchUsers();
    }

    setOpenEditModal(false);
  };

  const onSubmitDelete = async (data) => {
    const { userId } = data;
    const isMultipleDelete = userId.length > 1;
    const updateValues = isMultipleDelete ? { ids: userId, isActive: false } : userId[0];

    const { status } = isMultipleDelete ? await bulkUpdateUsers(updateValues) : await deleteUser(updateValues);
    const isSuccessfullyResponse = status === 200;
    const messages = {
      success: "User's successfully deleted",
      error: 'Error on delete the user',
    };

    showToastMessage(isSuccessfullyResponse, messages);
    if (isSuccessfullyResponse) {
      fetchUsers();
    }

    setOpenDeleteModal(false);
    setCountUsersDelete(0);
  };

  const onSubmitActivate = async (data) => {
    const { userId } = data;
    const { status } = await activeUser(userId[0]);

    const isSuccessfullyResponse = status === 200;
    const messages = {
      success: "User's successfully activated",
      error: 'Error on activate the user',
    };

    showToastMessage(isSuccessfullyResponse, messages);

    if (isSuccessfullyResponse) {
      fetchUsers();
    }

    setOpenActivateModal(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          {selectedUsers.length > 0 && (
            <div>
              <Button
                id="basic-button"
                variant="contained"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuOptionsClick}
                startIcon={open ? <Iconify icon="eva:arrow-up-outline" /> : <Iconify icon="eva:arrow-down-outline" />}
              >
                Modificar Usuarios
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={multiSelectAnchorEl}
                open={open}
                onClose={handleMenuOptionsClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {multipleUserActions.map((action, index) => (
                  <MenuItem key={index} onClick={() => action.onClick()} sx={{ color: action.color }}>
                    {action?.icon ? <Iconify icon={action.icon} /> : null}
                    {action.label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}
        </Stack>

        <Card>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <div style={{ display: 'flex', height: '70vh' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  rows={users}
                  localeText={{
    toolbarDensity: 'Size',
    toolbarDensityLabel: 'Size',
    toolbarDensityCompact: 'Small',
    toolbarDensityStandard: 'Medium',
    toolbarDensityComfortable: 'Large',
  }}
                  initialState={initialStateGrid}
                  columns={userColumns}
                  isRowSelectable={(params) => params.row.isActive}
                  getRowId={(user) => user.id}
                  pageSize={rowsPerPage}
                  onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
                  rowsPerPageOptions={[10, 20, 50]}
                  onSelectionModelChange={(usersSelected) => {
                    setSelectedUsers(usersSelected);
                  }}
                  pagination
                  checkboxSelection
                  disableSelectionOnClick
                  components={{ Toolbar: GridToolbar }}
                  getRowHeight={() => 'auto'}
                  
                />
              </div>
            </div>
          )}
        </Card>

      </Container>

      <CustomModal
        title="Delete User"
        description={`Are you sure you want to delete ${countUsersDelete} user(s)?`}
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        children={
          <ActiveOrDeleteForm
            onSubmit={onSubmitDelete}
            formMethods={formMethods}
            handleCancel={() => setOpenDeleteModal(false)}
            confirmButtonText="Delete"
          />
        }
      />

      <CustomModal
        title="Active User"
        description={`Are you sure you want to active this user?`}
        open={openActivateModal}
        handleClose={() => setOpenActivateModal(false)}
        children={
          <ActiveOrDeleteForm
            onSubmit={onSubmitActivate}
            formMethods={formMethods}
            handleCancel={() => setOpenActivateModal(false)}
            confirmButtonText="Active"
          />
        }
      />

      <CustomModal
        title="Edit User"
        description={`Change the role of the users`}
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        children={
          <EditForm
            onSubmit={onSubmitEdit}
            isDisabled={!formEditMethods.watch('role')}
            formMethods={formEditMethods}
            handleCancel={() => setOpenEditModal(false)}
            allowedRoles={ROLES}
          />
        }
      />
    </Page>
  );
}
