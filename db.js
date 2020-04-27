// TODO: REMEMBER TO ADD NEW FUNCTIONS TO module.exports

// placeholder for database
let rooms = {};

const message_types = {
  CHAT: "chat",
  INFO: "info",
};

const socket_routes = {
  NEW_USER: "new user",
  ERROR: "error",
  PERSON_JOIN: "person joined",
  CHAT_MESSAGE: "chat message",
  WHISPER: "whisper",
  USER_DISCONNECT: "user disconnected",
  CHAT_HISTORY: "chat history",
};

/**
 * Stores a chat to a database.
 * @param {Room name} room
 * @param {Socket ID of the person who sent the message} socketID
 * @param {contents of message} msg
 * @param {Date as a string} time
 * These are encrypted WHEN they arrive from the client.
 */
function addChatToRoom(room, socketID, msg, time, type) {
  // set id to 1 plus the number of messages
  let id = rooms[room].messages.length + 1;

  rooms[room].messages.push({
    name: rooms[room].people[socketID],
    text: msg,
    time,
    type,
    id,
  });
}

/**
 * Given a room, return the chat history of that room.
 * @param {Name of room} room
 * Messages are DECRYPTED by the client AFTER being sent back.
 */
function chatHistory(room) {
  return rooms[room].messages;
}

/**
 * Returns whether the given room exists.
 * @param {Room name} room
 */
function roomExists(room) {
  if (rooms[room]) return true;
  return false;
}

/**
 * Checks if the given password is the same as the one
 * in the given room.
 * @param {The name of the room} room
 * @param {The hashed client password} password
 */
function correctPassword(room, password) {
  console.log(`${rooms[room].password}==${password}`);
  return rooms[room].password == password;
}

/**
 * Creates a new room with the given room name and password.
 * @param {Room name} room
 * @param {Hashed password} password
 * Password is HASHED before being stored.
 */
function createRoom(room, password) {
  rooms[room] = {
    password,
    people: {},
    messages: [],
  };
}

/**
 * Given a room, return the time of its last message.
 * @param {Name of room} room
 */
function timeOfLastMessage(room) {
  return rooms[room].timeOfLastMessage;
}

/**
 * Returns the room name of a user given their socket ID
 */
function getRoomFromID(socketID) {
  for (room in rooms) {
    if (rooms[room].people[socketID]) {
      return room;
    }
  }

  return false;
}

/**
 * Checks if a name already exists in a given room.
 */
function nameAlreadyExists(room, name) {
  for (i in rooms[room].people) {
    if (rooms[room].people[i] == name) {
      return true;
    }
  }

  return false;
}

/**
 * Returns the socket ID of a person in a room given their name.
 * @param {Room name} room
 * @param {Name of person in the room} name
 */
function getIdFromName(room, name) {
  for (i in rooms[room].people) {
    if (rooms[room].people[i] == name) {
      return i;
    }
  }
  return false;
}

/**
 * Returns the hashed version of some string `p`
 * @param {Password or any string} p
 */
function hash(p) {
  return SHA512(p).toString(CryptoJS.enc.Base64);
}

/**
 * Adds a new person to the list of clients in a given room.
 * @param {Room name} room
 * @param {Name of new client} name
 * @param {socket ID of the new client} socketID
 */
function addNewPersonToRoom(room, name, socketID) {
  rooms[room].people[socketID] = name;
}

/**
 * Stores the admin password for the given room.
 * @param {Name of room} room
 * @param {hashed admin password for the given room} adminPasswordHash
 */
function storeAdminPassword(room, adminPasswordHash) {
  rooms[room].adminPassword = adminPasswordHash;
}

/**
 * Returns if the room has been created
 * @param {Name of room} room
 */
function hasBeenCreated(room) {
  if (!rooms[room]) {
    return false;
  } else {
    return true;
  }
}

/**
 * Returns if the supplied admin password is the one for the room.
 * @param {Name of the room} room
 * @param {UN-hashed admin password} adminPassword
 * adminPassword is NOT hashed when stored in DB
 */
function correctAdminPassword(room, adminPassword) {
  let adminPasswordHash = adminPassword;
  if (
    rooms[room] &&
    rooms[room].adminPassword &&
    rooms[room].adminPassword == adminPasswordHash
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Delete all messages from a room.
 * @param {Name of room} room
 */
function emptyRoom(room) {
  rooms[room].messages = [];
}

/**
 * For working with times.
 * Given any date (object), it returns a Date object converted to UTC time.
 */
function convertDateToUTC(date) {
  return date.toUTCString();
}

/**
 * Given a date, return a STRING formatted like so:
 *          January 2, 2020
 * @param {Date object} date
 */
function getMonthDayYearString(date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let res = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;

  return res;
}

/**
 * Removes a person from the list of people in a room.
 * @param {Room name} room
 * @param {Socket ID} socketID
 */
function deletePerson(room, socketID) {
  delete rooms[room].people[socketID];
}

/**
 * Returns the associated name of a socketID.
 * @param {*} socketID
 */
function getNameFromID(room, socketID) {
  return rooms[room].people[socketID];
}

module.exports = {
  addChatToRoom,
  chatHistory,
  roomExists,
  correctPassword,
  createRoom,
  timeOfLastMessage,
  getRoomFromID,
  nameAlreadyExists,
  getIdFromName,
  hash,
  addNewPersonToRoom,
  storeAdminPassword,
  hasBeenCreated,
  correctAdminPassword,
  emptyRoom,
  convertDateToUTC,
  getMonthDayYearString,
  deletePerson,
  getNameFromID,
  message_types,
  socket_routes,
  rooms,
};