import { Modal } from "./Modal";
import { ArrowUpRight } from "lucide-react";
import { useWallet, Wallet } from "@txnlab/use-wallet-react";
import { formatAddress } from "../utils";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  if (!isOpen) return null;
  const { activeAccount, wallets } = useWallet();

  const handleWalletClick = async (wallet: Wallet) => {
    if (wallet.isConnected) {
      wallet.setActive();
    } else {
      try {
        const account = await wallet.connect();
        console.log(account);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const disconnectWallets = async () => {
    wallets.forEach((wallet) => {
      if (wallet.isConnected) {
        wallet.disconnect();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect to a wallet">
      <div className="space-y-2">
        {wallets.map((wallet) => (
          <>
            {/* <div
              onClick={(e) => {
                handleWalletClick(wallet);
              }}
              key={wallet.id}
              className={`wallet-option ${wallet.activeAccount ? "connected" : null}`}
            >
              <span>
                {wallet.metadata.name}{" "}
                {wallet.activeAccount && `[${`${wallet.activeAccount.address.slice(0, 3)}...${wallet.activeAccount.address.slice(-3)}]`}`}{" "}
                {wallet.isActive && `(active)`}
              </span>
              <img src={wallet.metadata.icon} alt={`${wallet.metadata.name} Icon`} className="wallet-icon" />
            </div> */}

            <button
              key={wallet.metadata.name}
              className={`w-full p-4 flex items-center justify-between rounded-xl transition-colors ${
                wallet.isActive ? "bg-blue-500/10 text-blue-500" : "bg-[#1a1b1f] text-white hover:bg-[#2c2d33]"
              }`}
              onClick={(e) => {
                handleWalletClick(wallet);
              }}
            >
              <div className="flex items-center gap-3">
                <img src={wallet.metadata.icon} alt={`${wallet.metadata.name} Icon`} className="w-8" />

                <span className="font-medium">
                  {wallet.metadata.name} {wallet.activeAccount && `[${formatAddress(wallet.activeAccount.address)}]`}{" "}
                </span>
              </div>
            </button>
          </>
        ))}

        {/* Disconnect Button */}
        {activeAccount && (
          <button
            onClick={(e) => {
              disconnectWallets();
            }}
            className="w-full p-4 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-colors mt-4"
          >
            Disconnect {activeAccount && `[${formatAddress(activeAccount.address)}]`}
          </button>
        )}

        {/* Learn More Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            New to Algorand?{" "}
            <a
              target="_blank"
              href="https://algorand.co/wallets"
              className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-1"
            >
              Learn more about wallets
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
}
