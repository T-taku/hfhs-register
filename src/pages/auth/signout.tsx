import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAPI } from "@/utils/useAPI";

export default function SignOut() {
  const router = useRouter()
  const api = useAPI(false);
  useEffect(() => {
    api?.clearAllCache().then(() => {
      router.replace("/auth/signin")
    });
  }, [api]);
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title order={2}>ログアウト中...</Title>
      </Container>
    </>
  )
}