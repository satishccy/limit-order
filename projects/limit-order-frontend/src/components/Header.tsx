import { Cuboid as Cube } from "lucide-react";
import { useWallet } from "@txnlab/use-wallet-react";
import { formatAddress } from "../utils";
import { useState } from "react";
import { WalletModal } from "./WalletModal";

export const Header = () => {
  const { activeAccount } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Cube className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold text-blue-500">Limit Order</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor px-4 py-2 rounded-lg bg-[#2c2d33] hover:bg-[#3a3b41] transition-colors text-white flex items-center gap-2"
        >
          <span> {activeAccount ? `DISCONNECT (${formatAddress(activeAccount.address)})` : "CONNECT WALLET"}</span>
        </button>
      </div>
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
