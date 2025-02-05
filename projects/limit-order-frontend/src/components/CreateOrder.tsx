import { ReactElement, useEffect, useState } from "react";
import { Settings, ArrowDownCircle, ChevronDown } from "lucide-react";
import { Cuboid as Cube, Diamond } from "lucide-react";
import { AssetDetails } from "../interfaces";
import { AssetSelect } from "./AssetSelect";
import { toast } from "react-toastify";

export const CreateOrder = ({ assets, message }: { assets: AssetDetails[]; message?: ReactElement }) => {
  const [sendAsset, setSendAsset] = useState<AssetDetails | null>(null);
  const [receiveAsset, setReceiveAsset] = useState<AssetDetails | null>(null);
  const [inputAmount, setInputAmount] = useState(0);
  const [outputAmount, setOutputAmount] = useState(0);
  const [createOrderLoading, setCreateOrderLoading] = useState("");

  useEffect(() => {
    if (sendAsset) {
      setInputAmount(0);
    }
  }, [sendAsset]);

  useEffect(() => {
    if (sendAsset) {
      setInputAmount(0);
    }
  }, [sendAsset]);

  const createOrder = async () => {
    if (!sendAsset || !receiveAsset) {
      toast.error("Please select assets");
      return;
    }

    if (inputAmount <= 0 || outputAmount <= 0 || isNaN(inputAmount) || isNaN(outputAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Create order
    console.log("Creating order...");
  };
  return (
    <>
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
    </>
  );
};
