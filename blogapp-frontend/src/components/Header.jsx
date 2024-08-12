import { Navbar, TextInput, Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

const Header = () => {
  const path = useLocation().pathname
  return (
    <Navbar className="border-b-2">
      <Navbar.Brand as={'div'}>
        <Link to="/" className="text-sm sm:text-xl font-semibold self-center whitespace-nowrap dark:text-white">
          <span>Blog</span>
          <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg text-white">Verse</span>
        </Link>
      </Navbar.Brand>
      <form>
        <TextInput 
          type="text" 
          placeholder="Search" 
          className="hidden lg:inline"
          rightIcon={AiOutlineSearch}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden focus:ring-0" color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 focus:ring-0 hidden sm:inline" color='gray' pill>
          <FaMoon />
        </Button>
        <Link to="/signin">
          <Button className="focus:ring-0" gradientDuoTone='purpleToBlue' outline>
            Sign In
          </Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>
            About
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;