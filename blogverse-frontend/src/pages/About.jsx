const About = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>
            About Blog Verse
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to Blog Verse! This platform is designed for creators,
              enthusiasts, and curious minds to share their thoughts, insights, and
              ideas with a global audience. This multi-user space encourages everyone to contribute and build a 
              vibrant community.
            </p>

            <p>
              Blog Verse hosts articles, tutorials, and discussions spanning a wide 
              range of topics, from web development and programming to personal growth 
              and creative endeavors. With regular content posted by passionate users,
              you'll always discover something new and exciting.
            </p>

            <p>
              We invite you to not only read and explore but also participate! You can 
              publish your own posts, engage in conversations, and connect with others 
              through comments, and likes. Join us in fostering a supportive 
              environment where learners, creators, and thinkers come together to grow 
              and inspire one another.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;
