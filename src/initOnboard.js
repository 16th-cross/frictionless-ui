import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import fortmaticModule from "@web3-onboard/fortmatic";

const injected = injectedModule();
const fortmatic = fortmaticModule({
  apiKey: "pk_test_886ADCAB855632AA",
});

const initOnboard = () =>
  init({
    wallets: [injected, fortmatic],
    chains: [
      {
        id: "0x89",
        token: "MATIC",
        label: "Matic Mainnet",
        rpcUrl: "https://matic-mainnet.chainstacklabs.com",
      },
      {
        id: "0x13881",
        token: "MATIC",
        label: "Mumbai Testnet",
        rpcUrl:
          "https://rpc-mumbai.maticvigil.com/v1/ee88c0928ef4396cb42c61833d0736ecc7340f07",
      },
    ],
    appMetadata: {
      name: "Frictionless",
      icon: "<svg><svg/>",
      description: "Watch movies by streaming crypto seamlessly",
      recommendedInjectedWallets: [
        { name: "MetaMask", url: "https://metamask.io" },
      ],
    },
  });

export default initOnboard;
