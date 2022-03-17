import axios from "axios";

const livepeerAxios = () => {
  return axios.create({
    baseURL: "https://livepeer.com",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}`,
    },
  });
};

const createDirectUploadURL = (name) => {
  return livepeerAxios().post("/api/asset/request-upload", {
    name,
  });
};

const uploadVideo = (url, videoArrayBuffer) => {
  return livepeerAxios().put(url, videoArrayBuffer, {
    headers: {
      "Content-Type": "video/mp4",
    },
  });
};

const listAssets = () => {
  return livepeerAxios().get("/api/asset");
};

const exportAssetToIPFS = (assetId) => {
  return livepeerAxios().post(`/api/asset/${assetId}/export`, {
    ipfs: {
      pinata: {
        jwt: process.env.REACT_APP_PINATA_JWT,
      },
    },
  });
};

const retrieveTask = (taskId) => {
  return livepeerAxios().get(`/api/task/${taskId}`, {
    ipfs: {
      pinata: {
        jwt: process.env.REACT_APP_PINATA_JWT,
      },
    },
  });
};

const storeVideo = ({
  name,
  description,
  image_cid,
  txn_hash,
  nft_cid,
  video_cid,
  trailer_nft_cid,
  trailer_video_cid,
  wallet_address,
  video_duration,
}) => {
  return axios.post("http://localhost:6060/add-video", {
    name,
    description,
    image_cid,
    txn_hash,
    nft_cid,
    video_cid,
    trailer_nft_cid,
    trailer_video_cid,
    wallet_address,
    video_duration,
  });
};

const fetchAllVideos = () => {
  return axios.get("http://localhost:6060/get-all");
};
export {
  createDirectUploadURL,
  uploadVideo,
  listAssets,
  exportAssetToIPFS,
  retrieveTask,
  storeVideo,
  fetchAllVideos,
};
