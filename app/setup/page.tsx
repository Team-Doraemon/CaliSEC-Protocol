"use client";

import { useRouter } from "next/navigation";
import { SetupModal } from "@calimero-is-near/calimero-p2p-sdk";
import ContentWrapper from "@/components/login/ContentWrapper";
import { getNodeUrl, getStorageApplicationId } from "@/utils/node";
import {
  setStorageAppEndpointKey,
  setStorageApplicationId,
} from "@/utils/storage";

export default function SetupPage() {
  const router = useRouter(); // ✅ Replacing useNavigate

  return (
    <ContentWrapper>
      <SetupModal
        successRoute={() => router.push("/auth")}
        getNodeUrl={getNodeUrl}
        setNodeUrl={setStorageAppEndpointKey}
        setApplicationId={setStorageApplicationId}
        getApplicationId={getStorageApplicationId}
      />
    </ContentWrapper>
  );
}
