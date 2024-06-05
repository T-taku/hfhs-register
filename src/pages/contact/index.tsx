import { AppShell, List, Stack, Text, Title } from '@mantine/core';
import Head from 'next/head';
import { Comp_Navbar } from '../../components/Navbar';

export default function Contact() {
  return (
    <>
      <Head>
        <title>困った時は | HFHS REGI SYS</title>
      </Head>
      <AppShell
        navbar={<Comp_Navbar page="困った時は" />}
      >
        <Title order={1} pb="lg">困った時は</Title>
        <Stack>
          <Stack>
            <Title order={3}>使い方がわからない</Title>
            <Text component='p'>使い方がわからない場合は、各委員会のロイロノートに配信されている、レジシステムの使い方を確認して下さい。</Text>
          </Stack>
          <Stack>
            <Title order={3}>システムに不具合が生じていて使用できない</Title>
            <Text>
              <Text component='p'>システムに障害が生じている場合は、デジタル委員会 立石にご連絡ください。</Text>
              <List p="sm" spacing="0.2em">
                <List.Item>
                  <Text>
                    デジタル委員の場合:<Text>「(2024年度)デジタル委員会」にて、「030721 立石琢磨」を指定し、カードを送信。</Text>
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    学園祭委員の場合:<Text>「68期「学園祭委員」 学園祭委員全員」にて、「030721 立石琢磨」を指定し、カードを送信。</Text>
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    それ以外:<Text>hfhs.2268024@higashifukuoka.net までご連絡ください。</Text>
                  </Text>
                </List.Item>
              </List>
              <Text component='p'>先生の場合は、内線にて「ICT準備室」までご連絡ください。(見回り中の場合などは出れない場合があります。)</Text>
              <Text component='p'>その際、クラス名、名前、店舗情報、詳細を一緒に添えて送信して下さい。</Text>
            </Text>
          </Stack>
        </Stack>
        <br />
      </AppShell>
    </>
  )
}
