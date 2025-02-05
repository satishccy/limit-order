export interface AssetHolding {
  assetId: number;
  orgAmount: number;
}

export interface AssetDetails extends AssetHolding {
  amount: number;
  decimals: number;
  name: string;
  unitName: string;
}
