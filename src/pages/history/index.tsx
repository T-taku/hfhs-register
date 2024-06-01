import HistoryQueueTable from '@/components/HistoryQueuetable';
import type { AddHistoryRequest, History, Setting } from '@/utils/RegiAPI';
import { notif } from '@/utils/notif';
import { useAPI } from '@/utils/useAPI';
import { AppShell, Button, Group, Stack, Title } from '@mantine/core';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Earn from '../../components/Earn';
import HistoryTable from '../../components/Historytable';
import { Comp_Navbar } from '../../components/Navbar';

export default function History() {
  const api = useAPI();

  const [paymentData, setPaymentData] = useState<History[]>([]);
  const [paymentQueueData, setPaymentQueueData] = useState<AddHistoryRequest[]>([]);
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
      </Head>
      <AppShell
        navbar={<Comp_Navbar page="売上確認" />}
      >
        <Stack pb="md">
          <Group>
            <Title order={2}>売上確認</Title>
            <Button onClick={() => fetchHistory(true)}>更新</Button>
          </Group>
          <Earn paymentData={paymentData} settingData={settingData} />
        </Stack>
        {
          paymentQueueData.length > 0 &&
          (
            <Stack pb="md">
              <Group>
                <Title order={3}>送信待機中の会計履歴</Title>
                <Button onClick={() => { sendHistoryQueue() }}>送信</Button>
              </Group>
              <HistoryQueueTable paymentData={paymentQueueData}></HistoryQueueTable>
            </Stack>
          )
        }
        <Stack spacing="sm">
          <Title order={3} pb="md">会計履歴</Title>
          <HistoryTable paymentData={paymentData}></HistoryTable>
        </Stack>
      </AppShell>
    </>
  )
}
