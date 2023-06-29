const newMsgSound = senderName => {
  const sound = new Audio("/light.mp3");

  if (sound) sound.play().catch(err => console.log(err));

  if (senderName) {
    const changeBackDocTitle = document.title;
    document.title = `New message from ${senderName}`;

    setTimeout(() => {
      document.title = changeBackDocTitle;
    }, 5000);
    // if (document.visibilityState === "visible") {
    //   setTimeout(() => {
    //     document.title = "Messages";
    //   }, 5000);
    // }
  }
};

export default newMsgSound;
