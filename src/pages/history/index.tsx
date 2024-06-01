import HistoryQueueTable from '@/components/HistoryQueuetable';
import { type AddHistoryQuery, type History, type Setting } from '@/utils/openapi';
import { useAPI } from '@/utils/useAPI';
import { AppShell, Button, Title } from '@mantine/core';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Earn from '../../components/Earn';
import HistoryTable from '../../components/Historytable';
import { Comp_Navbar } from '../../components/Navbar';
import { notif } from '@/utils/notif';


export default function History() {
  const api = useAPI();

  const [paymentData, setPaymentData] = useState<History[]>([]);
  const [paymentQueueData, setPaymentQueueData] = useState<AddHistoryQuery[]>([]);
  const [settingData, setSettingData] = useState<Setting | undefined>(undefined);

  const sendHistoryQueue = () => {
    if (!api) return;
    api.flushHistory().then((res) => {
      if (res.status == "COMPLETE") {
        notif("SENT");
      } else {
        notif("FAIL");
      }
    }).finally(() => {
      getHistoryQueue()
    })
  }

  const getHistoryQueue = () => {
    if (!api) return;
    api.getHistoryQueue().then((res) => {
      setPaymentQueueData(res ?? []);
    })
  }

  const fetchHistory = (force?: boolean) => {
    if (!api) return;
    api.fetchHistory(force).then((res) => {
      setPaymentData(res);
    })
    api.getSetting().then((res) => {
      setSettingData(res);
    })
  }

  useEffect(() => {
    fetchHistory(true);
    getHistoryQueue();
  }, [api])

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
        <Title order={2}>売上確認<Button onClick={() => fetchHistory(true)}>更新</Button></Title>
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
