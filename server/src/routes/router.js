const express = require('express');
const user = require('./api/users/user.routes');
const rooms = require('./api/rooms/rooms.routes');
const pages = require('./api/pages/pages.routes');
const userInfos = require('./api/infos/infos.routes');
const passwords = require('./api/passwords/passwords.routes');

const routes = [user, rooms, pages, userInfos, passwords];

module.exports = routes;
