import { Header } from "./components/Header";
import { CreateOrder } from "./components/CreateOrder";
import { useWallet } from "@txnlab/use-wallet-react";
import { ReactElement, useEffect, useState } from "react";
import { getAccountAlgo, getAssetDetails, getAssetsInAddress, isOptedInToAsset } from "./utils";
import { AssetDetails, LimitOrder } from "./interfaces";
import { LimitOrderClient } from "./contracts/LimitOrder";
import { appAddress, appId } from "./utils/constants";
import * as algokit from "@algorandfoundation/algokit-utils";
import { ListFilter } from "lucide-react";
import { get } from "http";
import { toast } from "react-toastify";
import algosdk from "algosdk";
const userasas: AssetDetails[] = [
  {
    assetId: 0,
    amount: 62.490981,
    orgAmount: 62490981,
    decimals: 6,
    name: "Algorand",
    unitName: "ALGO",
  },
  {
    assetId: 628957196,
    amount: 8884,
    orgAmount: 88840000000,
    decimals: 7,
    name: "HOT",
    unitName: "HOT",
  },
  {
    assetId: 628958865,
    amount: 8870,
    orgAmount: 8870000,
    decimals: 3,
    name: "HOT",
    unitName: "HOT",
  },
  {
    assetId: 629094392,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asset",
    unitName: "unit",
  },
  {
    assetId: 629114126,
    amount: 5,
    orgAmount: 500,
    decimals: 2,
    name: "REJOLT",
    unitName: "RT",
  },
  {
    assetId: 629115179,
    amount: 2,
    orgAmount: 2,
    decimals: 0,
    name: "TestNFT",
    unitName: "TNFT",
  },
  {
    assetId: 629346208,
    amount: 0.002,
    orgAmount: 2,
    decimals: 3,
    name: "sdc",
    unitName: "sd",
  },
  {
    assetId: 629468819,
    amount: 2,
    orgAmount: 20000,
    decimals: 4,
    name: "Satish",
    unitName: "sat",
  },
  {
    assetId: 638809877,
    amount: 12,
    orgAmount: 12000,
    decimals: 3,
    name: "JNTU HYDERABAD",
    unitName: "JNTUH",
  },
  {
    assetId: 659202997,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "stupidhorse",
    unitName: "horse",
  },
  {
    assetId: 677469584,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #1",
    unitName: "asa",
  },
  {
    assetId: 677469595,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #2",
    unitName: "asa",
  },
  {
    assetId: 677469597,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #3",
    unitName: "asa",
  },
  {
    assetId: 677469599,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #4",
    unitName: "asa",
  },
  {
    assetId: 677469601,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #5",
    unitName: "asa",
  },
  {
    assetId: 677469603,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #6",
    unitName: "asa",
  },
  {
    assetId: 677469605,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #7",
    unitName: "asa",
  },
  {
    assetId: 677469607,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #8",
    unitName: "asa",
  },
  {
    assetId: 677469611,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #9",
    unitName: "asa",
  },
  {
    assetId: 677469613,
    amount: 0,
    orgAmount: 0,
    decimals: 0,
    name: "asa #10",
    unitName: "asa",
  },
  {
    assetId: 677469615,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #11",
    unitName: "asa",
  },
  {
    assetId: 677469617,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #12",
    unitName: "asa",
  },
  {
    assetId: 677469619,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #13",
    unitName: "asa",
  },
  {
    assetId: 677469621,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #14",
    unitName: "asa",
  },
  {
    assetId: 677469623,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #15",
    unitName: "asa",
  },
  {
    assetId: 677469625,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #16",
    unitName: "asa",
  },
  {
    assetId: 677469627,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #17",
    unitName: "asa",
  },
  {
    assetId: 677469629,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #18",
    unitName: "asa",
  },
  {
    assetId: 677469631,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #19",
    unitName: "asa",
  },
  {
    assetId: 677469634,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #20",
    unitName: "asa",
  },
  {
    assetId: 677469636,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #21",
    unitName: "asa",
  },
  {
    assetId: 677469638,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #22",
    unitName: "asa",
  },
  {
    assetId: 677469640,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #23",
    unitName: "asa",
  },
  {
    assetId: 677469643,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "asa #24",
    unitName: "asa",
  },
  {
    assetId: 681402235,
    amount: 998,
    orgAmount: 99800,
    decimals: 2,
    name: "satish",
    unitName: "st",
  },
  {
    assetId: 683444110,
    amount: 99,
    orgAmount: 99,
    decimals: 0,
    name: "workshop nft",
    unitName: "wnft",
  },
  {
    assetId: 720485937,
    amount: 0,
    orgAmount: 0,
    decimals: 0,
    name: "CTFLAG ",
    unitName: "CTF2",
  },
  {
    assetId: 722499831,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "Algorand Education Badge #003",
    unitName: "AEB1",
  },
  {
    assetId: 722500148,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "Algorand Education Badge #004",
    unitName: "AEB1",
  },
  {
    assetId: 722500455,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "Algorand Education Badge #005",
    unitName: "AEB1",
  },
  {
    assetId: 722500875,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "Algorand Education Badge #006",
    unitName: "AEB1",
  },
  {
    assetId: 722649319,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "Algorand Education Badge #001",
    unitName: "AEB1",
  },
  {
    assetId: 722649486,
    amount: 16,
    orgAmount: 16000000,
    decimals: 6,
    name: "POMA",
    unitName: "POMA",
  },
  {
    assetId: 722651759,
    amount: 71,
    orgAmount: 71000000,
    decimals: 6,
    name: "POMA",
    unitName: "POMA",
  },
  {
    assetId: 723284532,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "Algorand Education Badge #003",
    unitName: "AEB1",
  },
  {
    assetId: 727247524,
    amount: 4,
    orgAmount: 4,
    decimals: 0,
    name: "TEDxVJIT Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 727247725,
    amount: 4,
    orgAmount: 4,
    decimals: 0,
    name: "TEDxVJIT Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 727249402,
    amount: 4,
    orgAmount: 4,
    decimals: 0,
    name: "TEDxVJIT Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 727249606,
    amount: 4,
    orgAmount: 4,
    decimals: 0,
    name: "TEDxVJIT Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 727257464,
    amount: 2,
    orgAmount: 2,
    decimals: 0,
    name: "TEDxVJIT Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 728284808,
    amount: 30,
    orgAmount: 30,
    decimals: 0,
    name: "TEDxVJIT 2024 Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 728285350,
    amount: 30,
    orgAmount: 30,
    decimals: 0,
    name: "TEDxVJIT 2024 Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 728288946,
    amount: 30,
    orgAmount: 30,
    decimals: 0,
    name: "TEDxVJIT 2024 Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 728289172,
    amount: 30,
    orgAmount: 30,
    decimals: 0,
    name: "TEDxVJIT 2024 Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 728299666,
    amount: 30,
    orgAmount: 30,
    decimals: 0,
    name: "TEDxVJIT 2024 Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 728299727,
    amount: 30,
    orgAmount: 30,
    decimals: 0,
    name: "TEDxVJIT 2024 Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 728328078,
    amount: 18,
    orgAmount: 18,
    decimals: 0,
    name: "TEDxVJIT 2024 Volunteer Badge",
    unitName: "TEDxVJIT",
  },
  {
    assetId: 730447417,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_CU",
    unitName: "Custodia",
  },
  {
    assetId: 730447569,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_TO",
    unitName: "Tokeniz",
  },
  {
    assetId: 730447632,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_DF",
    unitName: "DeFi",
  },
  {
    assetId: 730447683,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_LS",
    unitName: "LiquidS",
  },
  {
    assetId: 730447769,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_BA",
    unitName: "Analytic",
  },
  {
    assetId: 730447860,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_ANV",
    unitName: "Anveshak",
  },
  {
    assetId: 730447929,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_ARV",
    unitName: "ARVO",
  },
  {
    assetId: 730448567,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_AST",
    unitName: "Astrix",
  },
  {
    assetId: 730448650,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_AXI",
    unitName: "Automaxi",
  },
  {
    assetId: 730448771,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_DAV",
    unitName: "David",
  },
  {
    assetId: 730448891,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_FILM",
    unitName: "FilmFina",
  },
  {
    assetId: 730449101,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_LW3",
    unitName: "LW3",
  },
  {
    assetId: 730449146,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_MINI",
    unitName: "MiniLand",
  },
  {
    assetId: 730449367,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_REN",
    unitName: "Renai",
  },
  {
    assetId: 730449436,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_TER",
    unitName: "Terano",
  },
  {
    assetId: 730449517,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_SED",
    unitName: "SecureDa",
  },
  {
    assetId: 730449581,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_EAR",
    unitName: "EarlyChk",
  },
  {
    assetId: 730449637,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_BVP",
    unitName: "BSTVideo",
  },
  {
    assetId: 730449730,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "AIS_ABC",
    unitName: "ABCStar",
  },
  {
    assetId: 730493878,
    amount: 1,
    orgAmount: 1,
    decimals: 0,
    name: "Algorand India Summit Finalists",
    unitName: "AISF2024",
  },
  {
    assetId: 730803426,
    amount: 33,
    orgAmount: 33,
    decimals: 0,
    name: "TEDxSVECW 2024 Volunteer Badge",
    unitName: "TEDSVECW",
  },
  {
    assetId: 730803616,
    amount: 33,
    orgAmount: 33,
    decimals: 0,
    name: "TEDxSVECW 2024 Volunteer Badge",
    unitName: "TEDSVECW",
  },
  {
    assetId: 730803685,
    amount: 26,
    orgAmount: 26,
    decimals: 0,
    name: "TEDxSVECW 2024 Volunteer Badge",
    unitName: "TEDSVECW",
  },
  {
    assetId: 732071363,
    amount: 999990,
    orgAmount: 999990000,
    decimals: 3,
    name: "SVECW Token",
    unitName: "SVECW",
  },
  {
    assetId: 732944107,
    amount: 9900,
    orgAmount: 9900,
    decimals: 0,
    name: "Bitcoin",
    unitName: "BTC",
  },
];

