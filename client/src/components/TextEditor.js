/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

import { pdfExporter } from 'quill-to-pdf';
import { saveAs } from 'file-saver';

import {
  Button,
  Dialog,
  DialogTitle,
  Typography,
  ListItemIcon,
  DialogContent,
} from '@material-ui/core';

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, 7, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
  ['room'],
  ['close'],
  ['download'],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [openRoomInfo, setOpenRoomInfo] = useState(false);
  const [openCloseRoom, setOpenCloseRoom] = useState(false);
  const [openMembersInfo, setOpenMembersInfo] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const room = JSON.parse(sessionStorage.getItem('room'));

  let [writers, setWriters] = useState([]);

  useEffect(() => {
    const roomButton = document.getElementsByClassName('ql-room')[0];
    roomButton.type = 'submit';
    roomButton.addEventListener('click', () => {
      setOpenRoomInfo(true);
    });

    const closeButton = document.getElementsByClassName('ql-close')[0];
    closeButton.type = 'submit';
    closeButton.addEventListener('click', () => {
      if (room.master._id === user._id) setOpenCloseRoom(true);
    });
  }, []);

  useEffect(() => {
    if (quill === undefined || room === undefined) return;

    const downloadButton = document.getElementsByClassName('ql-download')[0];
    downloadButton.type = 'submit';
    downloadButton.addEventListener('click', async () => {
      const quillDelta = quill.getContents();
      const pdfBlob = await pdfExporter.generatePdf(quillDelta);
      saveAs(pdfBlob, `${room.name}_${room.subject}.pdf`);
    });
  }, [quill]);

  const handleRoomInfoClose = () => {
    setOpenRoomInfo(false);
  };

  const handleCloseRoomMembers = () => {
    setOpenMembersInfo(false);
  };

  const handleCloseMember = () => {
    setOpenMember(false);
  };

  const handleOpenRoomMembers = () => {
    setOpenMembersInfo(true);
  };

  const handleOpenMember = (u) => {
    setSelectedMember(u);
    if (room.master._id === user._id) setOpenMember(true);
  };

  const handleViewProfile = () => {
    console.log(selectedMember.user._id);
    sessionStorage.setItem(
      'selected_user',
      JSON.stringify(selectedMember.user)
    );
    window.location.href = `http://localhost:3000/profile/${selectedMember.user._id}`;
  };

  const handleGrantPermission = () => {
    if (socket == null) return;
    socket.emit('send-permission', selectedMember, room);
  };

  const handleRemovePermission = () => {
    if (socket == null) return;
    socket.emit('send-remove-permission', selectedMember, room);

    window.location.reload();
  };

  const handleRoomCancellation = async () => {
    const response = await fetch('http://localhost:5000/api/rooms', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: room._id,
      }),
    });

    const data = await response.json();
    if (data.status === 200) {
      socket.emit('send-kick');
    } else {
      const msg = document.createElement('p');
      msg.innerHTML = `Cannot delete the room.`;
      const perm = document.getElementById('permission-r');
      perm.appendChild(msg);
      perm.hidden = false;
    }
  };

  useEffect(() => {
    const s = io('http://localhost:5001');
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once('load-page', (page) => {
      if (page === null) {
        window.location.href = 'http://localhost:3000/rooms';
        return;
      }
      quill.setContents(page);
      quill.enable();
    });

    socket.emit('get-page', room.master, user, documentId);
  }, [quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit('save-page', quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };
    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill, user, writers]);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on('receive-users', function (users, r) {
      setMembers(users);
    });
  }, [socket]);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on('receive-writers', function (data) {
      setWriters(data);
      let found = false;

      for (const u in data) {
        if (data[u].user._id === user._id) found = true;
      }
      if (!found) quill.enable(false);
    });
  }, [socket]);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on('receive-permission', function (data, su) {
      const msg = document.createElement('p');
      msg.innerHTML = `${su.user.name} ${su.user.surname} can now write, please refresh page\n(Click to hide)`;
      const perm = document.getElementById('permission-s');
      perm.appendChild(msg);
      perm.hidden = false;
      setWriters(data);
      let found = false;

      for (const u in data) {
        console.log(data[u].user.name);
        if (data[u].user._id === user._id) found = true;
      }
      if (!found) quill.enable(false);
    });
  }, [socket]);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on('receive-kick', async function (m) {
      const msg = document.createElement('p');
      msg.innerHTML = `Room will be deleted in 3 seconds...`;
      const perm = document.getElementById('permission-r');
      perm.appendChild(msg);
      perm.hidden = false;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      sessionStorage.removeItem('room');
      window.location.href = 'http://localhost:3000/rooms';
    });
  }, [socket]);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on('receive-remove-permission', function (data, su) {
      const msg = document.createElement('p');
      msg.innerHTML = `${su.user.name} ${su.user.surname} cannot write anymore<br>\n(Click to hide)`;
      const perm = document.getElementById('permission-r');
      perm.appendChild(msg);
      perm.hidden = false;
      setWriters(data);
      let found = false;

      for (const u in data) {
        console.log(data[u].user.name);
        if (data[u].user._id === user._id) found = true;
      }
      if (!found) quill.enable(false);
    });
  }, [socket]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    editor.id = 'quill-editor';
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText('Loading...');
    console.log(q);
    setQuill(q);
  }, []);
  return (
    <div className="flex flex-row justify-center">
      <div className="container" ref={wrapperRef}></div>
      <Dialog
        onClose={handleRoomInfoClose}
        open={openRoomInfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Room: ${room.name}`}</DialogTitle>
        <DialogContent id="alert-dialog-content">
          <li>👩‍🏫 Master: {room.master.name}</li>
          <li>🏫 Subject: {room.subject}</li>
          <button onClick={handleOpenRoomMembers}>
            🧑‍🎓 Members: Click to show...
          </button>
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={handleCloseRoomMembers}
        open={openMembersInfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`${members.length} members`}</DialogTitle>
        <ListItemIcon className="flex flex-col justify-center">
          {members.map((u, i) => (
            <ul key={u._id} className="no-underline !important">
              <div className="flex flex-row space-x-2 ">
                <img
                  className="rounded-full bg-white h-8 w-8 mx-2 my-2"
                  alt=""
                  src={
                    u.user.info.img !== ''
                      ? '/uploads/' + u.user.info.img
                      : 'https://image.flaticon.com/icons/png/512/847/847969.png'
                  }
                />
                <button value={u} onClick={() => handleOpenMember(u)}>
                  {u.user.name}
                </button>
              </div>
            </ul>
          ))}
        </ListItemIcon>
      </Dialog>
      <Dialog
        onClose={handleCloseMember}
        open={openMember}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Select an action!</DialogTitle>
        <Button onClick={handleViewProfile}>View Profile</Button>
        <Button onClick={handleGrantPermission}>Grant permess to write</Button>
        <Button onClick={handleRemovePermission}>
          Remove permess to write
        </Button>
      </Dialog>
      <Dialog onClose={() => setOpenCloseRoom(false)} open={openCloseRoom}>
        <DialogTitle>ROOM CANCELLATION</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure that you want delete this room? Contents will be delete
            permanently
          </Typography>
          <Button
            onClick={handleRoomCancellation}
            variant="contained"
            color="primary"
          >
            YES
          </Button>
          <Button
            onClick={() => setOpenCloseRoom(false)}
            variant="contained"
            color="secondary"
          >
            NO
          </Button>
        </DialogContent>
      </Dialog>
      <div
        id="permission-s"
        hidden
        onClick={() => (document.getElementById('permission-s').hidden = true)}
        className="float-right w-2/3 h-auto z-10 my-32 absolute 
        justify-item-end text-center font-bold uppercase"
      ></div>
      <div
        id="permission-r"
        hidden
        onClick={() => (document.getElementById('permission-r').hidden = true)}
        className="float-right w-2/3 h-auto bg-gray-100 border border-red-200 z-10 my-32 absolute 
        justify-item-end text-center font-bold uppercase"
      ></div>
    </div>
  );
}
