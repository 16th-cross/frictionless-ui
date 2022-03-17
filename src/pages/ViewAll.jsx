import useAllVideos from "../hooks/useAllVideos";
import { Link } from "react-router-dom";

const ViewAllPage = () => {
  const { status, videosList } = useAllVideos();

  return (
    <section className="text-gray-600 h-screen w-full px-4">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:py-6 sm:px-6 lg:max-w-full lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Latest Videos
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {status === "fail" && (
            <div className="text-center py-4">Failed to fetch videos</div>
          )}
          {status === "loading" && (
            <div className="text-center py-4">Loading...</div>
          )}
          {status === "completed" &&
            videosList.map(
              ({
                id,
                name,
                description,
                url,
                createdBy: wallet_address,
                nftHash,
                video_duration,
                nft_cid,
                imgSrc,
              }) => (
                <Link to={`/watch/${id}`} key={id} className="group relative">
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                    <img
                      src={imgSrc}
                      alt={name}
                      className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-md text-gray-900 font-semibold">
                        {name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {description}
                      </p>
                    </div>
                    <p className="text-sm text-gray-900">
                      Duration: {video_duration} sec
                    </p>
                  </div>
                </Link>
              )
            )}
        </div>
      </div>
    </section>
  );
};
export default ViewAllPage;
