import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../redux/reducers/themeReducer";
import { signOutUser } from "../redux/reducers/authReducer";
import { useEffect, useState } from "react";

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const path = useLocation().pathname
  const theme = useSelector(state => state.theme)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const search = urlParams.get('searchTerm')
    if (search) {
      setSearch(search)
    } else {
      setSearch('')
    }
  }, [location.search])

  const changeTheme = () => {
    dispatch(setTheme())
  }
  const handleSignOut = () => {
    dispatch(signOutUser())
    navigate('/')
    return
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', search)
    const query = urlParams.toString()
    navigate(`/search?${query}`)
  }

  return (
    <Navbar className="border-b-2">
      <Navbar.Brand as={'div'}>
        <Link to="/" className="text-sm sm:text-xl font-semibold self-center whitespace-nowrap dark:text-white">
          <span>Blog</span>
          <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg text-white">Verse</span>
        </Link>
      </Navbar.Brand>
      <form onSubmit={handleSubmit}>
        <TextInput 
          type="text" 
          placeholder="Search" 
          className="hidden lg:inline"
          rightIcon={AiOutlineSearch}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden focus:ring-0" color='gray' pill as={Link} to={'/search'}>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-13 h-10 focus:ring-0" color='gray' pill onClick={changeTheme}>
          {theme === 'light' ? <FaMoon size='15'/> : <FaSun size='15'/>}
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
            {user.isAdmin && (
              <>
                <Link to={'/dashboard?tab=dash'}>
                  <Dropdown.Item>
                    Dashboard
                  </Dropdown.Item>
                </Link>
                <Dropdown.Divider />
              </>
            )}
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>
                Profile
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>
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