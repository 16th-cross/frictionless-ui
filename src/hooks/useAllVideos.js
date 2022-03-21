import { useEffect, useState } from "react";
import { fetchAllVideos } from "../services";

function useAllVideos() {
  const [videosList, setVideosList] = useState([]);
  const [status, setStatus] = useState("idle");

  const getAllVideos = async () => {
    setStatus("loading");

    try {
      const { data } = await fetchAllVideos();
      console.log(data.message);

      if (data.message) {
        const allVideos = data.message.map(
          (
            {
              id,
              name,
              description,
              image_cid,
              trailer_nft_cid,
              txn_hash,
              video_cid,
              trailer_video_cid,
              video_duration,
              wallet_address,
            },
            idx
          ) => ({
            id,
            name,
            description,
            url: `https://ipfs.livepeer.com/ipfs/${video_cid}`,
            trailer_url: `https://ipfs.livepeer.com/ipfs/${trailer_video_cid}`,
            createdBy: wallet_address,
            nftHash: `https://mumbai.polygonscan.com/tx/${txn_hash}`,
            video_duration,
            trailer_nft_cid,
            imgSrc: `https://ipfs.infura.io/ipfs/${image_cid}`,
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

  return { status, videosList };
}
export default useAllVideos;
