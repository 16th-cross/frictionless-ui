import React, { useEffect } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
// import Web3 from "web3";
import { ethers } from "ethers";

const Web3Context = React.createContext();

export const Web3Provider = ({ children }) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain, settingChain }, setChain] = useSetChain();

  useEffect(() => {
    if (wallet) window.localStorage.setItem("connectedWallet", wallet.label);
  }, [wallet]);

  useEffect(() => {
    const previouslyConnectedWallet =
      window.localStorage.getItem("connectedWallet");

    if (previouslyConnectedWallet) {
      connect({ autoSelect: previouslyConnectedWallet });
    }
  }, [connect]);

  return (
    <Web3Context.Provider
      value={{
        wallet,
        account: wallet && wallet.accounts[0].address,
        connecting,
        connect,
        disconnect,
        connectedChain,
        settingChain,
        setChain,
        provider: wallet?.provider
          ? new ethers.providers.Web3Provider(wallet.provider)
          : undefined,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

function useWeb3Onboard() {
  return React.useContext(Web3Context);
}

export default useWeb3Onboard;
