import { Indexer } from "algosdk";
import { indexerPort, indexerToken, indexerUrl } from "./constants";
import { AssetDetails, AssetHolding } from "../interfaces";

export const formatAddress = (address: string) => `${address.slice(0, 3)}...${address.slice(-3)}`;

export const getAssetsInAddress = async (address: string) => {
  const indexer = new Indexer(indexerToken, indexerUrl, indexerPort);
  let assets = await indexer.lookupAccountAssets(address).do();
  let threshold = 1000;
  while (assets.assets.length === threshold && assets["next-token"]) {
    const nextToken = assets["next-token"];
    const nextResponse = await indexer.lookupAccountAssets(address).nextToken(nextToken).do();
    assets.assets = assets.assets.concat(nextResponse.assets);
    assets["next-token"] = nextResponse["next-token"];
    threshold += 1000;
  }
  const filtered: AssetHolding[] = assets.assets.map((asset: any) => {
    return {
      assetId: asset["asset-id"],
      orgAmount: asset.amount,
      type: "asset",
    };
  });
  return filtered;
};

export const getAssetDetails = async (asset: AssetHolding): Promise<AssetDetails> => {
  const indexer = new Indexer(indexerToken, indexerUrl, indexerPort);
  const assetDetails = await indexer.lookupAssetByID(asset.assetId).do();
  return {
    assetId: asset.assetId,
    amount: asset.orgAmount / 10 ** assetDetails.asset.params.decimals,
    orgAmount: asset.orgAmount,
    decimals: assetDetails.asset.params.decimals,
    name: base64ToString(assetDetails.asset.params["name-b64"]),
    unitName: base64ToString(assetDetails.asset.params["unit-name-b64"]),
  };
};

export const getAccountAlgo = async (address: string): Promise<AssetDetails> => {
  const indexer = new Indexer(indexerToken, indexerUrl, indexerPort);
  const accountInfo = await indexer.lookupAccountByID(address).do();
  return {
    assetId: 0,
    amount: (accountInfo.account["amount-without-pending-rewards"] - accountInfo.account["min-balance"]) / 10 ** 6,
    orgAmount: accountInfo.account["amount-without-pending-rewards"] - accountInfo.account["min-balance"],
    decimals: 6,
    name: "Algorand",
    unitName: "ALGO",
  };
};

export const stringToBase64 = (input: string): string => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  return btoa(String.fromCharCode(...bytes));
};

export const base64ToString = (input: string): string => {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};
