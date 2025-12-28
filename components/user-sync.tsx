"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function UserSync() {
  const { isSignedIn, user } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (isSignedIn && user && !syncedRef.current) {
      syncedRef.current = true; // Зөвхөн нэг удаа дуудах
      fetch("/api/users/sync", { method: "POST" })
        .then((res) => {
          if (res.ok) console.log("User synced to DB");
          else console.error("Sync failed");
        })
        .catch((err) => console.error("Sync error:", err));
    }
  }, [isSignedIn, user]);

  return null; // Дэлгэц дээр юу ч харагдахгүй
}
