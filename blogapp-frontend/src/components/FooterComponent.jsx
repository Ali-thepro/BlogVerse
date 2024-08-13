import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';
const FooterComponent = () => {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link to="/" className="text-lg sm:text-xl font-semibold self-center whitespace-nowrap dark:text-white">
              <span>Blog</span>
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg text-white">Verse</span>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://blog.hubspot.com/marketing/what-is-a-blog'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  What is a blog
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Blog Verse
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow me' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.github.com/ali-thepro'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link href='https://discord.gg/JHKAjmCM'>Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='/'
            by="Blog Verse"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='https://www.instagram.com/ali.ahmad.170/' icon={BsInstagram}/>
            <Footer.Icon href='https://github.com/Ali-thepro' icon={BsGithub}/>
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterComponent;