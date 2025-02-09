"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Deposit from "@/components/deposit";
import Withdraw from "@/components/withdraw";
import AboutModal from "@/components/about-modal";
import ProgressAnimation from "@/components/progress-animation";
import NetworkBackground from "@/components/network-background";
import Footer from "@/components/footer/Footer";
import { createActor } from "@/declarations/CaliSec_backend";

import { useRouter } from "next/navigation";
import {
  clearAppEndpoint,
  clearJWT,
  getAccessToken,
  getAppEndpointKey,
  getRefreshToken,
  ResponseData,
} from "@calimero-is-near/calimero-p2p-sdk";

import { clearApplicationId, getJWTObject } from "@/utils/storage";
import { getContextId, getStorageApplicationId } from "@/utils/node";
import { LogicApiDataSource } from "../api/dataSource/LogicApiDataSource";
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
} from "../api/clientApi";
import { ContextApiDataSource } from "../api/dataSource/ContractApiDataSource";
import { ContextVariables, ContractProposal } from "../api/contractApi";

const CaliSec_backend = createActor("by6od-j4aaa-aaaaa-qaadq-cai");

export default function Home() {
  const [activeTab, setActiveTab] = useState("deposit");
  const [showAbout, setShowAbout] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressSteps, setProgressSteps] = useState<string[]>([]);

  const router = useRouter();
  const url = getAppEndpointKey();
  const applicationId = getStorageApplicationId();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // useEffect(() => {
  //   if (!url || !applicationId || !accessToken || !refreshToken) {
  //     router.push("/auth");
  //   }
  // }, [accessToken, applicationId, refreshToken, url]);

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

  async function approveProposal(proposalId: string) {
    const request: ApproveProposalRequest = { proposal_id: proposalId };
    const result: ResponseData<ApproveProposalResponse> =
      await new LogicApiDataSource().approveProposal(request);
    if (result?.error) {
      console.error("Error:", result.error);
      window.alert(`${result.error.message}`);
      return;
    }
    window.alert(`Proposal approved successfully`);
  }

  async function sendProposalMessage(proposalId: string, text: string) {
    const request: SendProposalMessageRequest = {
      proposal_id: proposalId,
      message: {
        id: `${Date.now()}`,
        proposal_id: proposalId,
        author: getJWTObject()?.executor_public_key,
        text,
        created_at: new Date().toISOString(),
      },
    };

    await new LogicApiDataSource().sendProposalMessage(request);
  }

  // async function handleAction(methodName: string, args: object) {
  //   setShowProgress(true);
  //   const request: CreateProposalRequest = {
  //     action_type: ProposalActionType.ExternalFunctionCall,
  //     params: {
  //       receiver_id: "by6od-j4aaa-aaaaa-qaadq-cai",
  //       method_name: methodName,
  //       args: JSON.stringify(args),
  //       deposit: "0",
  //     },
  //   };

  //   console.log("Creating proposal with request:", request);
  //   const result: ResponseData<CreateProposalResponse> =
  //     await new LogicApiDataSource().createProposal(request);
  //   if (result?.error) {
  //     console.error("Error:", result.error);
  //     window.alert(`${result.error.message}`);
  //     return;
  //   }
  //   if (result?.data) {
  //     console.log("Proposal created:", result.data);
  //     window.alert(`Proposal created successfully: ${result.data}`);
  //     await approveProposal(result.data.proposal_id);
  //     await sendProposalMessage(
  //       result.data.proposal_id,
  //       "Proposal approved and executed successfully"
  //     );
  //   }
  // }

  const handleInputDeposit = async (message: string) => {
    try {
      const result = await CaliSec_backend.deposit_message(message);
      console.log("YEH LO JI: ",result);

      if ("Ok" in result) { // ✅ Type guard check
        console.log("Deposit successful:", result.Ok);
        window.alert(`Deposit successful: ${result.Ok}`);
      } else if ("Err" in result) {
        console.error("Deposit error:", result.Err);
        window.alert(`Deposit failed: ${result.Err}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      window.alert("An unexpected error occurred during deposit.");
    }
  };
  

  const handleInputWithdraw = async (note: string) => {
    try {
      const result = await CaliSec_backend.withdraw_message(note);
      console.log("YEH LO JI: ",result);
      
      if ("Ok" in result) { // ✅ Type guard check
        console.log("Withdraw successful:", result.Ok);
        window.alert(`Withdraw successful: ${result.Ok}`);
      } else if ("Err" in result) {
        console.error("Withdraw error:", result.Err);
        window.alert(`Withdraw failed: ${result.Err}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      window.alert("An unexpected error occurred during withdrawal.");
    }
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
                onDeposit={handleOperation}
                onInputDeposit={handleInputDeposit}
                onComplete={handleOperationComplete}
              />
            ) : (
              <Withdraw
                onWithdraw={handleOperation}
                onInputWithdraw={handleInputWithdraw}
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
