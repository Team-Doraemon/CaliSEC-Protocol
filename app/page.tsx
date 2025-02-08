"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Deposit from "@/components/deposit";
import Withdraw from "@/components/withdraw";
import AboutModal from "@/components/about-modal";
import ProgressAnimation from "@/components/progress-animation";
import NetworkBackground from "@/components/network-background";
import Footer from "@/components/footer/Footer";

import { useRouter } from "next/navigation";
import {
  clearAppEndpoint,
  clearJWT,
  getAccessToken,
  getAppEndpointKey,
  getRefreshToken,
} from "@calimero-is-near/calimero-p2p-sdk";
import { clearApplicationId } from "@/utils/storage";
import { getContextId, getStorageApplicationId } from '@/utils/node';

export default function Home() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [showAbout, setShowAbout] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressSteps, setProgressSteps] = useState<string[]>([]);

  const router = useRouter();
  const url = getAppEndpointKey();
  const applicationId = getStorageApplicationId();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // Authentication check
  useEffect(() => {
    if (!url || !applicationId || !accessToken || !refreshToken) {
      router.push('/auth')
    }
  }, [accessToken, applicationId, refreshToken, url]);

  // Logout handler
  const logout = () => {
    clearAppEndpoint();
    clearJWT();
    clearApplicationId();
    router.push("/auth");
  };

  const handleOperation = (steps: string[]) => {
    setProgressSteps(steps);
    setShowProgress(true);
  };

  const handleOperationComplete = () => {
    setTimeout(() => setShowProgress(false), 1500 * progressSteps.length);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NetworkBackground />
      <div className="relative z-10">
        <Header onAboutClick={() => setShowAbout(true)} />

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-[#111111]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <div className="flex mb-6 bg-[#0A0A0A] rounded-lg p-1">
              <button
                onClick={() => setActiveTab("deposit")}
                className={`flex-1 py-2 px-4 rounded-md text-center transition-colors ${
                  activeTab === "deposit"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Create Proof
              </button>
              <button
                onClick={() => setActiveTab("withdraw")}
                className={`flex-1 py-2 px-4 rounded-md text-center transition-colors ${
                  activeTab === "withdraw"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Decode Proof
              </button>
            </div>

            {activeTab === "deposit" ? (
              <Deposit
                onDeposit={handleOperation}
                onComplete={handleOperationComplete}
              />
            ) : (
              <Withdraw
                onWithdraw={handleOperation}
                onComplete={handleOperationComplete}
              />
            )}
          </div>
        </main>

        <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
        <ProgressAnimation steps={progressSteps} isActive={showProgress} />
        <Footer />
      </div>
    </div>
  );
}
