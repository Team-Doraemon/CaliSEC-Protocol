"use client";

import { AccessTokenWrapper } from "@calimero-is-near/calimero-p2p-sdk";
import { getNodeUrl } from "@/utils/node";

export default function AccessTokenProvider({ children }: { children: React.ReactNode }) {
  return <AccessTokenWrapper getNodeUrl={getNodeUrl}>{children}</AccessTokenWrapper>;
}
