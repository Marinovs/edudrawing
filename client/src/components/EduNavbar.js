import React from 'react';
import { Link } from 'react-router-dom';

function notAuthenticated() {
  return (
    <div id="navbar w-full">
      <nav className="bg-red-800 px-4">
        <div className="py-5">
          <div className="flex justify-between">
            <div calss="hidden md:flex flex">
              <a className="hidden md:flex text-white font-bold " href="/">
                EduDrawing
              </a>
            </div>
            <div className="hidden md:flex flex items-center space-x-12">
              <ul>
                <li>
                  <ul className="flex flex-row  ">
                    <li className="py-2 px-10 text-white text-xl hover:text-gray-200">
                      <Link to="/login">Login</Link>
                    </li>
                    <li
                      className="py-3 px-10 ml-r bg-gray-100 text-red-800 rounded
                    shadow hover:bg-gray-200"
                    >
                      <Link to="/register">Register</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={showSubMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div id="subMenu" hidden className="md:hidden">
          <Link
            className="block py-2 px-4 text-sm text-white hover:bg-gray-200 hover:text-red-800"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="block py-2 px-4 text-smt text-white hover:bg-gray-200 hover:text-red-800"
            to="/register"
          >
            Register
          </Link>
        </div>
      </nav>
    </div>
  );
}

function authenticated() {
  return (
    <div id="navbar">
      <nav className="bg-red-800 w-full inline-block">
        <div className="px-8 py-5 mx-10">
          <div className="flex justify-between">
            <div className="flex items-center space-x-6">
              <a className="text-white text-xl font-bold text-center" href="/">
                EduDrawing
              </a>
            </div>
            <div className="hidden md:flex flex items-center space-x-12">
              <ul>
                <li>
                  <div className="flex items-center space-x-6">
                    <Link
                      className="font-bold text-white uppercase"
                      to="/myprofile"
                    >
                      {token.name}
                    </Link>
                    <div className="flex flex-row rounded-full bg-white h-14 w-14 items-center">
                      <img
                        alt=""
                        className="rounded-full bg-white h-14 w-14 items-center"
                        src={
                          getToken().info?.img !== ''
                            ? '/uploads/' + getToken().info?.img
                            : 'https://image.flaticon.com/icons/png/512/847/847969.png'
                        }
                      />
                    </div>
                    <div>
                      <button onClick={showSubMenu}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={showSubMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div id="subMenu" hidden>
          <Link
            className="flex py-2 px-4 text-sm text-white hover:bg-gray-200 hover:text-red-800"
            to="/myprofile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </Link>
          <Link
            className="flex py-2 px-4 text-sm text-white hover:bg-gray-200 hover:text-red-800"
            to="/myrooms"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            My Rooms
          </Link>
          <Link
            className="flex py-2 px-4 text-sm text-white hover:bg-gray-200 hover:text-red-800"
            to="/"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Link>
        </div>
      </nav>
    </div>
  );
}

function getToken() {
  const tkn = sessionStorage.getItem('user');
  return JSON.parse(tkn);
}

function logout() {
  window.location.reload();
  sessionStorage.clear();
  window.location.href = 'http://localhost:3000/';
}

function showSubMenu() {
  document.getElementById('subMenu').hidden =
    !document.getElementById('subMenu').hidden;
}

const token = getToken();

export default function EduNavbar() {
  if (token) {
    return authenticated();
  }
  return notAuthenticated();
}
