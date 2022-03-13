import { useEffect, useState } from "react";
import LinkIcon from "../icons/LinkIcon";
import PlayIcon from "../icons/PlayIcon";
import { fetchAllVideos } from "../services";
import { ExternalLink } from "./Link";

const VideosTable = () => {
  const [videosList, setVideosList] = useState([]);
  const [status, setStatus] = useState("idle");

  const getAllVideos = async () => {
    setStatus("loading");

    try {
      const { data } = await fetchAllVideos();

      if (data.message) {
        const allVideos = data.message.map(
          ({
            id,
            name,
            description,
            nft_cid,
            txn_hash,
            video_cid,
            video_duration,
            wallet_address,
          }) => ({
            id,
            name,
            description,
            url: `https://ipfs.livepeer.com/ipfs/${video_cid}`,
            createdBy: wallet_address,
            nftHash: `https://mumbai.polygonscan.com/tx/${txn_hash}`,
            video_duration,
            nft_cid,
          })
        );
        setVideosList(allVideos);
        setStatus("completed");
      }
    } catch (err) {
      console.error(err);
      setStatus("fail");
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <section className="bg-indigo-500 text-gray-600 h-screen px-4">
      <div className="flex flex-col pt-20 h-full">
        <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                All Videos
              </h2>
            </div>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-left">No.</div>
                    </th>
                    <th className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-left">Video Name</div>
                    </th>
                    <th className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-left">Description</div>
                    </th>
                    <th className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Video Duration
                      </div>
                    </th>
                    <th className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-left">Created By</div>
                    </th>
                    <th className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Livepeer IPFS URL
                      </div>
                    </th>
                    <th className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-left">NFT Tx Hash</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {status === "fail" && (
                    <tr>
                      <td className="text-center py-4" colSpan={5}>
                        Failed to fetch videos
                      </td>
                    </tr>
                  )}
                  {status === "loading" && (
                    <tr>
                      <td className="text-center py-4" colSpan={5}>
                        Loading...
                      </td>
                    </tr>
                  )}
                  {status === "completed" &&
                    videosList.map(
                      ({
                        id,
                        name,
                        description,
                        url,
                        createdBy,
                        nftHash,
                        video_duration,
                      }) => (
                        <tr key={id}>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-gray-800">{id}</div>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap font-semibold">
                            <div className="text-left">{name}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="text-left ">
                              {description.substring(0, 40)}...
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="text-left ">
                              {video_duration} min
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="text-left">{createdBy}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="text-left">
                              <ExternalLink href={url}>
                                <PlayIcon />
                              </ExternalLink>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">
                              <ExternalLink href={nftHash}>
                                <LinkIcon />
                              </ExternalLink>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideosTable;
