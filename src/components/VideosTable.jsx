import LinkIcon from "../icons/LinkIcon";
import PlayIcon from "../icons/PlayIcon";
import { ExternalLink } from "./Link";

const videos = [
  {
    id: 1,
    name: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    url: "https://www.imdb.com/video/vi324468761?playlistId=tt0468569",
    createdBy: "0x3366E73946B725EC9351759aBC51C30465f55E29",
    nftHash:
      "https://polygonscan.com/tx/0x1bfc4330d346c1d7ebd2598956efc9238ad7b46d8b8ec0da5407821dc5022f21",
  },
  {
    id: 2,
    name: "The Matrix",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    url: "https://www.imdb.com/video/vi324468761?playlistId=tt0468569",
    createdBy: "0x3366E73946B725EC9351759aBC51C30465f55E29",
    nftHash:
      "https://polygonscan.com/tx/0x1bfc4330d346c1d7ebd2598956efc9238ad7b46d8b8ec0da5407821dc5022f21",
  },
  {
    id: 3,
    name: "Fight Club",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    url: "https://www.imdb.com/video/vi324468761?playlistId=tt0468569",
    createdBy: "0x3366E73946B725EC9351759aBC51C30465f55E29",
    nftHash:
      "https://polygonscan.com/tx/0x1bfc4330d346c1d7ebd2598956efc9238ad7b46d8b8ec0da5407821dc5022f21",
  },
  {
    id: 4,
    name: "Interstellar",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    url: "https://www.imdb.com/video/vi324468761?playlistId=tt0468569",
    createdBy: "0x3366E73946B725EC9351759aBC51C30465f55E29",
    nftHash:
      "https://polygonscan.com/tx/0x1bfc4330d346c1d7ebd2598956efc9238ad7b46d8b8ec0da5407821dc5022f21",
  },
  {
    id: 5,
    name: "Star Wars",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    url: "https://www.imdb.com/video/vi324468761?playlistId=tt0468569",
    createdBy: "0x3366E73946B725EC9351759aBC51C30465f55E29",
    nftHash:
      "https://polygonscan.com/tx/0x1bfc4330d346c1d7ebd2598956efc9238ad7b46d8b8ec0da5407821dc5022f21",
  },
];

const VideosTable = () => (
  <section className="bg-indigo-500 text-gray-600 h-screen px-4">
    <div className="flex flex-col pt-20 h-full">
      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <header className="px-5 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">All Videos</h2>
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
                    <div className="font-semibold text-left">Created By</div>
                  </th>
                  <th className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-left">IPFS URL</div>
                  </th>
                  <th className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-left">NFT Tx Hash</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {videos.map(
                  ({ id, name, description, url, createdBy, nftHash }) => (
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

export default VideosTable;
