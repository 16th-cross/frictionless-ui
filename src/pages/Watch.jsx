import useAllVideos from "../hooks/useAllVideos";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinkIcon from "../icons/LinkIcon";
import { ExternalLink } from "../components/Link";

const WatchPage = () => {
  const { status, videosList } = useAllVideos();
  const [currentVideo, setCurrentVideo] = useState();
  const { id } = useParams();
  useEffect(() => {
    if (videosList.length > 0 && id && !currentVideo) {
      setCurrentVideo(videosList.find((x) => x.id === Number(id)));
    }
  }, [id, videosList, currentVideo]);

  if (status === "loading") {
    return <div className="text-center py-4">Loading...</div>;
  } else if (status === "fail") {
    return <div className="text-center py-4">Failed to fetch video</div>;
  } else if (currentVideo) {
    const { name, description, url, video_duration, nftHash } = currentVideo;
    return (
      <section className="text-gray-600 h-screen max-w-10xl px-4">
        <div className="max-w-7xl mt-4 mx-auto">
          <div className="max-w-full mt-4 mx-auto">
            <video width="100%" className="m-auto" controls src={url} />
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
              </div>
              <p className="text-2xl mt-2 font-medium tracking-tight text-gray-900">
                {description}
              </p>
            </div>

            <p className="text-md tracking-tight text-gray-900">
              Duration: {video_duration} seconds
            </p>
          </div>
        </div>
      </section>
    );
  }
  return null;
};
export default WatchPage;
