import React from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
// import Web3 from "web3";
import { ethers } from "ethers";

const Web3Context = React.createContext();

export const Web3Provider = ({ children }) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain, settingChain }, setChain] = useSetChain();

  return (
    <Web3Context.Provider
      value={{
        wallet,
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
