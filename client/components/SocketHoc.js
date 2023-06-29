import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";
import MessageNotificationModal from "./Home/MessageNotificationModal";
import NotificationPortal from "./Home/NotificationPortal";
import socket from "@/service/socket";

function SocketHoc({ user }) {
  const router = useRouter();

  const emitted = useRef(false);
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopup, showNotificationPopup] = useState(false);

  // prettier-ignore
  const handleNewMsg = useCallback(async ({ newMsg }) => {
    const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

    if (user.newMessagePopup) {
      setNewMessageReceived({
        ...newMsg,
        senderName: name,
        senderProfilePic: profilePicUrl
      });
      showNewMessageModal(true);
    }
    newMsgSound(name);
  }, [user]);

  const handleNewNotification = useCallback(newNotification => {
    const { name, profilePicUrl, username, postId } = newNotification;
    setNewNotification({ name, profilePicUrl, username, postId });
    showNotificationPopup(true);
  }, []);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    if (!emitted.current) {
      socket.emit("join", { userId: user._id });
      emitted.current = true;
    }

    if (router.pathname === "/messages") return;

    const evts = [
      { name: "newMsgReceived", cb: handleNewMsg },
      { name: "newNotificationReceived", cb: handleNewNotification }
    ];

    evts.forEach(({ name, cb }) => socket.on(name, cb));

    return () => {
      evts.forEach(({ name, cb }) => socket.off(name, cb));
    };
  }, [user, router, handleNewMsg, handleNewNotification]);

  return (
    <>
      {notificationPopup && newNotification !== null && (
        <NotificationPortal
          newNotification={newNotification}
          notificationPopup={notificationPopup}
          showNotificationPopup={showNotificationPopup}
        />
      )}

      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}
    </>
  );
}

export default SocketHoc;
