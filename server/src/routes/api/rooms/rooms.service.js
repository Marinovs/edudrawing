const Rooms = require('./rooms.model');

class RoomsService {
  constructor() {}

  removeMembers(id) {
    Rooms.findOne({ _id: id }, (err, room) => {
      if (err) {
        return;
      } else {
        Rooms.findOneAndUpdate(
          { _id: id },
          { members: room.members - 1 },
          { new: true },
          (er) => {}
        );
      }
    });
  }

  addMembers(id) {
    Rooms.findOne({ _id: id }, (err, room) => {
      if (err) {
        return;
      } else {
        Rooms.findOneAndUpdate(
          { _id: id },
          { members: room.members + 1 },
          { new: true },
          (er) => {}
        );
      }
    });
  }
}

module.exports = RoomsService;
