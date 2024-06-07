import type { Setting } from "@/utils/RegiAPI";
import { useAPI } from "@/utils/useAPI";
import {
  AppShell,
  Button,
  Center,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCircleX } from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Comp_Navbar } from "../../components/Navbar";

export default function History() {
  const api = useAPI();
  const [settingData, setSettingData] = useState<Setting | undefined>();
  const [goal, setGoal] = useState<number>(0);
  const [reserve, setReserve] = useState<number>(0);
  const [additionalreserve, setAdditionalreserve] = useState<number>(0);

  const fetchSetting = () => {
    if (api) {
      api.getSetting(true).then((res) => {
        setSettingData(res);
      });
    }
  };

  useEffect(() => {
    fetchSetting();
  }, [api]);

  async function saveSetting() {
    if (!api) return;
    const requestParameters = {
      goal,
      reserve,
      additionalreserve,
    };
    try {
      api.setSetting(requestParameters).then((_response) => {
        notifications.show({
          id: "donerecord",
          withCloseButton: true,
          autoClose: 5000,
          title: "設定を保存しました。",
          message: "設定を正常に保存できました。",
          color: "green",
          icon: <IconCheck />,
          className: "my-notification-class",
          loading: false,
        });
        fetchSetting();
      });
    } catch (e) {
      notifications.show({
        id: "badrequest",
        withCloseButton: true,
        autoClose: 5000,
        title: "正常に保存できませんでした。",
        message: "設定が正常に保存されていません。もう一度お試しください。",
        color: "red",
        icon: <IconCircleX />,
        className: "my-notification-class",
        loading: false,
      });
    }
  }

  return (
    <>
      <Head>
        <title>店舗設定 | HFHS REGI SYS</title>
      </Head>
      <AppShell navbar={<Comp_Navbar page="店舗設定" />}>
        <Title order={2} pb="md">
          店舗設定
        </Title>
        <Stack spacing="xs">
          <NumberInput
            label="目標売り上げ"
            description={
              <>
                <Text component="p">
                  ここでの目標売上は、1日での売上額を指定してください。売上確認ページに反映されます。
                </Text>
                <Text component="p">
                  (現在の設定額:{" "}
                  {settingData?.goal
                    ? `${settingData.goal.toLocaleString()}円`
                    : "設定なし"}
                  )
                </Text>
              </>
            }
            placeholder={settingData?.goal?.toString() ?? "設定なし"}
            onChange={value => value !== "" && setGoal(value)}
          />
          <NumberInput
            label="準備金"
            description={
              <>
                <Text>
                  <Text component="p">
                    生徒と先生の準備金の合計を入力してください。
                  </Text>
                  <Text component="p">
                    (現在の設定額:{" "}
                    {settingData?.reserve
                      ? `${settingData.reserve.toLocaleString()}円`
                      : "設定なし"}
                    )
                  </Text>
                </Text>
              </>
            }
            placeholder={settingData?.reserve?.toString() ?? "設定なし"}
            onChange={value => value !== "" && setReserve(value)}
          />
          <NumberInput
            label="追加準備金"
            description={
              <>
                <Text>
                  <Text component="p">
                    追加で必要になった準備金を入力してください。
                  </Text>
                  <Text component="p">
                    (現在の設定額:{" "}
                    {settingData?.additionalreserve
                      ? `${settingData.additionalreserve.toLocaleString()}円`
                      : "設定なし"}
                    )
                  </Text>
                </Text>
              </>
            }
            placeholder={
              settingData?.additionalreserve?.toString() ?? "設定なし"
            }
            onChange={value => value !== "" && setAdditionalreserve(value)}
          />
          <Center>
            <Button
              size={"md"}
              onClick={() => {
                saveSetting();
              }}
            >
              保存
            </Button>
          </Center>
        </Stack>
      </AppShell>
    </>
  );
}
