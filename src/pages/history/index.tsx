import HistoryQueueTable from '@/components/HistoryQueuetable';
import { type AddHistoryQuery, type History, type Setting } from '@/utils/openapi';
import { useAPI } from '@/utils/useAPI';
import { useUserinfo } from '@/utils/useUserinfo';
import { AppShell, Button, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCircleX } from '@tabler/icons-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Earn from '../../components/Earn';
import HistoryTable from '../../components/Historytable';
import { Comp_Navbar } from '../../components/Navbar';


export default function History() {
  const api = useAPI();
  const userinfo = useUserinfo();

  const [paymentData, setPaymentData] = useState<History[]>([]);
  const [paymentQueueData, setPaymentQueueData] = useState<AddHistoryQuery[]>([]);
  const [settingData, setSettingData] = useState<Setting | undefined>(undefined);

  const sendHistoryQueue = () => {
    if (!api) return;
    api.then((api) => api.flushHistory()).then((res) => {
      if (res.status == "COMPLETE") {
        notifications.show({
          id: 'done-queuesend',
          withCloseButton: true,
          autoClose: 5000,
          title: "決済が正常に記録されました",
          message: "決済記録が正常に記録されました。",
          color: 'green',
          icon: <IconCheck />,
          className: 'my-notification-class',
          loading: false,
        })
      } else {
        notifications.show({
          id: 'error-queuesend',
          withCloseButton: true,
          autoClose: 5000,
          title: "送信できませんでした",
          message: "アプリの再起動時に再試行されます。",
          color: 'red',
          icon: <IconCircleX />,
          className: 'my-notification-class',
          loading: false,
        });
      }
    }).finally(() => {
      getHistoryQueue()
    })
  }

  const getHistoryQueue = () => {
    if (!api) return;
    api.then(api => api.getHistoryQueue()).then((res) => {
      setPaymentQueueData(res ?? []);
    })
  }

  const fetchHistory = () => {
    if (!api || !userinfo) return;
    userinfo
      .then((user) => {
        api.then(api => {
          api.fetchHistory({ className: user.userClass }).then((res) => {
            setPaymentData(res);
          })
          api.getSetting({ className: user.userClass }).then((res) => {
            setSettingData(res);
          })
        })
      })
  }

  useEffect(() => {
    fetchHistory();
    getHistoryQueue();
  }, [api, userinfo])

  return (
    <>
      <Head>
        <title>売上確認 | HFHS REGI SYS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        navbar={<Comp_Navbar page="売上確認" />}
      >
        <Title order={2}>売上確認<Button onClick={fetchHistory}>更新</Button></Title>
        <br />
        <Earn paymentData={paymentData} settingData={settingData}></Earn>
        <br />
        {
          paymentQueueData.length > 0 &&
          (<>
            <Title order={3}>送信待機中の会計履歴</Title><Button onClick={() => { sendHistoryQueue() }}>送信</Button>
            <HistoryQueueTable paymentData={paymentQueueData}></HistoryQueueTable>
          </>)
        }
        <br />
        <Title order={3}>会計履歴</Title>
        <br />
        <HistoryTable paymentData={paymentData}></HistoryTable>
      </AppShell>
    </>
  )
}
