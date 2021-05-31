import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';

export default function Reset() {
  const [newpassword, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newpassword !== confirmpassword) {
      document.getElementById('alert')?.remove();
      const alertDiv = document.createElement('div');
      alertDiv.id = 'alert';
      alertDiv.className =
        'bg-gradient-to-l from-red-100 via-white to-white border-r-4 border-red-500 text-orange-700 my-3 p-4 flex flex-col items-end';
      alertDiv.role = 'alert';
      const errorTitle = document.createElement('p');
      errorTitle.id = 'errT';
      errorTitle.innerHTML = 'RESET PASSWORD FAILED';
      const errorBody = document.createElement('p');
      errorBody.id = 'errB';
      errorBody.innerHTML = 'Password does not match.';

      alertDiv.appendChild(errorTitle);
      alertDiv.appendChild(errorBody);
      document.getElementById('main').prepend(alertDiv);
      return;
    }
    const code = document.location.href.split('reset/')[1];
    if (code === '') window.location.href = 'http://localhost:3000/';

    const response = await fetch('http://localhost:5000/api/passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ id: code }),
    });

    const codeFound = await response.json();
    console.log(codeFound);
    if (codeFound.length > 0) {
      if (!codeFound[0].isUsed) {
        const code_ = codeFound[0];

        const response = await fetch('http://localhost:5000/api/users/reset', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: code_.user,
            code: code,
            password: newpassword,
          }),
        });

        const result = await response.json();
        if (result.title === 'Success') {
          document.getElementById('alert')?.remove();
          const alertDiv = document.createElement('div');
          alertDiv.id = 'alert';
          alertDiv.className =
            'bg-gradient-to-l from-green-100 via-white to-white border-r-4 border-green-500 text-black my-3 p-4 flex flex-col items-end';
          alertDiv.role = 'alert';
          const errorTitle = document.createElement('p');
          errorTitle.id = 'errT';
          errorTitle.innerHTML = 'RESET PASSWORD SUCCESS';
          const errorBody = document.createElement('p');
          errorBody.id = 'errB';
          errorBody.innerHTML = 'You have succesfully reset your password';

          alertDiv.appendChild(errorTitle);
          alertDiv.appendChild(errorBody);
          document.getElementById('main').prepend(alertDiv);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          window.location.href = 'http://localhost:3000/';
          return;
        }
      } else {
        document.getElementById('alert')?.remove();
        console.log(response);
        const alertDiv = document.createElement('div');
        alertDiv.id = 'alert';
        alertDiv.className =
          'bg-gradient-to-l from-red-100 via-white to-white border-r-4 border-red-500 text-orange-700 my-3 p-4 flex flex-col items-end';
        alertDiv.role = 'alert';
        const errorTitle = document.createElement('p');
        errorTitle.id = 'errT';
        errorTitle.innerHTML = 'RESET PASSWORD FAILED';
        const errorBody = document.createElement('p');
        errorBody.id = 'errB';
        errorBody.innerHTML = 'Reset password link expired or already used.';

        alertDiv.appendChild(errorTitle);
        alertDiv.appendChild(errorBody);
        document.getElementById('main').prepend(alertDiv);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.href = 'http://localhost:3000/';
        return;
      }
    }
  };

  return (
    <div id="main">
      <div className="bg-white max-w-md mx-auto p-8 md:p-12 my-10 rounded-lg shadow-lg border border-red-600">
        <div className="flex justify-center">
          <h3 className="font-bold text-2xl text-red-800">RESET PASSWORD</h3>
        </div>
        <section className="mt-10">
          <form className="flex flex-col" onSubmit={handleChangePassword}>
            <div className="mb-6 pt-3 rounded bg-gray-200">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                htmlFor="newpassword"
              >
                New Password
              </label>
              <input
                required
                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-800 transition duration-500 px-3 pb-3"
                type="password"
                id="newpassword"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6 pt-3 rounded bg-gray-200">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                htmlFor="confirmpassword"
              >
                Confirm Password
              </label>
              <input
                required
                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-800 transition duration-500 px-3 pb-3"
                type="password"
                id="confirmpassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-center">
                <button className="bg-red-800 text-white font-bold py-3 px-8 rounded hover:bg-red-600 shadow">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
