const express = require('express');
const user = require('./api/users/user.routes');
const rooms = require('./api/rooms/rooms.routes');
const pages = require('./api/pages/pages.routes');
const userInfos = require('./api/infos/infos.routes');

const routes = [user, rooms, pages, userInfos];

module.exports = routes;
