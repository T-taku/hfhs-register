import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import { AppShell, Title, Text } from '@mantine/core';

export default function Contact() {
  return (
    <>
      <Head>
        <title>困った時は | HFHS REGI SYS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        navbar={<Comp_Navbar page="困った時は"/>}
      >
        <Title order={2}>困った時は</Title>
        <br />
        <Title order={4}>使い方がわからない</Title>
        <Text>使い方がわからない場合は、各委員会のロイロノートに配信されている、レジシステムの使い方を確認して下さい。</Text>
        <br />
        <Title order={4}>システムに不具合が生じていて使用できない</Title>
        <Text>
          システムに障害が生じている場合は、デジタル委員会 立石にご連絡ください。
          <br />デジタル委員の場合: 「デジタル委員(全員)内 R.5年度(2023)」にて、「0722 立石琢磨」を指定し、カードを送信。
          <br />学園祭委員の場合: 「学園祭委員会内 学園祭委員会」にて、「0722 立石琢磨」を指定し、カードを送信。
          <br />それ以外: hfhs.2268024@higashifukuoka.net までご連絡ください。/先生の場合は、内線にて「ICT準備室」までご連絡ください。(見回り中の場合などは出れない場合があります。)
          <br />その際、クラス名、名前、店舗情報、詳細を一緒に添えて送信して下さい。
        </Text>
        <br />
      </AppShell>
    </>
  )
}
