import { notifications } from "@mantine/notifications";
import { IconCheck, IconCircleX } from "@tabler/icons-react";

export function notif(param: "DONERECORD" | "QUEUE" | "FAILWARN" | "FAIL" | "SENT" | "ERROR", error?: Error) {
  const defaultNotif = {
    message: "",
    withCloseButton: true,
    autoClose: 5000,
    icon: <IconCheck />,
    className: 'my-notification-class',
    loading: false,
  };

  const notifs = {
    "DONERECORD": {
      id: 'donerecord',
      title: "決済が完了しました",
      message: '決済記録が正常に記録されました。',
      color: 'green',
    },
    "SENT": {
      title: "決済が正常に記録されました",
      message: "決済記録が正常に記録されました。",
      color: 'green',
    },
    "QUEUE": {
      id: 'queuedrecord',
      title: "決済記録が送信できませんでした",
      message: '決済記録はアプリ内に保存されました。アプリ再起動時に再試行されます。',
      color: 'red',
    },
    "FAIL": {
      id: 'error-queuesend',
      title: "送信できませんでした",
      message: "アプリの再起動時に再試行されます。",
      color: 'red',
      icon: <IconCircleX />,
    },
    "FAILWARN": {
      id: 'warn-queuesend',
      title: "以前の決済の記録が送信されていません",
      message: "アプリの再起動時に再試行されます。",
      color: 'red',
      icon: <IconCircleX />,
    },
    "ERROR": {
      id: 'error',
      title: "決済が記録できませんでした",
      message: 'これはアプリのバグの可能性があります。\n' + (error ? (error.name + ": " + error.message) : ""),
      color: 'red',
      icon: <IconCircleX />,
    }
  }
  notifications.show({ ...defaultNotif, ...notifs[param] })
}
