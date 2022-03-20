import { useCallback, useEffect, useState } from "react";
import UpgradeToken from "../components/UpgradeToken";
import useWeb3Onboard from "../hooks/useWeb3Onboard";
import { ethers } from "ethers";
import addresses from "../constants/addresses";
import daiABI from "../constants/abi/ERC20.json";

const TopupPage = () => {
  const [daiBalance, setDaiBalance] = useState();
  const [daixBalance, setDaixBalance] = useState();
  const { account, provider } = useWeb3Onboard();

  const getDaiBalance = useCallback(async () => {
    console.log("getting DAI balance");
    if (account && provider) {
      const signer = provider.getSigner();
      const fDAI = new ethers.Contract(addresses.fDAI, daiABI, signer);
      try {
        const balance = await fDAI.balanceOf(account);
        setDaiBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.log(err);
      }
    }
  }, [account, provider]);

  const getDaixBalance = useCallback(async () => {
    console.log("getting DAIx balance");
    if (account && provider) {
      const signer = provider.getSigner();
      const fDAIx = new ethers.Contract(addresses.fDAIx, daiABI, signer);
      try {
        const balance = await fDAIx.balanceOf(account);
        setDaixBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.log(err);
      }
    }
  }, [account, provider]);

  useEffect(() => {
    getDaiBalance();
    getDaixBalance();
  }, [getDaiBalance, getDaixBalance]);
  return (
    <section className="text-gray-600 h-screen w-full px-4">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:py-6 sm:px-6 lg:max-w-full lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Topup your wallet
        </h2>
        <p className="text-sm tracking-tight text-gray-900 mb-3">
          Currently only DAI is supported
        </p>
        <p className="text-lg font-medium tracking-tight text-gray-900">
          DAI Balance: {daiBalance}
        </p>
        <p className="text-lg font-medium tracking-tight text-gray-900">
          DAIx Balance: {daixBalance}
        </p>

        <div className="mt-6">
          <div>
            <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-3">
              Approve and Upgrade DAI
            </h3>
            <UpgradeToken
              getDaiBalance={getDaiBalance}
              getDaixBalance={getDaixBalance}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default TopupPage;
