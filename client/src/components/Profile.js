import React, { useEffect, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

function createNotification(response, type) {
  document.getElementById('alert')?.remove();
  const alertDiv = document.createElement('div');
  alertDiv.id = 'alert';
  alertDiv.className =
    type === false
      ? 'bg-gradient-to-l from-red-100 via-white to-white border-r-4 border-red-500 text-orange-700 my-3 p-4 flex flex-col items-end'
      : 'bg-gradient-to-l from-green-100 via-white to-white border-r-4 border-green-500 text-green-900 my-3 p-4 flex flex-col items-end';
  alertDiv.role = 'alert';
  const errorTitle = document.createElement('p');
  errorTitle.id = 'errT';
  errorTitle.innerHTML = response.title.toUpperCase();
  const errorBody = document.createElement('p');
  errorBody.id = 'errB';
  errorBody.innerHTML = response.error ?? '';

  alertDiv.appendChild(errorTitle);
  alertDiv.appendChild(errorBody);
  document.getElementById('main').prepend(alertDiv);
}

export default function Profile() {
  const user = JSON.parse(sessionStorage.getItem('user')) ?? null;
  const profileUser =
    JSON.parse(sessionStorage.getItem('selected_user')) ?? null;

  useEffect(() => {
    sessionStorage.removeItem('room');

    console.log(profileUser._id === user._id);
    if (profileUser._id !== user._id) {
      document.getElementById('btn-update').className = 'hidden';
    }
    if (user === null || profileUser === null) {
      window.location.href = 'http://localhost:3000/';
    }
  }, [user, profileUser]);

  const info = profileUser?.info ?? null;
  const [infoDialog, setOpenInfo] = useState(false);
  const [securityDialog, setOpenSecurity] = useState(false);
  const [notificationDialog, setOpenNotification] = useState(false);
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const [password, setPassword] = useState();
  const [cpassword, setCPassword] = useState();
  const [oldpassword, setOldPassword] = useState();
  const isEditable = profileUser._ === user._id;

  useEffect(() => {
    const notificationElement = document.getElementById('notification-text');
    const notification = info?.notification;
    if (notification) {
      notificationElement.className = 'text-green-500 font-bold';
      notificationElement.innerHTML = 'ENABLED';
    } else {
      notificationElement.className = 'text-red-500 font-bold';
      notificationElement.innerHTML = 'DISABLED';
    }
  }, [info]);

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };
  const handleCloseSecurity = () => {
    setOpenSecurity(false);
  };
  const handleCloseNotificaion = () => {
    setOpenNotification(false);
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file.name);
    if (file === undefined) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', info.userId);
    const response = await fetch('http://localhost:5000/api/infos/avatar', {
      method: 'PATCH',
      body: formData,
    });
    response.json().then((resp) => {
      if (resp.err === undefined) {
        createNotification(resp, true);
        user.info = resp.info;
        sessionStorage.setItem('user', JSON.stringify(user));
        document.getElementById('avatar').src = '/uploads/' + resp.info.img;
      } else {
        createNotification(resp, false);
      }
    });
  };

  const handleUpdateInfo = async (e, notification) => {
    if (!isEditable) return;
    e.preventDefault();
    const newInfo = {
      userId: user._id,
      address: address,
      city: city,
      zip: zip,
    };

    const response = await fetch('http://localhost:5000/api/infos/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInfo),
    });
    const r = response.json();
    r.then((resp) => {
      if (resp.err !== null) {
        createNotification(resp, true);
        user.info = resp.info;
        sessionStorage.setItem('user', JSON.stringify(user));
      } else {
        createNotification(resp, false);
      }
    });
  };

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      const err = { title: 'PASSWORD ERROR', error: 'Password not match' };
      createNotification(err, false);
      return;
    }

    const newPassword = {
      email: user.email,
      oldpassword: oldpassword,
      newpassword: password,
    };

    const response = await fetch('http://localhost:5000/api/users/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPassword),
    });
    const r = response.json();
    r.then((resp) => {
      if (resp.error === undefined) {
        createNotification(resp, true);
        sessionStorage.setItem('user', JSON.stringify(resp.user));
      } else {
        createNotification(resp, false);
      }
    });
  };

  const handleTurnON = async (e) => {
    e.preventDefault();
    const newInfo = {
      userId: user._id,
      notification: true,
    };

    const response = await fetch('http://localhost:5000/api/infos/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInfo),
    });
    const r = response.json();
    r.then((resp) => {
      if (resp.error === undefined) {
        createNotification(resp, true);
        user.info = resp.info;
        sessionStorage.setItem('user', JSON.stringify(user));
        const notificationElement =
          document.getElementById('notification-text');
        notificationElement.className = 'text-green-500 font-bold';
        notificationElement.innerHTML = ' ENABLED';
        document.getElementById('notification').value = 'ENABLED';
      } else {
        createNotification(resp, false);
      }
    });
  };

  const handleTurnOFF = async (e) => {
    e.preventDefault();
    const newInfo = {
      userId: user._id,
      notification: false,
    };

    const response = await fetch('http://localhost:5000/api/infos/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInfo),
    });
    const r = response.json();
    r.then((resp) => {
      if (resp.error === undefined) {
        createNotification(resp, true);
        user.info = resp.info;
        sessionStorage.setItem('user', JSON.stringify(user));
        const notificationElement =
          document.getElementById('notification-text');
        notificationElement.className = 'text-red-500 font-bold';
        notificationElement.innerHTML = ' DISABLED';
        document.getElementById('notification-text').value = 'DISABLED';
      } else {
        createNotification(resp, false);
      }
    });
  };

  return (
    <div className="flex flex-row justify-center mt-4">
      <div className="float-left p-4 h-screen w-1/3 xs:hidden justify-center"></div>
      <div className="float-left p-4 md:h-1/3 md:w-2/3 flex flex-col justify-center overflow-auto">
        <div
          id="info"
          className="bg-gray-200 md:w-2/3 mx-auto p-8 md:p-12 rounded-lg shadow-xl "
        >
          <div className="flex justify-center h-auto">
            <form>
              <img
                id="avatar"
                onClick={() => {
                  if (isEditable)
                    document.getElementById('avatar-upload').click();
                }}
                src={
                  profileUser?.info?.img !== undefined
                    ? '/uploads/' + profileUser?.info?.img
                    : 'https://image.flaticon.com/icons/png/512/847/847969.png'
                }
                alt=""
                className="w-32 h-32 mt-2 rounded-full"
              />
              <input
                type="file"
                className="hidden"
                id="avatar-upload"
                name="file"
                onChange={handleUpdateAvatar}
              />
            </form>
          </div>
          <div className="bg-gray-300 rounded-lg shadow-md">
            <ul className="flex flex-col xl:flex-row xl:space-y-0 xl:justify-evenly justify-center items-center mt-12 text-gray-500 h-auto space-y-32 font-bold">
              <li className="hover:bg-gray-400 rounded-lg px-3 py-4 w-auto">
                <button
                  onClick={() => {
                    if (document.body.scrollWidth >= 1440 && isEditable) {
                      document.getElementById(
                        'notification-form'
                      ).style.display = 'none';
                      document.getElementById(
                        'notification-form'
                      ).style.display = 'none';
                      document.getElementById('info-form').style.display =
                        'block';
                    } else {
                      setOpenInfo(true);
                    }
                  }}
                >
                  Info
                </button>
              </li>
              <li className="hover:bg-gray-400 rounded-lg px-3 py-4">
                <button
                  onClick={() => {
                    if (document.body.scrollWidth >= 1440 && isEditable) {
                      document.getElementById('info-form').style.display =
                        'none';
                      document.getElementById(
                        'notification-form'
                      ).style.display = 'none';
                      document.getElementById('security-form').style.display =
                        'block';
                    } else {
                      if (isEditable) setOpenSecurity(true);
                    }
                  }}
                >
                  Security
                </button>
              </li>
              <li className="hover:bg-gray-400 rounded-lg px-3 py-4">
                <button
                  onClick={() => {
                    if (document.body.scrollWidth >= 1440 && isEditable) {
                      document.getElementById('info-form').style.display =
                        'none';
                      document.getElementById('security-form').style.display =
                        'none';
                      document.getElementById(
                        'notification-form'
                      ).style.display = 'block';
                    } else {
                      if (isEditable) setOpenNotification(true);
                    }
                  }}
                >
                  Notification
                </button>
              </li>
            </ul>
          </div>
          <div id="info-form" className="block mt-4">
            <form>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="text"
                  id="name"
                  readOnly
                  value={profileUser?.name ?? ''}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="surname"
                >
                  Surname
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="text"
                  id="surname"
                  readOnly
                  value={profileUser?.surname ?? ''}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="telephone"
                >
                  Telephone
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="number"
                  id="telephone"
                  readOnly
                  value={profileUser?.telephone ?? ''}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="text"
                  id="email"
                  readOnly
                  value={profileUser?.email ?? ''}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="Address"
                >
                  Address
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="text"
                  id="address"
                  readOnly={!isEditable}
                  defaultValue={info?.address ?? ''}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="City"
                >
                  City
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="text"
                  id="city"
                  readOnly={!isEditable}
                  defaultValue={info?.city ?? ''}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="zip"
                >
                  ZIP(CAP)
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="number"
                  id="zip"
                  readOnly={!isEditable}
                  defaultValue={info?.zip ?? ''}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
              <div id="btn-update" className="flex justify-center">
                <button
                  onClick={handleUpdateInfo}
                  className="bg-red-800 text-white font-bold py-3 px-8 rounded hover:bg-red-600 shadow"
                >
                  UPDATE
                </button>
              </div>
            </form>
          </div>
          <div hidden id="security-form" className="mt-4">
            <form>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="oldpassword"
                >
                  Old Password
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="password"
                  id="oldpassword"
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="newpassword"
                >
                  New Password
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="password"
                  id="newpassword"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-6 pt-3 rounded bg-gray-300">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="newpassword"
                >
                  Confirm Password
                </label>
                <input
                  required
                  className="bg-gray-300 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 border-red-800 transition duration-500 px-3 pb-3"
                  type="password"
                  id="confirmpassword"
                  onChange={(e) => setCPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-row justify-center">
                <button
                  onClick={handleUpdateSecurity}
                  className="bg-red-800 text-white font-bold py-3 px-8 rounded hover:bg-red-600 shadow"
                >
                  UPDATE
                </button>
              </div>
            </form>
          </div>
          <div hidden id="notification-form" className="mt-4">
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 text-xl">
                NOTIFICATION :
                <span id="notification-text" className="font-bold"></span>
              </label>
            </div>
            <div className="flex flex-row justify-center space-x-4 mt-4">
              <div>
                <button
                  onClick={handleTurnON}
                  className="bg-red-800 text-white font-bold py-3 px-8 rounded hover:bg-red-600 shadow"
                >
                  TURN ON
                </button>
              </div>
              <div className="flex flex-row justify-center">
                <button
                  value={false}
                  onClick={handleTurnOFF}
                  className="bg-red-800 text-white font-bold py-3 px-8 rounded hover:bg-red-600 shadow"
                >
                  TURN OFF
                </button>
              </div>
            </div>
          </div>
          <Dialog open={infoDialog} onClose={handleCloseInfo}>
            <DialogTitle id="alert-dialog-title">Edit profile</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                color="secondary"
                margin="dense"
                id="name"
                label="Name"
                type="text"
                value={profileUser?.name ?? ''}
                readOnly
                fullWidth
              />
              <TextField
                color="secondary"
                margin="dense"
                id="surname"
                label="Surname"
                type="text"
                value={profileUser?.surname ?? ''}
                readOnly
                fullWidth
              />
              <TextField
                color="secondary"
                margin="dense"
                id="name"
                label="Telephone"
                type="number"
                value={profileUser?.telephone ?? ''}
                fullWidth
              />
              <TextField
                color="secondary"
                margin="dense"
                id="email"
                label="email"
                type="text"
                value={profileUser?.email ?? ''}
                readOnly
                fullWidth
              />
              <TextField
                color="secondary"
                margin="dense"
                id="address-tf"
                label="Address"
                type="text"
                defaultValue={info?.address ?? ''}
                InputProps={{
                  readOnly: !isEditable,
                }}
                fullWidth
                //onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                color="secondary"
                margin="dense"
                id="city"
                label="City"
                type="text"
                defaultValue={info?.city ?? ''}
                fullWidth
                InputProps={{
                  readOnly: !isEditable,
                }}
                onChange={(e) => setCity(e.target.value)}
              />
              <TextField
                color="secondary"
                margin="dense"
                id="ZIP"
                label="ZIP(CAP)"
                type="number"
                defaultValue={info?.zip ?? ''}
                fullWidth
                InputProps={{
                  readOnly: !isEditable,
                }}
                onChange={(e) => setZip(e.target.value)}
              />
              <DialogActions>
                <Button
                  onClick={handleUpdateInfo}
                  variant="contained"
                  color="secondary"
                >
                  UPDATE
                </Button>
                <Button
                  onClick={handleCloseInfo}
                  variant="contained"
                  color="primary"
                >
                  CLOSE
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          <Dialog open={securityDialog} onClose={handleCloseSecurity}>
            <DialogTitle id="alert-dialog-title">Edit Password</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="oldpassword"
                label="Old Password"
                type="password"
                fullWidth
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="New Password"
                type="password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="confirmpassword"
                label="Confirm Password"
                type="password"
                fullWidth
                onChange={(e) => setCPassword(e.target.value)}
              />
              <DialogActions>
                <Button
                  onClick={handleUpdateSecurity}
                  variant="contained"
                  color="secondary"
                >
                  UPDATE
                </Button>
                <Button
                  onClick={handleCloseSecurity}
                  variant="contained"
                  color="primary"
                >
                  CLOSE
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          <Dialog open={notificationDialog} onClose={handleCloseNotificaion}>
            <DialogTitle id="alert-dialog-title">Edit Notification</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="notification"
                label="NOTIFICATION"
                value={info?.notification ? 'ENABLED' : 'DISABLED'}
                fullWidth
              ></TextField>
              <Button
                color="primary"
                margin="dense"
                id="on"
                variant="contained"
                type="button"
                fullWidth
                onClick={handleTurnON}
              >
                TURN ON
              </Button>
              <Button
                color="secondary"
                autoFocus
                margin="dense"
                id="off"
                variant="contained"
                label=""
                type="button"
                readOnly
                fullWidth
                onClick={handleTurnOFF}
              >
                TURN OFF
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div id="main" className="float-left p-4 h-screen w-1/3 xs:hidden"></div>
    </div>
  );
}
