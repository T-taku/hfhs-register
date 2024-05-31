import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { openDB } from "idb";
import { RegisterDBSchema } from "@/utils/initAPI";
import { useRouter } from "next/router";

export default function SignOut() {
  const router = useRouter()

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
    }).then(() => {
      router.replace("/auth/signin");
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
        <Title order={2}>ログアウト中...</Title>
      </Container>
    </>
  )
}