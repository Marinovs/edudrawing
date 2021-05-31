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
import Reset from './components/ResetPassword';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';

function App() {
  return (
    <div className="flex flex-col ">
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
        <Route exact path="/profile/:id">
          <Profile />
        </Route>
        <Route exact path="/reset">
          <Reset />
        </Route>
        <Route exact path="/reset/:id">
          <ResetPasswordConfirm />
        </Route>
      </BrowserRouter>
      <EduFooter />
    </div>
  );
}

export default App;
