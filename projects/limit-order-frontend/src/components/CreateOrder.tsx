import { ReactElement, useEffect, useState } from "react";
import { Settings, ArrowDownCircle, ChevronDown } from "lucide-react";
import { Cuboid as Cube, Diamond } from "lucide-react";
import { AssetDetails } from "../interfaces";
import { AssetSelect } from "./AssetSelect";
import { toast } from "react-toastify";
import { LimitOrderClient } from "../contracts/LimitOrder";
import * as algokit from "@algorandfoundation/algokit-utils";
import { appAddress, appId, boxMbr } from "../utils/constants";
import { isOptedInToAsset } from "../utils";
import { useWallet } from "@txnlab/use-wallet-react";
import algosdk from "algosdk";

export const CreateOrder = ({
  assets,
  message,
  createCallback,
}: {
  assets: AssetDetails[];
  message?: ReactElement;
  createCallback: () => void;
}) => {
  const [sendAsset, setSendAsset] = useState<AssetDetails | null>(null);
  const [receiveAsset, setReceiveAsset] = useState<AssetDetails | null>(null);
  const [inputAmount, setInputAmount] = useState(0);
  const [outputAmount, setOutputAmount] = useState(0);
  const [createOrderLoading, setCreateOrderLoading] = useState("");
  const { activeAccount, transactionSigner } = useWallet();

  useEffect(() => {
    if (sendAsset) {
      setInputAmount(0);
    }
  }, [sendAsset]);

  useEffect(() => {
    if (receiveAsset) {
      setOutputAmount(0);
    }
  }, [receiveAsset]);

  const createOrder = async () => {
    if (!activeAccount) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!sendAsset || !receiveAsset) {
      toast.error("Please select assets");
      return;
    }

    if (sendAsset.assetId === receiveAsset.assetId) {
      toast.error("You cannot trade the same asset");
      return;
    }

    if (inputAmount <= 0 || outputAmount <= 0 || isNaN(inputAmount) || isNaN(outputAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (inputAmount > sendAsset.amount) {
      toast.error("Insufficient balance");
      return;
    }

    setCreateOrderLoading("Creating order...");
    try {
      const appClient = new LimitOrderClient({ appId: BigInt(appId), algorand: algokit.AlgorandClient.testNet() });
      const composer = appClient.newGroup();
      const isOptedToReceiver = receiveAsset.assetId == 0 ? true : await isOptedInToAsset(activeAccount.address, receiveAsset.assetId);
      const isContractOptedToSendAsset = sendAsset.assetId == 0 ? true : await isOptedInToAsset(appAddress, sendAsset.assetId);
      console.log(sendAsset, receiveAsset, inputAmount, outputAmount, isOptedToReceiver, isContractOptedToSendAsset);
      if (!isOptedToReceiver) {
        composer.addTransaction(
          algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: activeAccount.address,
            to: activeAccount.address,
            assetIndex: receiveAsset.assetId,
            amount: 0,
            suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
          }),
          transactionSigner
        );
      }
      if (!isContractOptedToSendAsset) {
        composer.optInToAsset({
          args: {
            assetId: sendAsset.assetId,
            mbrTxn: {
              txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: activeAccount.address,
                to: appAddress,
                amount: algokit.algos(0.1).microAlgos,
                suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
              }),
              signer: transactionSigner,
            },
          },
          extraFee: algokit.algos(0.001),
          accountReferences: [appAddress],
          assetReferences: [BigInt(sendAsset.assetId)],
          sender: activeAccount.address,
          signer: transactionSigner,
        });
      }
      let assetSendTxn: algosdk.Transaction;
      if (sendAsset.assetId === 0) {
        assetSendTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: activeAccount.address,
          to: appAddress,
          amount: algokit.algos(inputAmount).microAlgos,
          suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
        });
      } else {
        assetSendTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: activeAccount.address,
          to: appAddress,
          assetIndex: sendAsset.assetId,
          amount: inputAmount * 10 ** sendAsset.decimals,
          suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
        });
      }
      const globalState = await appClient.state.global.orderIndex();
      if (globalState === undefined) {
        throw new Error("Failed to get global state");
      }
      composer.createOrder({
        args: {
          assetSendTxn: { txn: assetSendTxn, signer: transactionSigner },
          mbrTxn: {
            txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from: activeAccount.address,
              to: appAddress,
              amount: algokit.algos(boxMbr).microAlgos,
              suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
            }),
            signer: transactionSigner,
          },
          takingAmount: outputAmount * 10 ** receiveAsset.decimals,
          takingAsset: receiveAsset.assetId,
        },
        assetReferences: [BigInt(sendAsset.assetId), BigInt(receiveAsset.assetId)],
        accountReferences: [appAddress, activeAccount.address],
        boxReferences: [{ appId: BigInt(appId), name: algosdk.bigIntToBytes(globalState, 8) }],
        sender: activeAccount.address,
        signer: transactionSigner,
      });
      setCreateOrderLoading("Waiting for confirmation...");
      const res = await composer.send();
      console.log(res);
      toast.success("Order created successfully");
      createCallback();
    } catch (e: any) {
      console.error(e);
      toast.error(`Error creating order: ${e.message}`);
    } finally {
      setCreateOrderLoading("");
    }

    // Create order
    console.log("Creating order...");
  };
  return (
    <>
      <div className="w-full lg:w-[400px] lg:flex-shrink-0">
        <div className="bg-[#2c2d33] rounded-2xl p-4 relative">
          {/* Blur overlay */}
          {message && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex justify-center items-center">
              <span className="text-white text-lg font-medium"></span>
              {message}
            </div>
          )}
          {message}

          {/* Input Section */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">You pay</span>
              <span className="text-gray-400">
                Balance: {sendAsset ? sendAsset.amount : 0}{" "}
                <span
                  onClick={(e) => {
                    sendAsset ? setInputAmount(Number((inputAmount / 2).toFixed(sendAsset.decimals))) : setInputAmount(inputAmount / 2);
                  }}
                  className="text-blue-500 mx-1 cursor-pointer"
                >
                  HALF
                </span>{" "}
                <span
                  onClick={(e) => {
                    sendAsset ? setInputAmount(sendAsset.amount) : 0;
                  }}
                  className="text-blue-500 cursor-pointer"
                >
                  MAX
                </span>
              </span>
            </div>
            <div className="bg-[#1a1b1f] rounded-xl p-3 flex items-center justify-between">
              <AssetSelect assets={assets} value={sendAsset} onChange={setSendAsset} allowCustomAsset={false} />
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => {
                  let value = e.target.value;
                  if (sendAsset) {
                    // Set max limit
                    const max = sendAsset.amount; // Adjust this value as needed
                    if (Number(value) > max) value = String(max);

                    // Limit decimal places dynamically
                    const decimalLimit = sendAsset.decimals; // Adjust this value as needed
                    if (value.includes(".")) {
                      const [integer, decimal] = value.split(".");
                      if (decimal.length > decimalLimit) {
                        value = `${integer}.${decimal.slice(0, decimalLimit)}`;
                      }
                    }
                  }

                  setInputAmount(Number(value));
                }}
                min={0}
                className="bg-transparent text-right text-white text-xl w-1/2 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center my-4">
            <ArrowDownCircle className="w-6 h-6 text-gray-400" />
          </div>

          {/* Output Section */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">You receive</span>
              <span className="text-gray-400">Balance: {receiveAsset ? receiveAsset.amount : 0}</span>
            </div>
            <div className="bg-[#1a1b1f] rounded-xl p-3 flex items-center justify-between">
              <AssetSelect assets={assets} value={receiveAsset} onChange={setReceiveAsset} allowCustomAsset={true} />
              <input
                type="number"
                value={outputAmount}
                onChange={(e) => {
                  let value = e.target.value;
                  if (receiveAsset) {
                    // Limit decimal places dynamically
                    const decimalLimit = receiveAsset.decimals; // Adjust this value as needed
                    if (value.includes(".")) {
                      const [integer, decimal] = value.split(".");
                      if (decimal.length > decimalLimit) {
                        value = `${integer}.${decimal.slice(0, decimalLimit)}`;
                      }
                    }
                  }

                  setOutputAmount(Number(value));
                }}
                min={0}
                className="bg-transparent text-right text-white text-xl w-1/2 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <button
            disabled={createOrderLoading !== ""}
            onClick={createOrder}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors cursor-pointer"
          >
            {createOrderLoading !== "" ? createOrderLoading : "Create Limit Order"}
          </button>
        </div>
      </div>
    </>
  );
};
