import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { Container, Title, Text, Button, rem } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useEffect } from "react";
import { openDB } from "idb";
import { RegisterDBSchema } from "@/utils/initAPI";

export default function SignIn() {
  const providers = {"google":{"id":"google","name":"Google","type":"oauth","signinUrl":"http://localhost:3000/api/auth/signin/google","callbackUrl":"http://localhost:3000/api/auth/callback/google"}}
  useEffect(() => {
    const req = openDB<RegisterDBSchema>("register-db", 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        db.createObjectStore("user");
        db.createObjectStore("history");
        db.createObjectStore("history-queue", { autoIncrement: true });
      },
      blocked(currentVersion, blockedVersion, event) {
        throw event
      },
      blocking(currentVersion, blockedVersion, event) {
        throw event
      }
    });
    req.then(async (db) => {
      const transaction = db.transaction(["user", "history", "history-queue"], "readwrite");
      await transaction.objectStore("user").clear();
      await transaction.objectStore("history").clear();
      await transaction.objectStore("history-queue").clear();
    })
  })
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
        <Title order={2}>ログイン</Title>
        <Text>学校のGoogleアカウントを使って、ログインしてください。</Text>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button
              leftIcon={
                <IconBrandGoogle size="1.2rem" stroke={1.5} />
              }
              radius="xl"
              size="md"
              styles={{
                root: { paddingRight: rem(14), height: rem(48) },
              }}
              onClick={() => signIn(provider.id)}
            >
              Googleでログイン
            </Button>
          </div>
        ))}
      </Container>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }
  return {};
}