// src/modules/bookReview/useBookReview.js
import { useState } from "react";
import { booksApi } from "../api.js";

export const useBookReview = () => {
  const [reviews, setReviews] = useState([]);

  // 加载评论
  const loadReviews = async (bookId) => {
    const data = await booksApi.getReviews(bookId);
    setReviews(data.data);
  };

  // 添加评论
  const addReview = async (payload) => {
    const created = await booksApi.addReview(payload);
    setReviews((prev) => [created, ...prev]);
    return created;
  };

  return { reviews, loadReviews, addReview };
};
