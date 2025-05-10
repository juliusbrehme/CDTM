import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-traderepublic-darkpurple">
          <span className="text-traderepublic-purple">Prompt</span>Republic
        </h1>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-traderepublic-purple transition-colors font-semibold"
        >
          Home
        </Link>
        <Link
          to="/"
          className="text-black-600 hover:text-traderepublic-purple transition-colors font-semibold"
        >
          Jarvis
        </Link>
        <Link
          to="/"
          className="text-gray-600 hover:text-traderepublic-purple transition-colors font-semibold"
        >
          Invest
        </Link>
        <Link
          to="/"
          className="text-gray-600 hover:text-traderepublic-purple transition-colors font-semibold"
        >
          Save
        </Link>
        <Link
          to="/"
          className="text-gray-600 hover:text-traderepublic-purple transition-colors font-semibold"
        >
          Learn
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          className="border-traderepublic-purple text-traderepublic-purple hover:bg-traderepublic-purple hover:text-white"
        >
          Log In
        </Button>
        <Button className="bg-traderepublic-purple hover:bg-traderepublic-darkpurple text-white">
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
