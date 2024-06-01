import type { Setting } from '@/utils/RegiAPI';
import { useAPI } from '@/utils/useAPI';
import { useUserinfo } from '@/utils/useUserinfo';
import { AppShell, Button, Center, NumberInput, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCircleX } from '@tabler/icons-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Comp_Navbar } from '../../components/Navbar';

export default function History() {
  const api = useAPI();
  const userinfo = useUserinfo();
  const [settingData, setSettingData] = useState<Setting | undefined>()
  const [goal, setGoal] = useState<number | ''>(0);
  const [reserve, setReserve] = useState<number | ''>(0);
  const [additionalreserve, setAdditionalreserve] = useState<number | ''>(0);

  const fetchSetting = () => {
    if (api) {
      userinfo?.then((user) => {
        api.then(api => api.getSetting({ className: user.userClass })).then((res) => {
          setSettingData(res);
        })
      })
    }
  }

  useEffect(() => {
    fetchSetting()
  }, [userinfo, api])

  async function saveSetting() {
    if (!api) return
    const requestParameters = {
      className: (await userinfo)?.userClass!,
      goal: Number(goal),
      reserve: Number(reserve),
      additionalreserve: Number(additionalreserve),
    }
    try {
      api.then(api => api.setSetting(requestParameters)).then(_response => {
        notifications.show({
          id: 'donerecord',
          withCloseButton: true,
          autoClose: 5000,
          title: "設定を保存しました。",
          message: '設定を正常に保存できました。',
          color: 'green',
          icon: <IconCheck />,
          className: 'my-notification-class',
          loading: false,
        });
        fetchSetting()
      })
    } catch (e) {
      notifications.show({
        id: 'badrequest',
        withCloseButton: true,
        autoClose: 5000,
        title: "正常に保存できませんでした。",
        message: '設定が正常に保存されていません。もう一度お試しください。',
        color: 'red',
        icon: <IconCircleX />,
        className: 'my-notification-class',
        loading: false,
      });
    }
  }

  return (
    <>
      <Head>
        <title>店舗設定 | HFHS REGI SYS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        navbar={<Comp_Navbar page="店舗設定" />}
      >
        <Title order={2}>店舗設定</Title>
        <br />
        <Title order={3}>目標売り上げ</Title>
        <Text>ここでの目標売上は、1日での売上額を指定してください。売上確認ページに反映されます。(現在の設定額: {String(settingData?.goal ?? "設定なし")}円)</Text>
        <NumberInput size="sm" label="目標売り上げ" placeholder={String(settingData?.goal ?? "設定なし")} className="" onChange={setGoal} />
        <br />
        <Title order={3}>準備金</Title>
        <Text>生徒と先生の準備金の合計を入力してください。(現在の設定額: {String(settingData?.reserve ?? "設定なし")}円)</Text>
        <NumberInput size="sm" label="準備金" placeholder={String(settingData?.reserve ?? "設定なし")} className="" onChange={setReserve} />
        <br />
        <Title order={3}>追加準備金</Title>
        <Text>追加で必要になった準備金を入力してください。(現在の設定額: {String(settingData?.additionalreserve ?? "設定なし")}円)</Text>
        <NumberInput size="sm" label="準備金" placeholder={String(settingData?.additionalreserve ?? "設定なし")} className="" onChange={setAdditionalreserve} />
        <br />
        <Center>
          <Button size={"md"} onClick={() => { saveSetting() }}>保存</Button>
        </Center>
      </AppShell>
    </>
  )
}