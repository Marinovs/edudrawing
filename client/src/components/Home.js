import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export default class Home extends Component {
  componentDidMount() {
    sessionStorage.removeItem('room');
  }

  render() {
    return (
      <div className="flex flex-col">
        <div className="mt-60">
          <h1 id="animated" className="hidden md:block text-center">
            <p>E</p>
            <p>d</p>
            <p>u</p>
            <p>D</p>
            <p>r</p>
            <p>a</p>
            <p>w</p>
            <p>i</p>
            <p>n</p>
            <p>g</p>
          </h1>
          <h1
            id="notAnimated"
            className="md:hidden block block-row text-center"
          >
            <p className="text-bold">EduDrawing</p>
          </h1>
        </div>
        <div className="flex justify-center mt-16">
          <div />
          <div>
            <Link to="/rooms">
              <button className="bg-red-800 text-white text-center w-60 h-20 rounded rounded-full shadow shadow-md hover:bg-red-700">
                FIND ROOM
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
