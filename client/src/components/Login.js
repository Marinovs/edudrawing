import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

async function login(user) {
  return fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then((data) => data.json());
}

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login({
      email,
      password,
    }).catch((err) => {
      console.log('ERR: ', err);
    });
    if (response.token === undefined) {
      document.getElementById('alert')?.remove();
      console.log(response);
      const alertDiv = document.createElement('div');
      alertDiv.id = 'alert';
      alertDiv.className =
        'bg-gradient-to-l from-red-100 via-white to-white border-r-4 border-red-500 text-orange-700 my-3 p-4 flex flex-col items-end';
      alertDiv.role = 'alert';
      const errorTitle = document.createElement('p');
      errorTitle.id = 'errT';
      errorTitle.innerHTML = 'LOGIN ERROR';
      const errorBody = document.createElement('p');
      errorBody.id = 'errB';
      errorBody.innerHTML = response.error;

      alertDiv.appendChild(errorTitle);
      alertDiv.appendChild(errorBody);
      document.getElementById('main').prepend(alertDiv);
      return;
    }
    const user = response.user;
    user.info = response.info;
    sessionStorage.setItem('user', JSON.stringify(user));
    <Redirect to="/" />;
    window.location.reload();
  };

  if (sessionStorage.getItem('user') != null) {
    return <Redirect to="/" />;
  }

  return (
    <div id="main">
      <div className="bg-white max-w-md mx-auto p-8 md:p-12 my-10 rounded-lg shadow-lg border border-red-600">
        <div className="flex justify-center">
          <h3 className="font-bold text-2xl text-red-800">Login</h3>
        </div>
        <section className="mt-10">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-6 pt-3 rounded bg-gray-200">
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
            <div className="mb-6 pt-3 rounded bg-gray-200">
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
            <div className="flex justify-start items-center">
              <div>
                <button className="bg-red-800 text-white font-bold py-3 px-8 rounded hover:bg-red-600 shadow">
                  Login
                </button>
              </div>
              <div className="flex flex-col ml-7 space-y-3">
                <Link
                  className="text-xs text-gray-400 items-center hover:text-red-800"
                  to="/register"
                >
                  Don't have an account? Register here!
                </Link>
                <Link
                  className="text-xs text-gray-400 items-center hover:text-red-800"
                  to="/reset"
                >
                  Forgot password? Reset here!
                </Link>
              </div>
            </div>
            <div className="flex justify-end items-center"></div>
          </form>
        </section>
      </div>
    </div>
  );
}
