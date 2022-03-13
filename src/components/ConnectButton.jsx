import useWeb3Onboard from "../hooks/useWeb3Onboard";
import ShortAddress from "./ShortAddress";

const ConnectButton = () => {
  const {
    wallet,
    connecting,
    connect,
    disconnect,
    connectedChain,
    settingChain,
    setChain,
  } = useWeb3Onboard();

  return !wallet ? (
    <div
      onClick={() => connect()}
      disabled={connecting}
      className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
    >
      Connect Web3 Wallet
    </div>
  ) : (
    <div className="flex ml-4 items-center">
      <div className="border rounded-md p-3">
        <ShortAddress address={wallet.accounts[0].address} />
      </div>
      {connectedChain.id !== "0x5" && (
        <button
          onClick={() => setChain({ chainId: "0x5" })}
          disabled={settingChain}
          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Switch to Goerli Network
        </button>
      )}
      <div
        onClick={() => disconnect(wallet)}
        className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-400 hover:bg-red-500"
      >
        Disconnect
      </div>
    </div>
  );
};

export default ConnectButton;
