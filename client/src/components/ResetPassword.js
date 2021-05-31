import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';

export default function Reset() {
  const [email, setEmail] = useState();

  //init('user_160hjV2U1BkvN1IXQEIX2');
  const handleReset = async (e) => {
    e.preventDefault();
    const response = await fetch(
      'http://localhost:5000/api/users/findByEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      }
    );

    const data = await response.json();
    if (data.user.length > 0) {
      console.log(emailjs);
      emailjs
        .sendForm(
          'service_ch81o74',
          'template_9nenoi7',
          e.target,
          'user_160hjV2U1BkvN1IXQEIX2'
        )
        .then(
          async (result) => {
            const resp = await fetch(
              'http://localhost:5000/api/passwords/put',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user: data.user[0]._id,
                  code: document.getElementById('message').value,
                }),
              }
            );

            document.getElementById('alert')?.remove();
            const alertDiv = document.createElement('div');
            alertDiv.id = 'alert';
            alertDiv.className =
              'bg-gradient-to-l from-green-100 via-white to-white border-r-4 border-green-500 text-black my-3 p-4 flex flex-col items-end';
            alertDiv.role = 'alert';
            const errorTitle = document.createElement('p');
            errorTitle.id = 'errT';
            errorTitle.innerHTML = 'RESET PASSWORD SEND';
            const errorBody = document.createElement('p');
            errorBody.id = 'errB';
            errorBody.innerHTML = 'Password reset link was sent to your email.';

            alertDiv.appendChild(errorTitle);
            alertDiv.appendChild(errorBody);
            document.getElementById('main').prepend(alertDiv);
          },
          (error) => {
            console.log(error.text);
          }
        );
    } else {
      console.log('no');
    }
  };

  return (
    <div id="main">
      <div className="bg-white max-w-md mx-auto p-8 md:p-12 my-10 rounded-lg shadow-lg border border-red-600">
        <div className="flex justify-center">
          <h3 className="font-bold text-2xl text-red-800">RESET PASSWORD</h3>
        </div>
        <section className="mt-10">
          <form className="flex flex-col" onSubmit={handleReset}>
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
                name="user_email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                id="message"
                name="message"
                hidden
                value={uuidv4()}
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
