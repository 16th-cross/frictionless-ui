import { Link } from "react-router-dom";

import ConnectButton from "./ConnectButton";
const Header = () => (
  <div className="max-w-100 mx-auto px-4 sm:px-6">
    <div className="flex justify-between items-center  py-6 md:justify-start md:space-x-10">
      <div className="flex items-center gap-4 lg:w-0 lg:flex-1">
        <Link to="/">
          <img
            className="h-8 w-auto sm:h-10"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="frictionless"
          />
        </Link>
        <Link to="/">
          <div className="text-xl font-medium text-indigo-900">
            Frictionless
          </div>
        </Link>
      </div>

      <div className="hidden md:flex items-center justify-end md:flex-1 ">
        <Link
          to="/admin"
          className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
        >
          Admin
        </Link>
        <Link
          to="/admin/upload"
          className="ml-8 whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
        >
          Upload Video
        </Link>
        <ConnectButton />
      </div>
    </div>
  </div>
);

export default Header;
