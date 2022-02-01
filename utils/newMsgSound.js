const newMsgSound = senderName => {
  const sound = new Audio("/light.mp3");

  sound && sound.play();

  if (senderName) {
    document.title = `New message from ${senderName}`;

    let changeBackDocTitle = "";

    switch (location.pathname) {
      case "/":
        {
          changeBackDocTitle = "Welcome!";
        }
        break;

      case "/messages":
        {
          changeBackDocTitle = "Messages";
        }
        break;

      default:
        {
          changeBackDocTitle = "Welcome!";
        }
        break;
    }

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
