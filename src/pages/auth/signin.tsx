import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { Container, Title, Text, Button, rem } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  }
}