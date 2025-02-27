const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  const existsUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existsUser) {
    return {
      error: "Username is in use",
    };
  }

  const user = { id, username, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

addUser({ id: 55, username: "Test", room: "TestRoom" });

console.log(users);

const userRemoved = removeUser(55);

console.log(userRemoved);
console.log(users);
