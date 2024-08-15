import { TextInput } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { setCategoryInput, setFilteredCategories, setDropdownVisible } from "../redux/reducers/categoryReducer";

const CategoryDropdown = () => {
  const dispatch = useDispatch();
  const { categories, categoryInput, filteredCategories, dropdownVisible } = useSelector(state => state.category);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const value = val.charAt(0).toUpperCase() + val.slice(1);
    dispatch(setCategoryInput(value));
    const filtered = categories.filter((category) =>
      category.toLowerCase().includes(value.toLowerCase())
    );
    dispatch(setFilteredCategories(filtered));
    dispatch(setDropdownVisible(filtered.length > 0));
  };

  const handleCategorySelect = (category) => {
    const categoryInput = category.charAt(0).toUpperCase() + category.slice(1);
    dispatch(setCategoryInput(categoryInput));
    dispatch(setDropdownVisible(false));
  };

  const handleBlur = () => {
    dispatch(setDropdownVisible(false));
  };

  return (
    <div className="relative">
      <TextInput
        type="text"
        placeholder="Select a category"
        value={categoryInput}
        onChange={handleCategoryChange}
        className="w-full"
        required
        onFocus={() => dispatch(setDropdownVisible(true))}
        onBlur={handleBlur}
      />
      {dropdownVisible && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          {filteredCategories.map((category) => (
            <div
              key={category}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              onMouseDown={() => handleCategorySelect(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;