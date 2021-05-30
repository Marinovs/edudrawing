import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

async function register(user) {
  return fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then((data) => data.json());
}

let state = false;

function changeToggleState() {
  if (!state) {
    document.getElementById('togglebg').className =
      'w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out bg-red-600';
    document.getElementById('slider').className =
      'bg-white w-5 h-5 rounded-full shadow-md transform duration-300 translate-x-6';
    state = true;
  } else {
    document.getElementById('togglebg').className =
      'w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out bg-gray-300';
    document.getElementById('slider').className =
      'bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out';
    state = false;
  }
}

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [surname, setSurname] = useState();
  const [name, setName] = useState();
  const [telephone, setTelephone] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register({
      name,
      surname,
      email,
      password,
      telephone,
      state,
    }).catch((err) => {
      console.log('ERR: ', err);
    });
    if (response.token === undefined) {
      document.getElementById('alert')?.remove();
      console.log(response);
      const alertDiv = document.createElement('div');
      alertDiv.id = 'alert';
      alertDiv.className =
        'bg-gradient-to-l from-red-100 via-transparent to-transparent border-r-4 border-red-500 text-orange-700 my-3 p-4 flex flex-col items-end';
      alertDiv.role = 'alert';
      const errorTitle = document.createElement('p');
      errorTitle.id = 'errT';
      errorTitle.innerHTML = 'REGISTER ERROR';
      const errorBody = document.createElement('p');
      errorBody.id = 'errB';
      errorBody.innerHTML = response.err;

      alertDiv.appendChild(errorTitle);
      alertDiv.appendChild(errorBody);
      document.getElementById('main').prepend(alertDiv);
      return;
    }
    document.getElementById('alert')?.remove();
    console.log(response);
    const alertDiv = document.createElement('div');
    alertDiv.id = 'alert';
    alertDiv.className =
      'bg-gradient-to-l from-green-100 via-transparent to-transparent border-r-4 border-green-500 text-orange-700 my-3 p-4 flex flex-col items-end';
    alertDiv.role = 'alert';
    const errorTitle = document.createElement('p');
    errorTitle.id = 'errT';
    errorTitle.innerHTML = 'SUCCESS';
    const errorBody = document.createElement('p');
    errorBody.id = 'errB';
    errorBody.innerHTML = 'Registration completed';

    alertDiv.appendChild(errorTitle);
    alertDiv.appendChild(errorBody);
    document.getElementById('main').prepend(alertDiv);
    setTimeout(function () {
      window.location.href = 'http://localhost:3000/login';
    }, 3000);
  };

  if (sessionStorage.getItem('user') != null) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex flex-row items-center">
      <div className="float-left p-4 h-screen w-1/3 xs:hidden"></div>
      <div className="float-left h-auto mb-32 md:w-2/3 w-full flex flex-row justify-center">
        <main className="bg-white w-2/3 mx-2 rounded-lg shadow shadow-lg border border-red-600">
          <div className="flex justify-center">
            <h3 className="font-bold text-2xl text-red-800">Register</h3>
          </div>
          <section className="mt-2 mx-6">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div>
                <div className="mb-3 pt-3 rounded bg-gray-200 mx-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 ml-3 required"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    required
                    id="name"
                    className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-800 transition duration-500 px-3 pb-3"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3 pt-3 rounded bg-gray-200 mx-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                    htmlFor="surname"
                  >
                    Surname
                  </label>
                  <input
                    required
                    className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-800 transition duration-500 px-3 pb-3"
                    type="text"
                    id="surname"
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
                <div className="mb-3 pt-3 rounded bg-gray-200 mx-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    required
                    className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-800 transition duration-500 px-3 pb-3"
                    type="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3 pt-3 rounded bg-gray-200 mx-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    required
                    className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-800 transition duration-500 px-3 pb-3"
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3 pt-3 rounded bg-gray-200 mx-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                    htmlFor="telephone"
                  >
                    Telephone
                  </label>
                  <input
                    required
                    className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-800 transition duration-500 px-3 pb-3"
                    type="number"
                    id="telephone"
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>
                <div
                  id="toggle"
                  className="flex items-center justify-start"
                  onClick={changeToggleState}
                >
                  <div
                    id="togglebg"
                    className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out mx-2"
                  >
                    <div
                      id="slider"
                      className="bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out"
                    ></div>
                  </div>
                  <h3 className="text-xs ml-2 text-gray-400">
                    Are you a teacher?
                  </h3>
                </div>
              </div>
              <div className="flex justify-center max-h-screen mb-8">
                <button className="bg-red-800 text-white font-bold h-16 w-48 mt-4 rounded hover:bg-red-600 shadow">
                  Signup
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
      <div
        id="main"
        className="z-10 float-left p-4 h-screen w-1/3 xs:hidden"
      ></div>
    </div>
  );
}
