// components/SessionProviderWrapper.js

"use client";  // Mark this as a client component

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
