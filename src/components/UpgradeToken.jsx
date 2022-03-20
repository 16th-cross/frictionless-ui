import { useState } from "react";
import useWeb3Onboard from "../hooks/useWeb3Onboard";
import LoadingIndicator from "./LoadingIndicator";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import addresses from "../constants/addresses";
import daiABI from "../constants/abi/ERC20.json";
import { ExternalLink } from "./Link";

const UpgradeToken = ({ getDaiBalance, getDaixBalance }) => {
  const { wallet, provider } = useWeb3Onboard();
  const [status, setStatus] = useState("idle");
  const [polygonscanLink, setPolygonscanLink] = useState();
  const [amount, setAmount] = useState("");

  //will be used to approve super token contract to spend DAI
  const daiApprove = async () => {
    if (!provider) return null;
    setStatus("approving");
    const signer = provider.getSigner();

    const fDAI = new ethers.Contract(addresses.fDAI, daiABI, signer);
    try {
      console.log("approving DAI spend");
      const tx = await fDAI.approve(
        addresses.fDAIx,
        ethers.utils.parseEther(amount)
      );
      setPolygonscanLink(`https://mumbai.polygonscan.com/tx/${tx.hash}`);
      await tx.wait();
    } catch (error) {
      console.error(error);
    } finally {
      setStatus("idle");
    }
  };

  //where the Superfluid logic takes place
  async function daiUpgrade() {
    if (!provider) return null;
    setStatus("upgrading");
    const sf = await Framework.create({
      networkName: "mumbai",
      provider,
    });

    const signer = provider.getSigner();
    const DAIx = await sf.loadSuperToken(addresses.fDAIx);

    try {
      console.log(`upgrading $${amount} DAI to DAIx`);
      const amtToUpgrade = ethers.utils.parseEther(amount);
      const upgradeOperation = DAIx.upgrade({
        amount: amtToUpgrade.toString(),
      });
      const upgradeTxn = await upgradeOperation.exec(signer);
      setPolygonscanLink(
        `https://mumbai.polygonscan.com/tx/${upgradeTxn.hash}`
      );
      await upgradeTxn.wait();
      await getDaiBalance();
      await getDaixBalance();
    } catch (error) {
      console.error(error);
    } finally {
      setStatus("idle");
      setAmount("");
    }
  }

  return (
    <div>
      <input
        type="text"
        name="approveAmount"
        placeholder="0.00 DAI"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-64 shadow-sm sm:text-sm border-gray-300 rounded-md"
      />

      <div>
        <button
          type="submit"
          disabled={!wallet || status === "approving"}
          onClick={daiApprove}
          className="inline-flex gap-1 justify-center mt-5 py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
        >
          Step 1: Approve DAI Upgrade
          {status === "approving" && <LoadingIndicator />}
        </button>
        <div></div>

        <button
          type="submit"
          disabled={!wallet || status === "upgrading"}
          onClick={daiUpgrade}
          className="inline-flex gap-1 justify-center mt-2 py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
        >
          Step 2: Upgrade DAI to DAIx
          {status === "upgrading" && <LoadingIndicator />}
        </button>
        {!wallet && (
          <div className="mt-3 text-xs">Please connect your wallet</div>
        )}
      </div>
      {polygonscanLink && (
        <ExternalLink href={polygonscanLink}>
          <div className="mt-4 text-sm text-indigo-500">
            View Transaction on Polygonscan
          </div>
        </ExternalLink>
      )}
    </div>
  );
};

export default UpgradeToken;
