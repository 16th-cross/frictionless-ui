import { Link } from "react-router-dom";

const HomePage = () => (
  <section className="text-gray-600 h-screen w-full px-4  bg-gradient-to-t from-indigo-400 via-indigo-100 to-white">
    <div className="text-center">
      <h1 className="text-6xl pt-16 font-extrabold text-indigo-500">
        Welcome to Frictionless
      </h1>
      <p className="text-2xl pt-6">
        Watch movies by streaming crypto seamlessly
      </p>
      <p className="text-xl pt-2 font-semibold">
        Powered by Livepeer and Superfluid
      </p>
      <Link to="/watch">
        <div className="mt-10 whitespace-nowrap inline-flex items-center justify-center px-10 py-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700">
          Get Started
        </div>
      </Link>
    </div>
  </section>
);

export default HomePage;
