import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { WalletProvider } from "./context/WalletContext";
import { useWallet } from "./context/WalletContext";
import { WalletConnectButton } from "./components/WalletConnectButton";
import { MySwapsDashboard } from "./components/MySwapsDashboard";
import { InitiateSwapModal } from "./components/InitiateSwapModal";
import type { Listing } from "./components/InitiateSwapModal";

/**
 * Listens for a custom "open-initiate-swap" event dispatched by app.js
 * when a buyer clicks "Initiate Swap" on a listing card.
 */
function InitiateSwapBridge() {
  const { wallet } = useWallet();
  const [activeListing, setActiveListing] = useState<Listing | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const listing = (e as CustomEvent<Listing>).detail;
      setActiveListing(listing);
      setLastSwapId(null);
    };
    window.addEventListener("open-initiate-swap", handler);
    return () => window.removeEventListener("open-initiate-swap", handler);
  }, []);

  if (!activeListing) return null;

  if (!wallet) {
    // Prompt wallet connection instead of showing the modal
    return createPortal(
      <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "1rem 1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 999, fontSize: "0.9rem", color: "#4a5568" }}>
        Connect your wallet to initiate a swap.
        <button onClick={() => setActiveListing(null)} style={{ marginLeft: "0.75rem", background: "none", border: "none", cursor: "pointer", color: "#718096" }}>✕</button>
      </div>,
      document.body
    );
  }

  return createPortal(
    <InitiateSwapModal
      listing={activeListing}
      wallet={wallet}
      onClose={() => setActiveListing(null)}
      onSuccess={(id) => {
        // Dispatch event so app.js can refresh the listings grid
        window.dispatchEvent(new CustomEvent("swap-initiated", { detail: { swapId: id } }));
      }}
    />,
    document.body
  );
}

function App() {
  const walletRoot = document.getElementById("wallet-root");
  const dashboardRoot = document.getElementById("dashboard-root");

  return (
    <WalletProvider>
      {walletRoot && createPortal(<WalletConnectButton />, walletRoot)}
      {dashboardRoot && createPortal(<MySwapsDashboard />, dashboardRoot)}
      <InitiateSwapBridge />
    </WalletProvider>
  );
}

const appRoot = document.createElement("div");
appRoot.id = "react-app-root";
appRoot.style.display = "none";
document.body.appendChild(appRoot);

createRoot(appRoot).render(<App />);