function App() {
  const { activeAccount, transactionSigner } = useWallet();
  const [userAssets, setUserAssets] = useState<AssetDetails[]>([]);
  const [createOrderMessage, setCreateOrderMessage] = useState<ReactElement>();
  const [limitOrders, setLimitOrders] = useState<LimitOrder[]>([]);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [loadingOrdersMessage, setLoadingOrdersMessage] = useState("");

  async function getUserAssets(address: string) {
    setCreateOrderMessage(
      <>
        <div className="text-white text-lg font-medium">Fetching Your Assets...</div>
      </>
    );
    let assets = await getAssetsInAddress(address);
    let finalAssets: AssetDetails[] = [];
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const assetDetails = await getAssetDetails(asset);
      finalAssets.push(assetDetails);
      setCreateOrderMessage(
        <>
          <div className="flex flex-col items-center">
            <div className="text-white text-lg font-medium">Fetching Your Assets...</div>
            <div className="text-white text-lg font-medium justify-center">
              {i + 1}/{assets.length} fetched{" "}
            </div>
          </div>
        </>
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    const algo = await getAccountAlgo(address);
    finalAssets = [algo, ...finalAssets];
    setUserAssets(finalAssets);
    console.log(finalAssets);
    setCreateOrderMessage(undefined);
    return finalAssets;
  }

  async function getOrders(assets: AssetDetails[]) {
    setLoadingOrdersMessage("Fetching Orders...");
    try {
      const appClient = new LimitOrderClient({ appId: BigInt(appId), algorand: algokit.AlgorandClient.testNet() });
      const orders = await appClient.state.box.orders.getMap();
      const finalOrders: LimitOrder[] = [];
      for (const [key, value] of orders.entries()) {
        const givingAssetBalance = assets.find((asset) => asset.assetId === Number(value.givingAsset));
        const givingAsset =
          Number(value.givingAsset) !== 0
            ? givingAssetBalance
              ? givingAssetBalance
              : await getAssetDetails({
                  assetId: Number(value.givingAsset),
                  orgAmount: 0,
                })
            : givingAssetBalance
            ? givingAssetBalance
            : { assetId: 0, amount: 0, orgAmount: 0, decimals: 6, name: "Algorand", unitName: "ALGO" };
        const takingAssetBalance = assets.find((asset) => asset.assetId === Number(value.takingAsset));
        const takingAsset =
          Number(value.takingAsset) !== 0
            ? takingAssetBalance
              ? takingAssetBalance
              : await getAssetDetails({
                  assetId: Number(value.takingAsset),
                  orgAmount: 0,
                })
            : takingAssetBalance
            ? takingAssetBalance
            : { assetId: 0, amount: 0, orgAmount: 0, decimals: 6, name: "Algorand", unitName: "ALGO" };
        const order: LimitOrder = {
          id: key,
          owner: value.owner,
          givingAsset,
          takingAsset,
          givingAmount: value.givingAmount,
          takingAmount: value.takingAmount,
          completed: value.completed,
          ownerClaimed: value.ownerClaimed,
          canAbleToBuy: value.takingAmount <= takingAsset.orgAmount,
          isOwner: activeAccount ? value.owner === activeAccount.address : false,
        };
        finalOrders.push(order);
      }
      setLimitOrders(finalOrders);
      setLoadingOrdersMessage("");
      if (finalOrders.length === 0) {
        setLoadingOrdersMessage("No Orders Found");
      }
      console.log(finalOrders);
    } catch (e: any) {
      console.log(e);
      toast.error(`Error Fetching Orders: ${e.message}`);
      setLoadingOrdersMessage("Error Fetching Orders");
    }
  }

  useEffect(() => {
    (async () => {
      let finalAssets: AssetDetails[] = [];
      if (activeAccount) {
        finalAssets = await getUserAssets(activeAccount.address);
      } else {
        setCreateOrderMessage(
          <>
            <div className="text-red-500 text-lg font-medium">Please connect your wallet to create an order</div>
          </>
        );
      }
      await getOrders(finalAssets);
    })();
  }, [activeAccount]);

  const filteredOrders = showMyOrders ? limitOrders.filter((order) => order.isOwner) : limitOrders;

  const handleClaimOrder = async (e: React.MouseEvent<HTMLButtonElement>, order: LimitOrder) => {
    console.log("Claiming order:", order);
    if (!activeAccount) {
      toast.error("Please connect your wallet to cancel the order");
      return;
    }
    const button = e.currentTarget;
    button.disabled = true;
    button.textContent = "Claming...";
    try {
      const appClient = new LimitOrderClient({ appId: BigInt(appId), algorand: algokit.AlgorandClient.testNet() });
      let extraFees = 0.001;
      const isOwnerOptedIn =
        order.takingAsset.assetId === 0 ? true : await isOptedInToAsset(order.owner, Number(order.takingAsset.assetId));
      if (isOwnerOptedIn) {
        extraFees += 0.001;
      }
      const composer = appClient.newGroup();
      let assetSendTxn: algosdk.Transaction;
      if (order.takingAsset.assetId === 0) {
        assetSendTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: activeAccount.address,
          to: appAddress,
          amount: Number(order.takingAmount),
          suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
        });
      } else {
        assetSendTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: activeAccount.address,
          to: appAddress,
          amount: Number(order.takingAmount),
          assetIndex: Number(order.takingAsset.assetId),
          suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
        });
      }
      const isContractOptedToSendAsset =
        order.takingAsset.assetId == 0 ? true : await isOptedInToAsset(appAddress, order.takingAsset.assetId);
      if (!isContractOptedToSendAsset) {
        composer.optInToAsset({
          args: {
            assetId: order.takingAsset.assetId,
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
          assetReferences: [BigInt(order.takingAsset.assetId)],
          sender: activeAccount.address,
          signer: transactionSigner,
        });
      }
      const isReceiverOptedToGiveAsset =
        order.givingAsset.assetId == 0 ? true : await isOptedInToAsset(activeAccount.address, order.givingAsset.assetId);
      if (!isReceiverOptedToGiveAsset) {
        composer.addTransaction(
          algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: activeAccount.address,
            to: activeAccount.address,
            assetIndex: order.givingAsset.assetId,
            amount: 0,
            suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
          }),
          transactionSigner
        );
      }
      composer.claimOrder({
        args: { orderId: Number(order.id), assetSendTxn: { txn: assetSendTxn, signer: transactionSigner } },
        boxReferences: [{ appId: 0n, name: algosdk.bigIntToBytes(Number(order.id), 8) }],
        assetReferences: [BigInt(order.takingAsset.assetId), BigInt(order.givingAsset.assetId)],
        accountReferences: [appAddress, order.owner],
        sender: activeAccount.address,
        signer: transactionSigner,
        extraFee: algokit.algos(extraFees),
      });
      const res = await composer.send();
      console.log(res);
      toast.success("Order Claimed Successfully");
      let finalAssets = await getUserAssets(activeAccount.address);
      await getOrders(finalAssets);
    } catch (err: any) {
      console.error(err);
      toast.error(`Error Claiming Order: ${err.message}`);
    } finally {
      button.disabled = false;
      button.textContent = "Claim Order";
    }
  };

  const handleClaimFunds = async (e: React.MouseEvent<HTMLButtonElement>, order: LimitOrder) => {
    console.log("Claiming funds for order:", order);
    if (!activeAccount) {
      toast.error("Please connect your wallet to cancel the order");
      return;
    }
    const button = e.currentTarget;
    button.disabled = true;
    button.textContent = "Claming...";
    try {
      const appClient = new LimitOrderClient({ appId: BigInt(appId), algorand: algokit.AlgorandClient.testNet() });
      const isTakingAssetOptedIn =
        order.takingAsset.assetId === 0 ? true : await isOptedInToAsset(order.owner, Number(order.takingAsset.assetId));
      const composer = appClient.newGroup();
      if (!isTakingAssetOptedIn) {
        composer.addTransaction(
          algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: activeAccount.address,
            to: activeAccount.address,
            assetIndex: order.takingAsset.assetId,
            amount: 0,
            suggestedParams: await appClient.algorand.client.algod.getTransactionParams().do(),
          }),
          transactionSigner
        );
      }
      composer.claimOwnerAsset({
        args: { orderId: Number(order.id) },
        boxReferences: [{ appId: 0n, name: algosdk.bigIntToBytes(Number(order.id), 8) }],
        assetReferences: [BigInt(order.takingAsset.assetId), BigInt(order.givingAsset.assetId)],
        accountReferences: [appAddress, order.owner],
        sender: activeAccount.address,
        signer: transactionSigner,
        extraFee: algokit.algos(0.001),
      });
      const res = await composer.send();
      console.log(res);
      toast.success("Funds Claimed Successfully");
      let finalAssets = await getUserAssets(activeAccount.address);
      await getOrders(finalAssets);
    } catch (err: any) {
      console.error(err);
      toast.error(`Error Claiming Funds: ${err.message}`);
    } finally {
      button.disabled = false;
      button.textContent = "Claim Funds";
    }
  };

  const handleCancelOrder = async (e: React.MouseEvent<HTMLButtonElement>, orderId: LimitOrder) => {
    console.log("Cancelling order:", orderId);
    if (!activeAccount) {
      toast.error("Please connect your wallet to cancel the order");
      return;
    }
    const button = e.currentTarget;
    button.disabled = true;
    button.textContent = "Cancelling...";
    try {
      const appClient = new LimitOrderClient({ appId: BigInt(appId), algorand: algokit.AlgorandClient.testNet() });
      const res = await appClient.send.cancelOrder({
        args: { orderId: Number(orderId.id) },
        boxReferences: [{ appId: 0n, name: algosdk.bigIntToBytes(Number(orderId.id), 8) }],
        assetReferences: [BigInt(orderId.takingAsset.assetId), BigInt(orderId.givingAsset.assetId)],
        sender: activeAccount.address,
        signer: transactionSigner,
        extraFee: algokit.algos(0.002),
      });
      console.log(res);
      toast.success("Order Cancelled Successfully");
      let finalAssets = await getUserAssets(activeAccount.address);
      await getOrders(finalAssets);
    } catch (err: any) {
      console.log(err);
      toast.error(`Error Cancelling Order: ${err.message}`);
    } finally {
      button.disabled = false;
      button.textContent = "Cancel Order";
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b1f] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Create Order Card */}
        <div className="flex flex-col lg:flex-row gap-4">
          <CreateOrder
            createCallback={async () => {
              const finalAssets = activeAccount ? await getUserAssets(activeAccount.address) : [];
              await getOrders(finalAssets);
            }}
            assets={userAssets}
            message={createOrderMessage}
          />

          {/* Orders Section */}
          <div className="flex-1">
            <div className="bg-[#2c2d33] rounded-2xl p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Order Book</h2>
                <button
                  onClick={() => setShowMyOrders(!showMyOrders)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1b1f] hover:bg-[#3a3b41] transition-colors text-gray-400"
                >
                  <ListFilter className="w-4 h-4" />
                  <span>{showMyOrders ? "My Orders" : "All Orders"}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-[#1a1b1f]">
                      <th className="text-left py-2">Given</th>
                      <th className="text-left py-2">To Give</th>
                      <th className="text-right py-2">Status</th>
                      <th className="text-right py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={Number(order.id)} className="border-b border-[#1a1b1f] last:border-0">
                        <td className="py-3">
                          <div className="text-white">
                            {Number(order.givingAmount) / 10 ** order.givingAsset.decimals} {order.givingAsset.unitName}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {order.givingAsset.name} - {order.givingAsset.assetId}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-white">
                            {Number(order.takingAmount) / 10 ** order.takingAsset.decimals} {order.takingAsset.unitName}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {order.takingAsset.name} - {order.takingAsset.assetId}
                          </div>
                        </td>
                        <td className="text-right py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs ${
                              order.completed ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {order.completed ? "Completed" : "Active"}
                          </span>
                        </td>
                        <td className="text-right py-3">
                          {order.isOwner && !order.ownerClaimed && order.completed && (
                            <button
                              onClick={(e) => handleClaimFunds(e, order)}
                              className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm transition-colors"
                            >
                              Claim Funds
                            </button>
                          )}
                          {!order.isOwner && !order.completed && order.canAbleToBuy && (
                            <button
                              onClick={(e) => handleClaimOrder(e, order)}
                              className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
                            >
                              Claim Order
                            </button>
                          )}
                          {order.isOwner && !order.completed && (
                            <button
                              onClick={(e) => handleCancelOrder(e, order)}
                              className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {loadingOrdersMessage && (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-400 py-4">
                          {loadingOrdersMessage}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
