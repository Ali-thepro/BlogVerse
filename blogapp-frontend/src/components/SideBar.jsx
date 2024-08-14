import { Sidebar as SidebarDiv } from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Sidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);
  return (
    <SidebarDiv className='w-full md:w-56'>
      <SidebarDiv.Items>
        <SidebarDiv.ItemGroup>
          <SidebarDiv.Item 
            active={tab === 'profile'}
            icon={HiUser} label={"User"}
            labelColor='dark'
            as={Link}
            to={'/dashboard?tab=profile'}
          >
            Profile
          </SidebarDiv.Item>
          <SidebarDiv.Item icon={HiArrowSmRight} className='cursor-pointer'>
            Sign out
          </SidebarDiv.Item>
        </SidebarDiv.ItemGroup>
      </SidebarDiv.Items>
    </SidebarDiv>
  )

}

export default Sidebar;