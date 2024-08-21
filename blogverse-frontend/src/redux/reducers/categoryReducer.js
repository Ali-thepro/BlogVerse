import { createSlice } from '@reduxjs/toolkit'
import { getCategories } from '../../services/post'
import { setNotification } from './notificationReducer'

const initialState = {
  categories: [],
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
    setCategories: (state, action) => {
      state.categories = action.payload;
    }
  }
});

export const fetchCategories = () => {
  return async (dispatch) => {
    try {
      const categories = await getCategories();
      dispatch(setCategories(categories));
    } catch (error) { 
      const errorMessage = error?.response?.data?.error || error.message;
      dispatch(setNotification(errorMessage, 'failure'));

    }
  }
}

export const { setCategoryInput, setFilteredCategories, setDropdownVisible, setCategories } = categorySlice.actions;
export default categorySlice.reducer;