const generateMessages = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

export default generateMessages;
