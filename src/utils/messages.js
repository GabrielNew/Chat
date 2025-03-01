const generateMessages = (username = "Admin", text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

export default generateMessages;
