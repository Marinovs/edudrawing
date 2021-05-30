import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Rooms extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      master: JSON.parse(sessionStorage.getItem('user')),
      users: [],
      setOpen: false,
      setChecked: false,
      checked: false,
      open: false,
      start: 0,
      end: 4,
      pswDialog: false,
      room: null,
      redirected: false,
    };
  }

  async componentDidMount() {
    if (sessionStorage.getItem('user') === null)
      window.location.href = 'http://localhost:3000/';

    const fetchRooms = async () => {
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'GET',
      });
      return response.json();
    };

    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
      });
      return response.json();
    };

    this.setState({ rooms: await fetchRooms() });
    this.setState({ users: await fetchUsers() });

    console.log(this.state.rooms);
  }

  render() {
    function createErrorNotification(response) {
      document.getElementById('alert')?.remove();
      const alertDiv = document.createElement('div');
      alertDiv.id = 'alert';
      alertDiv.className =
        'bg-gradient-to-l from-red-100 via-white to-white border-r-4 border-red-500 text-orange-700 my-3 p-4 flex flex-col items-end';
      alertDiv.role = 'alert';
      const errorTitle = document.createElement('p');
      errorTitle.id = 'errT';
      errorTitle.innerHTML = response.title.toUpperCase();
      const errorBody = document.createElement('p');
      errorBody.id = 'errB';
      errorBody.innerHTML = response.error;

      alertDiv.appendChild(errorTitle);
      alertDiv.appendChild(errorBody);
      document.getElementById('main').prepend(alertDiv);
    }

    async function create(room) {
      return fetch('http://localhost:5000/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(room),
      }).then((data) => data.json());
    }

    const handleClickOpen = () => {
      this.setState({ open: true });
    };

    const handleClose = () => {
      this.setState({ open: false });
    };

    const handlePswClose = () => {
      this.setState({ pswDialog: false });
    };

    const handleCheckbox = () => {
      this.setState({ checked: !this.state.checked });
    };

    const handleNextPage = () => {
      if (this.state.end < this.state.rooms.length) {
        this.setState({ end: this.state.end + 4 });
        this.setState({ start: this.state.start + 4 });
      }
    };

    const handlePrevPage = () => {
      if (this.state.start > 0) {
        this.setState({ end: this.state.end - 4 });
        this.setState({ start: this.state.start - 4 });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const name = this.state.name;
      const subject = this.state.subject;
      const master = this.state.master;
      const password = this.state.password;
      const response = await create({
        name,
        subject,
        master,
        password,
      }).catch((err) => {
        console.log('ERR: ', err);
      });
      console.log(response);
      if (response.token === undefined) {
        createErrorNotification(response);
      } else {
        this.setState({ room: response.room });
        this.setState({ open: false });
        sessionStorage.setItem('room', JSON.stringify(response.room));
        window.location.reload();
        window.location.href = `http://localhost:3000/rooms/${response.room._id}`;
      }
    };

    const handleJoin = async (room) => {
      console.log(room);
      if (room !== null) {
        this.setState({ room: room });
      }
      if (room.password != null) {
        this.setState({ pswDialog: true });
      }

      sessionStorage.setItem('room', JSON.stringify(room));
      window.location.reload();
      window.location.href = `http://localhost:3000/rooms/${room._id}`;
    };

    const handleConfirmJoin = async () => {
      const id = this.state.room._id;
      const password = this.state.password;

      const response = await fetch('http://localhost:5000/api/rooms/find', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          password,
        }),
      });

      const data = await response.json();
      if (data.token === undefined) {
        createErrorNotification(data);
      } else {
        sessionStorage.setItem('room', JSON.stringify(this.state.room));
        window.location.reload();
        window.location.href = `http://localhost:3000/rooms/${id}`;
      }
    };

    return (
      <div id="main h-full">
        <div className="flex flex-col">
          <div
            className="
flex flex-col justify-center items-center mt-32"
          >
            <div className="flex flex-row" id="rooms">
              <div className="flex flex-row space-x-5">
                {this.state.rooms
                  .slice(this.state.start, this.state.end)
                  .map((room, i) => (
                    <div className="flex space-x-4 px-4 justify-around">
                      <div
                        className="bg-gray-200  h-52 w-14
      md:w-52
      md:rounded-3xl rounded-full shadow-md relative flex flex-col items-center justify-between 
      md:items-start py-5 
      md:p-5 transition-all duration-150"
                      >
                        <img
                          className="rounded-full w-16 h-16 shadow-sm absolute -top-8 transform md:scale-110 duration-700"
                          src="https://randomuser.me/api/portraits/women/17.jpg"
                          alt=""
                        />
                        <div
                          className="transform -rotate-90 
        md:rotate-0 align-middle text-xl font-semibold 
        text-black text-center m-auto md:m-0 md:mt-8"
                        >
                          {room.name}
                        </div>
                        <ul className="text-xs text-black font-light hidden md:block">
                          <li>👩‍🏫 Master: {room.master.name}</li>
                          <li>🏫 Subject: {room.subject}</li>
                          <li>🧑‍🎓 Members: {room.members}</li>
                          <li
                            id="passwordBox"
                            hidden={room.password === undefined}
                          >
                            <label
                              className="bg-transparent border-gray-300"
                              htmlFor="password"
                            >
                              🔐 Password:
                            </label>
                            <input
                              required
                              className="bg-transparent rounded rounded-full border border-black text-xs ml-3"
                              type="password"
                              id="passwordRoom"
                            />
                          </li>
                        </ul>
                        <div className="flex w-full justify-around">
                          <button
                            onClick={() => handleJoin(room)}
                            value={room}
                            className="bg-red-700 text-white font-bold rounded rounded-full w-24 h-8 mt-1"
                          >
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div></div>

          <div className="flex justify-center space-x-96 mt-48 w-screen">
            <div>
              <button
                onClick={handlePrevPage}
                id="btnNextPage"
                className="bg-red-800 text-white text-center 
        w-32 h-6 rounded rounded-full shadow shadow-md 
        hover:bg-red-700"
              >
                Previous Page
              </button>
            </div>
            <div>
              <button
                onClick={handleClickOpen}
                id="btnRoom"
                className="bg-red-800 text-white text-center w-60 h-20 rounded rounded-full shadow shadow-md hover:bg-red-700"
              >
                CREATE ROOM
              </button>
              <Dialog
                id="roomdialog"
                open={this.state.open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Create Room</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Room name"
                    type="name"
                    fullWidth
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                  <TextField
                    margin="dense"
                    id="subject"
                    label="Subject"
                    type="subject"
                    fullWidth
                    onChange={(e) => this.setState({ subject: e.target.value })}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleCheckbox}
                        name="checked"
                        checked={this.state.checked}
                      />
                    }
                    label="Private Room"
                  />
                  {this.state.checked && (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="password"
                      label="Password"
                      type="password"
                      fullWidth
                      onChange={(e) =>
                        this.setState({ password: e.target.value })
                      }
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} color="primary">
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                id="pswDialog"
                open={this.state.pswDialog}
                onClose={handlePswClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Insert Password
                </DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password2"
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePswClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmJoin} color="primary">
                    Join
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
              <button
                onClick={handleNextPage}
                id="btnNextPage"
                className="bg-red-800 text-white text-center w-32 h-6 rounded rounded-full shadow shadow-md hover:bg-red-700"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
