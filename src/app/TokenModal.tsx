"use client";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface Token {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
}

interface TokenModalProps {
  show: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
}

const TokenModal: React.FC<TokenModalProps> = ({
  show,
  onClose,
  onSelectToken,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) {
      fetch("https://tokens.coingecko.com/uniswap/all.json")
        .then((response) => response.json())
        .then((data) => {
          setTokens(data.tokens);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tokens:", error);
          setLoading(false);
        });
    }
  }, [show]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/3 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>
        <h3 className="text-lg font-semibold mb-4 text-center">
          Select a Token
        </h3>
        <input
          type="text"
          placeholder="Search token"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
        />
        <div className="mt-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {filteredTokens.map((token) => (
                <li
                  key={token.address}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSelectToken(token);
                    onClose();
                  }}
                >
                  <img
                    src={token.logoURI}
                    alt={token.name}
                    className="w-6 h-6 mr-2"
                  />
                  <span>
                    {token.name} ({token.symbol})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
