import { useForm } from "react-hook-form";
import {
  createDirectUploadURL,
  exportAssetToIPFS,
  listAssets,
  retrieveTask,
  uploadVideo,
} from "../services";

const UploadVideoPage = () => {
  const { register, handleSubmit } = useForm();
  // const file = event.target.files[0];
  // const sourceURL = URL.createObjectURL(file);
  const onSubmit = async (values) => {
    const { name, video } = values;

    const videoArrayBuffer = await new Promise((resolve, reject) => {
      const uploadFile = video[0];
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(/*...*/);
      };
      reader.readAsArrayBuffer(uploadFile);
    });

    // 0. Create Direct upload url
    const directUploadResponse = await createDirectUploadURL(name);
    const uploadURL = directUploadResponse?.data?.url;

    // 1. Livepeer transcode
    const uploadResponse = await uploadVideo(uploadURL, videoArrayBuffer);
    console.log({ uploadResponse });

    // 2. List all assets
    const allAssetsResponse = await listAssets();
    const latestAsset = allAssetsResponse?.data[0];
    console.log({ latestAsset });

    // 3. IPFS storage and pin to IPFS
    const exportResponse = await exportAssetToIPFS(latestAsset.id);
    const taskId = exportResponse.data?.task?.id;
    console.log({ exportResponse });

    // 4. Retrieve task and poll until its completion
    const MAX_POLL_COUNT = 10;
    const POLL_INTERVAL = 3000;

    let pollCount = 0;
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

    console.log("Finish...Mint NFT now");

    const output = retrieveTaskResponse?.data?.output;

    if (!output) {
      throw new Error("Request timeout, upload took too long");
    }

    const { videoFileCid, nftMetadataCid } = output?.export?.ipfs;
    console.log({ videoFileCid, nftMetadataCid });

    // 5. Mint NFT
    // nftMetadataUrl
    // const nftMetadataUrl = `ipfs://${nftMetadaCid}`;
    // .mint(account, nftMetadataUrl)

    // 6. POST data to backend
  };

  return (
    <section className="bg-indigo-500 text-gray-600 h-screen px-4">
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
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="thumbnail-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload an image</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  {...register("thumbnail")}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
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
                      {/* <video
                        className="VideoInput_video"
                        width="100%"
                        controls
                        src={sourceURL}
                      /> */}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-3 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Upload
                    </button>
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
