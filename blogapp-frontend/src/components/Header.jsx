import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../redux/reducers/themeReducer";
import { signOutUser } from "../redux/reducers/authReducer";

const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const path = useLocation().pathname
  const theme = useSelector(state => state.theme)

  const changeTheme = () => {
    dispatch(setTheme())
  }

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
        <Button className="w-12 h-10 focus:ring-0 hidden sm:inline" color='gray' pill onClick={changeTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>
        {user ? (
          <Dropdown 
            arrowIcon={false}
            inline
            label={
              <Avatar 
                alt="user"
                img={(props) => <img src={user.profilePicture} referrerPolicy="no-referrer"  {...props} />}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{user.username}</span>
              <span className="block text-sm font-medium truncate">{user.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>
                Profile
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => dispatch(signOutUser())}>
              Sign out
            </Dropdown.Item>

          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={Link} to='/'>
            Home
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={Link} to='/about'>
            About
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;