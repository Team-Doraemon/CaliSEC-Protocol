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
  ResponseData,
} from "@calimero-is-near/calimero-p2p-sdk";

import { clearApplicationId } from "@/utils/storage";
import { getContextId, getStorageApplicationId } from '@/utils/node';
import {
  getWsSubscriptionsClient,
  LogicApiDataSource,
} from '../api/dataSource/LogicApiDataSource';
import {
  ApproveProposalRequest,
  ApproveProposalResponse,
  CreateProposalRequest,
  CreateProposalResponse,
  GetProposalMessagesRequest,
  GetProposalMessagesResponse,
  SendProposalMessageRequest,
  SendProposalMessageResponse,
  ProposalActionType,
  ExternalFunctionCallAction,
  TransferAction,
} from '../api/clientApi';
import { ContextApiDataSource } from '../api/dataSource/ContractApiDataSource';
import {
  ApprovalsCount,
  ContextVariables,
  ContractProposal,
} from '../api/contractApi';


export default function Home() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [showAbout, setShowAbout] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressSteps, setProgressSteps] = useState<string[]>([]);

  const router = useRouter();
  // Authentication check
  const url = getAppEndpointKey();
  const applicationId = getStorageApplicationId();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
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

 

  const handleDeposit = async (steps: string[]) => {
    setProgressSteps(steps);
    setShowProgress(true);

    const request : CreateProposalRequest = {
      action_type: ProposalActionType.ExternalFunctionCall,
      params: {
        receiver_id: '',
        method_name: 'deposit_message',
        args: JSON.stringify({
          message : 'Hello World'
        }),
        deposit: '0',
      },
    }

    const result :ResponseData<CreateProposalResponse> = await new LogicApiDataSource().createProposal(request);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    }

    if (result?.data) {
      window.alert(`Proposal created successfully`);
    } else {
      throw new Error('Invalid response from server');
    }

    setShowProgress(false);
  };


  const handleWithdraw = async (steps: string[]) => {
    setProgressSteps(steps);
    setShowProgress(true);

    const request : CreateProposalRequest = {
      action_type: ProposalActionType.ExternalFunctionCall,
      params: {
        receiver_id: '',
        method_name: 'withdraw_message',
        args: JSON.stringify({
          note : 'Hello World'
        }),
        deposit: '0',
      },
    }

    const result :ResponseData<CreateProposalResponse> = await new LogicApiDataSource().createProposal(request);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    }

    if (result?.data) {
      window.alert(`Proposal created successfully`);
    } else {
      throw new Error('Invalid response from server');
    }

    setShowProgress(false);
  }


  const handleOperationComplete = () => {
    setTimeout(() => setShowProgress(false), 1500 * progressSteps.length);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NetworkBackground />
      <div className="relative z-10">
        <Header onAboutClick={() => setShowAbout(true)} onLogout={logout} />

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
                onDeposit={handleDeposit}
                onComplete={handleOperationComplete}
              />
            ) : (
              <Withdraw
                onWithdraw={handleWithdraw}
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
