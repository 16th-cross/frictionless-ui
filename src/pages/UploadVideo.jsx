import { useForm } from "react-hook-form";
import addresses from "../constants/addresses";
import useWeb3Onboard from "../hooks/useWeb3Onboard";
import {
  createDirectUploadURL,
  exportAssetToIPFS,
  listAssets,
  retrieveTask,
  storeVideo,
  uploadVideo,
} from "../services";
import FrictionlessNFTABI from "../constants/abi/FrictionlessNFT.json";
import { ethers } from "ethers";
import { useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import { useHistory } from "react-router-dom";
import { create } from 'ipfs-http-client'

const UploadVideoPage = () => {
  const { register, handleSubmit } = useForm();
  const { wallet, provider } = useWeb3Onboard();
  const history = useHistory();
  const [status, setStatus] = useState(false);
  const client = create('https://ipfs.infura.io:5001/api/v0')
  // const file = event.target.files[0];
  // const sourceURL = URL.createObjectURL(file);

  const transcodeAndUploadVideo = async (video_data, name) => {
    const videoArrayBuffer = await new Promise((resolve, reject) => {
      const uploadFile = video_data[0];
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(/*...*/);
      };
      reader.readAsArrayBuffer(uploadFile);
    });

    // 1. Create Direct upload url
    const directUploadResponse = await createDirectUploadURL(name);
    const uploadURL = directUploadResponse?.data?.url;

    // 2. Livepeer transcode
    const uploadResponse = await uploadVideo(uploadURL, videoArrayBuffer);
    console.log({ uploadResponse });
    
    // 3. List all assets
    const MAX_POLL_COUNT = 10;
    const POLL_INTERVAL = 3000;
    let pollCount = 0;
    let allAssestsResponse;
    while (pollCount < MAX_POLL_COUNT) {
      console.log("polling", pollCount);
      const response = await new Promise((resolve) => {
        setTimeout(async () => {
          const response = await listAssets();
          resolve(response);
        }, POLL_INTERVAL);
      });

      if (response?.data[0].name === name) {
        allAssestsResponse = response;
        break;
      }
      pollCount++;
    }

    console.log("Finish...Got the asset data");

    const latestAsset = allAssestsResponse?.data[0];

    if (!latestAsset) {
      throw new Error("Request timeout, upload took too long");
    }

    console.log({ latestAsset });
    const video_duration = Math.ceil(latestAsset?.videoSpec.duration);

    // 4. IPFS storage and pin to IPFS
    const exportResponse = await exportAssetToIPFS(latestAsset.id);
    const taskId = exportResponse.data?.task?.id;
    console.log({ exportResponse });

    // 5. Retrieve task and poll until its completion
    pollCount = 0;
    let retrieveTaskResponse;
    while (pollCount < MAX_POLL_COUNT) {
      console.log("polling", pollCount);
      const response = await new Promise((resolve) => {
        setTimeout(async () => {
          const response = await retrieveTask(taskId);
          resolve(response);
        }, POLL_INTERVAL);
      });

      if (response.data.status.phase === "completed") {
        retrieveTaskResponse = response;
        break;
      }
      pollCount++;
    }

    const output = retrieveTaskResponse?.data?.output;

    if (!output) {
      throw new Error("Request timeout, upload took too long");
    }

    const { videoFileCid, nftMetadataCid } = output?.export?.ipfs;
    console.log({ videoFileCid, nftMetadataCid });
    return { videoFileCid, nftMetadataCid, video_duration };
  };

  const mintNFT = async (nftMetadataUrl) => {
    const nftFactoryAddress = addresses.nftFactoryContract;
    const signer = provider.getSigner();
    const nftFactoryContract = new ethers.Contract(
      nftFactoryAddress,
      FrictionlessNFTABI,
      signer
    );

    try {
      const tx = await nftFactoryContract.mint(nftMetadataUrl);
      return tx;
    } catch (err) {
      console.error(err);
    }
  };
  const onSubmit = async (values) => {
    const { name, description, thumbnail, trailer, video } = values;
    setStatus("loading");

    try {
      // Upload image to IPFS
      const added = await client.add(thumbnail[0]);
      const imageFileCid = added.path;
      console.log("Url for image =", imageFileCid);

      // upload trailer to IPFS
      const trailerData = await transcodeAndUploadVideo(trailer, `${name}_trailer`);

      // upload video to IPFS
      const videoData = await transcodeAndUploadVideo(video, name);

      // 6. Mint NFT
      console.log("Finish...Mint NFT now");
      const tx = await mintNFT(`ipfs://${trailerData.nftMetadataCid}`);
      const result = await tx.wait();
      console.log({ result });

      // 7. POST data to backend
      if (tx.hash) {
        const walletAddress = wallet?.accounts[0]?.address;
        console.log({ walletAddress });
        const storeVideoResponse = await storeVideo({
          name,
          description,
          image_cid: imageFileCid,
          txn_hash: tx.hash,
          nft_cid: videoData.nftMetadataCid,
          video_cid: videoData.videoFileCid,
          trailer_nft_cid: trailerData.nftMetadataCid,
          trailer_video_cid: trailerData.videoFileCid,
          wallet_address: walletAddress,
          video_duration: videoData.video_duration,
        });
        console.log({ storeVideoResponse });
        setStatus("idle");
        history.push("/watch");
      }
    } catch (error) {
      console.error(error);
      setStatus("fail");
    }
  };

  return (
    <section className="text-gray-600 h-screen px-4">
      <div className="flex flex-col pt-20 h-full">
        <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            {...register("name")}
                            autoComplete="given-name"
                            placeholder="Awesome movie"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />

                          <div className="mt-5">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                rows={3}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                placeholder="This movie is awesome!!"
                                defaultValue={""}
                                {...register("description")}
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              Brief description for your movie.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Video Thumbnail
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-7 pb-9 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-center items-center justify-center w-64 text-gray-600">
                            <input
                              type="file"
                              // className="sr-only"
                              name="thumbnail"
                              accept=".jpg"
                              {...register("thumbnail")}
                            />
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG or JPG supported
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Video Trailer
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-center items-center justify-center w-64 text-gray-600">
                            <input
                              type="file"
                              // className="sr-only"
                              name="trailer"
                              accept=".mp4"
                              {...register("trailer")}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Only .mp4 supported
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Video
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-center items-center justify-center w-64 text-gray-600">
                            <input
                              type="file"
                              // className="sr-only"
                              name="video"
                              accept=".mp4"
                              {...register("video")}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Only .mp4 supported
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                    <button
                      type="submit"
                      disabled={!wallet || status === "loading"}
                      className="inline-flex gap-1 justify-center py-3 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
                    >
                      Upload
                      {status === "loading" && <LoadingIndicator />}
                    </button>
                    {!wallet && (
                      <div className="mt-3">Please connect your wallet</div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadVideoPage;
