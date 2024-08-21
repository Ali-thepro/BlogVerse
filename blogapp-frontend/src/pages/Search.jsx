import { Button, Select, TextInput, Spinner } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import { fetchCategories } from '../redux/reducers/categoryReducer';
import { getPosts } from '../redux/reducers/postsReducer';
import { getUsers } from '../redux/reducers/usersReducer'



const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchData, setSearchData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: '',
    user: '',
    sortField: 'updatedAt',
  });
  const { posts, loading } = useSelector((state) => state.posts);
  const users = useSelector((state) => state.users.users);
  const categories = useSelector((state) => state.category.categories);
  const [showMore, setShowMore] = useState(false);


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get('searchTerm');
    const sort = urlParams.get('sort');
    const category = urlParams.get('category');
    const user = urlParams.get('userId');
    const sortField = urlParams.get('sortField');
    if (searchTerm || sort || category || user || sortField) {
      setSearchData({
        searchTerm: searchTerm || '',
        sort: sort || 'desc',
        category: category || '',
        userId: user || '',
        sortField: sortField || 'updatedAt',
      });
    }
    const fetchPosts = async () => {
      const fetchedPosts = await dispatch(getPosts(location.search));
      if (fetchedPosts.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
    }

    fetchPosts();
    dispatch(getUsers());
    dispatch(fetchCategories());

  }, [location.search]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let finalValue;
    if (name === 'sort') {
      finalValue = value === 'asc' ? 'asc' : 'desc';
    }
    setSearchData({
      ...searchData,
      [name]: finalValue || value,
    });

    event.preventDefault();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        urlParams.set(key, searchData[key]);
      }
    }
    const query = urlParams.toString();
    navigate(`/search?${query}`);
  }

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const query = urlParams.toString();
    const fetchedPosts = await dispatch(getPosts(`?${query}`, true));
    if (fetchedPosts.length < 9) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term</label>
            <TextInput
              type="text"
              placeholder="Search"
              name='searchTerm'
              value={searchData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={searchData.sort} name='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className='font-semibold'>Category:</label>
            <Select onChange={handleChange} value={searchData.category} name='category'>
              <option value=''>All</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value='Uncategorised'>Uncategorised</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className='font-semibold'>User:</label>
            <Select onChange={handleChange} value={searchData.userId} name='userId'>
              <option value=''>All</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className='font-semibold'>Sort Field:</label>
            <Select onChange={handleChange} value={searchData.sortField} name='sortField'>
              <option value='updatedAt'>Updated Date</option>
              <option value='createdAt'>Created Date</option>
              <option value='likes'>Likes</option>
            </Select>
          </div>
          <Button
            type='submit'
            outline
            className='focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white'
          >
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post.id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search;