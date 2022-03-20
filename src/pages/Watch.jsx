import useAllVideos from "../hooks/useAllVideos";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinkIcon from "../icons/LinkIcon";
import OpenseaIcon from "../icons/opensea.svg";
import { ExternalLink } from "../components/Link";
import useWeb3Onboard from "../hooks/useWeb3Onboard";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import addresses from "../constants/addresses";
import LoadingIndicator from "../components/LoadingIndicator";

const WatchPage = () => {
  const { status, videosList } = useAllVideos();
  const { account, provider } = useWeb3Onboard();
  const [currentVideo, setCurrentVideo] = useState();
  const [watchStatus, setWatchStatus] = useState("idle");

  const isCurrentlyWatching =
    watchStatus === "watching" || watchStatus === "stopping";

  const { id } = useParams();

  useEffect(() => {
    if (videosList.length > 0 && id && !currentVideo) {
      setCurrentVideo(videosList.find((x) => x.id === Number(id)));
    }
  }, [id, videosList, currentVideo]);

  const startStream = async () => {
    if (!provider) return null;
    setWatchStatus("starting");
    const sf = await Framework.create({
      networkName: "mumbai",
      provider,
    });

    const signer = provider.getSigner();
    console.log({ currentVideo });
    const flowRate = ethers.utils.parseEther("0.001"); // 0.001 DAIx/sec
    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate,
        receiver: currentVideo.wallet_address,
        superToken: addresses.fDAIx,
      });

      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(signer);
      await result.wait();
      setWatchStatus("watching");
      console.log("Streaming started");
    } catch (error) {
      console.error(error);
      setWatchStatus("idle");
    }
  };

  const stopStream = async () => {
    if (!provider || !account) return null;
    setWatchStatus("stopping");

    const sf = await Framework.create({
      networkName: "mumbai",
      provider,
    });
    const signer = provider.getSigner();
    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: account,
        receiver: currentVideo.wallet_address,
        superToken: addresses.fDAIx,
      });

      console.log("Deleting your stream...");

      const result = await deleteFlowOperation.exec(signer);
      await result.wait();
      setWatchStatus("idle");

      console.log(
        `Congrats - you've just deleted your money stream!
         Network: Mumbai
         Super Token: DAIx
         Sender: ${account}
         Receiver: ${currentVideo.wallet_address}
      `
      );
    } catch (error) {
      console.error(error);
      setWatchStatus("watching");
    }
  };

  if (status === "loading") {
    return <div className="text-center py-4">Loading...</div>;
  } else if (status === "fail") {
    return <div className="text-center py-4">Failed to fetch video</div>;
  } else if (currentVideo) {
    const { name, description, url, video_duration, trailer_url, nftHash } =
      currentVideo;
    return (
      <section className="text-gray-600 h-screen max-w-10xl px-4">
        <div className="max-w-7xl mt-4 mx-auto">
          <div className="max-w-full mt-4 mx-auto">
            <video
              width="100%"
              className="m-auto"
              controls
              src={isCurrentlyWatching ? url : trailer_url}
              controlsList="nodownload"
            />
          </div>
          <div className="flex mt-5 justify-between">
            <div>
              <div className="flex gap-4 items-center">
                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  {name}
                </h2>
                <ExternalLink href={nftHash}>
                  <LinkIcon />
                </ExternalLink>
                <ExternalLink href={"https://testnets.opensea.io/account"}>
                  <img width={"20"} src={OpenseaIcon} alt="view on opensea" />
                </ExternalLink>
              </div>
              <p className="text-2xl mt-2 font-medium tracking-tight text-gray-900">
                {description}
              </p>
            </div>

            <div>
              {isCurrentlyWatching ? (
                <button
                  onClick={stopStream}
                  disabled={watchStatus === "stopping"}
                  className="inline-flex gap-1 justify-center mt-5 py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-300"
                >
                  Stop Watching
                  {watchStatus === "stopping" && <LoadingIndicator />}
                </button>
              ) : (
                <button
                  onClick={startStream}
                  disabled={watchStatus === "starting"}
                  className="inline-flex gap-1 justify-center mt-5 py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
                >
                  Watch Now
                  {watchStatus === "starting" && <LoadingIndicator />}
                </button>
              )}

              <p className="text-md tracking-tight text-gray-900 mt-2">
                Duration: {video_duration} seconds
              </p>
              <p className="text-sm tracking-tight text-gray-900 mt-2">
                Cost: 0.001 DAIx/second
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return null;
};
export default WatchPage;
