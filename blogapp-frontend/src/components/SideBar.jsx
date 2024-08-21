import { Sidebar as SidebarDiv } from 'flowbite-react'
import { HiArrowSmRight, HiDocumentText, HiUser, HiOutlineUserGroup, HiAnnotation, HiChartPie, HiHeart } from 'react-icons/hi'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signOutUser } from '../redux/reducers/authReducer'

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);
  
  const handleSignOut = () => {
    dispatch(signOutUser())
    navigate('/')
  }
  return (
    <SidebarDiv className='w-full md:w-56'>
      <SidebarDiv.Items>
        <SidebarDiv.ItemGroup className='flex flex-col gap-1'>
          {user.isAdmin && (
              <SidebarDiv.Item
                active={tab === 'dash'}
                icon={HiChartPie}
                labelColor='dark'
                as={Link}
                to={'/dashboard?tab=dash'}
              >
                Dashboard
              </SidebarDiv.Item>
          )}
          <SidebarDiv.Item 
            active={tab === 'profile'}
            icon={HiUser} label={user.isAdmin ? 'Admin' : 'User'}
            labelColor='dark'
            as={Link}
            to={'/dashboard?tab=profile'}
          >
            Profile
          </SidebarDiv.Item>
          <SidebarDiv.Item
            active={tab === 'posts'}
            icon={HiDocumentText} 
            labelColor='dark'
            as={Link}
            to={'/dashboard?tab=posts'}
          >
            Posts
          </SidebarDiv.Item>
          {user.isAdmin && (
              <SidebarDiv.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                labelColor='dark'
                as={Link}
                to={'/dashboard?tab=users'}
              >
                Users
              </SidebarDiv.Item>
          )}
          <SidebarDiv.Item
            active={tab === 'comments'}
            icon={HiAnnotation}
            labelColor='dark'
            as={Link}
            to={'/dashboard?tab=comments'}
          >
            Comments
          </SidebarDiv.Item>
          <SidebarDiv.Item
            active={tab === 'likes'}
            icon={HiHeart} 
            labelColor='dark'
            as={Link}
            to={'/dashboard?tab=likes'}
          >
            Liked posts
          </SidebarDiv.Item>
          <SidebarDiv.Item 
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignOut}
          >
            Sign out
          </SidebarDiv.Item>
        </SidebarDiv.ItemGroup>
      </SidebarDiv.Items>
    </SidebarDiv>
  )

}

export default Sidebar;