import React, { useState } from "react";
import { ChevronDown, Search, Plus } from "lucide-react";
import { Cuboid as Cube, Diamond, Bitcoin, DollarSign } from "lucide-react";
import { AssetDetails } from "../interfaces";
import { getAssetDetails } from "../utils";
import { toast } from "react-toastify";

interface AssetSelectProps {
  assets: AssetDetails[];
  value: AssetDetails | null;
  onChange: (value: AssetDetails) => void;
  allowCustomAsset?: boolean;
  className?: string;
}

export function AssetSelect({ assets, value, onChange, allowCustomAsset = false, className = "" }: AssetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAsset, setCustomAsset] = useState("");

  const filteredAssets = assets.filter(
    (asset) =>
      asset.unitName.toLowerCase().includes(searchQuery.toLowerCase()) || asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="">
      {/* Selected Asset Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-[#2c2d33] rounded-xl px-3 py-2 hover:bg-[#3a3b41] transition-colors ${className}`}
      >
        <span className="text-white">{value ? value.unitName : "Select Asset"}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-[#2c2d33] rounded-xl shadow-lg border border-[#1a1b1f] overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-[#1a1b1f]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1b1f] rounded-lg pl-9 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Custom Asset Input */}
          {allowCustomAsset && (
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="w-full p-3 flex items-center gap-2 hover:bg-[#1a1b1f] transition-colors border-b border-[#1a1b1f]"
            >
              <Plus className="w-4 h-4 text-blue-500" />
              <span className="text-blue-500">Add custom asset</span>
            </button>
          )}

          {/* Custom Asset Input Field */}
          {showCustomInput && (
            <div className="p-3 border-b border-[#1a1b1f]">
              <input
                type="number"
                placeholder="Enter asset ID"
                value={customAsset}
                onChange={(e) => setCustomAsset(e.target.value)}
                className="w-full bg-[#1a1b1f] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={async () => {
                  if (customAsset) {
                    try {
                      const assetDetails = await getAssetDetails({ assetId: Number(customAsset), orgAmount: 0 });
                      console.log(assetDetails);
                      onChange(assetDetails);
                      setIsOpen(false);
                      setShowCustomInput(false);
                      setCustomAsset("");
                    } catch (e: any) {
                      toast.error(e.message);
                      console.error(e);
                    }
                    // onChange({ assetId: customAsset, unitName: customAsset, name: customAsset });
                    // setIsOpen(false);
                    // setShowCustomInput(false);
                    // setCustomAsset("");
                  }
                }}
                className="mt-2 w-full bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition-colors"
              >
                Add Asset
              </button>
            </div>
          )}

          {/* Asset List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <button
                key={asset.assetId}
                onClick={() => {
                  onChange(asset);
                  setIsOpen(false);
                }}
                className="w-full p-3 flex items-center justify-between hover:bg-[#1a1b1f] transition-colors border-b border-[#1a1b1f] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-white font-medium">{asset.unitName}</div>
                    <div className="text-gray-400 text-sm">{asset.name}</div>
                  </div>
                </div>
                {asset.amount && <span className="text-gray-400 text-sm">Balance: {asset.amount}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
