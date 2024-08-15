import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [
    "technology",
    "science",
    "health",
    "nature",
    "sports",
    "food",
    "travel",
    "lifestyle",
    "fashion"
  ],
  categoryInput: "",
  filteredCategories: [],
  dropdownVisible: false
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryInput: (state, action) => {
      state.categoryInput = action.payload;
    },
    setFilteredCategories: (state, action) => {
      state.filteredCategories = action.payload;
    },
    setDropdownVisible: (state, action) => {
      state.dropdownVisible = action.payload;
    },
  }
});

export const { setCategoryInput, setFilteredCategories, setDropdownVisible } = categorySlice.actions;
export default categorySlice.reducer;