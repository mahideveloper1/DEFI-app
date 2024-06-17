import React, { useState } from "react";
import axios from "axios";
import TokenModal from "./TokenModal";

interface Token {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  decimals: number;
}

const SwapCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTokenLabel, setSelectedTokenLabel] = useState("");
  const [selectedToken1, setSelectedToken1] = useState<Token | null>(null);
  const [selectedToken2, setSelectedToken2] = useState<Token | null>(null);
  const [token1Amount, setToken1Amount] = useState<string>("");
  const [token2Amount, setToken2Amount] = useState<string>("");
  const [gasEstimate, setGasEstimate] = useState<string>("");

  const openModal = (label: string) => {
    setSelectedTokenLabel(label);
    setShowModal(true);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectedTokenLabel === "Token 1") {
      setSelectedToken1(token);
      setToken1Amount("");
      setToken2Amount("");
    } else {
      setSelectedToken2(token);
      setToken1Amount("");
      setToken2Amount("");
    }
    setShowModal(false);
  };

  const getPrice = async () => {
    if (!selectedToken1 || !selectedToken2 || !token1Amount) return;

    const amount = Number(token1Amount) * 10 ** selectedToken1.decimals;

    const params = new URLSearchParams({
      sellToken: selectedToken1.address,
      buyToken: selectedToken2.address,
      sellAmount: amount.toString(),
    }).toString();

    try {
      const response = await axios.get(
        `https://api.0x.org/swap/v1/price?${params}`
      );
      const swapPriceJSON = response.data;
      const buyAmount = swapPriceJSON.buyAmount / 10 ** selectedToken2.decimals;
      setToken2Amount(buyAmount.toString());
    } catch (error) {
      console.error("Error fetching price:", error);
      // Handle error if necessary
    }
  };

  const handleToken1AmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken1Amount(e.target.value);
    getPrice();
  };

  const handleSwap = () => {
    console.log("Swap button clicked");
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Token Swap</h3>
      <div className="mb-4">
        <label
          htmlFor="selectToken1"
          className="block font-medium mb-1 text-blue-500 cursor-pointer"
          onClick={() => openModal("Token 1")}
        >
          Select Token 1
        </label>
        <div className="flex">
          <input
            type="text"
            id="selectToken1"
            value={
              selectedToken1
                ? `${selectedToken1.name} (${selectedToken1.symbol})`
                : ""
            }
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
            readOnly
          />
          {selectedToken1 && (
            <input
              type="number"
              placeholder="Amount"
              value={token1Amount}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              onChange={handleToken1AmountChange}
            />
          )}
        </div>
        {selectedToken1 && (
          <img
            src={selectedToken1.logoURI}
            alt={selectedToken1.name}
            className="w-10 h-10 mx-auto mt-2"
          />
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="selectToken2"
          className="block font-medium mb-1 text-blue-500 cursor-pointer"
          onClick={() => openModal("Token 2")}
        >
          Select Token 2
        </label>
        <div className="flex">
          <input
            type="text"
            id="selectToken2"
            value={
              selectedToken2
                ? `${selectedToken2.name} (${selectedToken2.symbol})`
                : ""
            }
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
            readOnly
          />
          {selectedToken2 && (
            <input
              type="number"
              placeholder="Amount"
              value={token2Amount}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              readOnly
            />
          )}
        </div>
        {selectedToken2 && (
          <img
            src={selectedToken2.logoURI}
            alt={selectedToken2.name}
            className="w-10 h-10 mx-auto mt-2"
          />
        )}
      </div>
      <div className="mb-4">
        <div id="gas_estimate">Gas Estimate: {gasEstimate}</div>
      </div>
      <button
        onClick={handleSwap}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        disabled={!selectedToken1 || !selectedToken2}
      >
        Swap Tokens
      </button>
      <TokenModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSelectToken={handleTokenSelect}
      />
    </div>
  );
};

export default SwapCard;
