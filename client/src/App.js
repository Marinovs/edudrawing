import EduNavbar from './components/EduNavbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Rooms from './components/Rooms';
import TextEditor from './components/TextEditor';
import Profile from './components/Profile';

import { EduFooter } from './components/EduFooter';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MyRooms from './components/MyRooms';

function App() {
  return (
    <div>
      <BrowserRouter>
        <EduNavbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/rooms">
            <Rooms />
          </Route>
          <Route exact path="/rooms/:id">
            <TextEditor />
          </Route>
          <Route exact path="/myprofile">
            <Profile />
          </Route>
          <Route exact path="/myrooms">
            <MyRooms />
          </Route>
        </Switch>
      </BrowserRouter>
      <EduFooter />
    </div>
  );
}

export default App;
