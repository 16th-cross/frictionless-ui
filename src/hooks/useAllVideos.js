import { useEffect, useState } from "react";
import { fetchAllVideos } from "../services";
import DarkKnightImg from "../assets/darkknight.jpeg";
import StarWarsImg from "../assets/starwars.jpeg";
import InterstellarImg from "../assets/interstellar.jpg";
import MatrixImg from "../assets/matrix.jpg";

const images = [DarkKnightImg, StarWarsImg, InterstellarImg, MatrixImg];
function useAllVideos() {
  const [videosList, setVideosList] = useState([]);
  const [status, setStatus] = useState("idle");

  const getAllVideos = async () => {
    setStatus("loading");

    try {
      const { data } = await fetchAllVideos();

      if (data.message) {
        const allVideos = data.message.map(
          (
            {
              id,
              name,
              description,
              nft_cid,
              txn_hash,
              video_cid,
              video_duration,
              wallet_address,
            },
            idx
          ) => ({
            id,
            name,
            description,
            url: `https://ipfs.livepeer.com/ipfs/${video_cid}`,
            createdBy: wallet_address,
            nftHash: `https://goerli.etherscan.io/tx/${txn_hash}`,
            video_duration,
            nft_cid,
            imgSrc: images[idx % images.length],
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
