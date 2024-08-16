import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./Notifcation";
import { getPosts, getPostsByUser } from "../redux/reducers/postsReducer";
import { Link } from "react-router-dom";

const Posts = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

}

export default Posts;