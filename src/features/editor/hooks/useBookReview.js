import { useState, useCallback } from "react";
import { booksApi } from "../api.js";

export const useBookReview = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 👈 新增：加载状态
  const [error, setError] = useState(null);       // 👈 新增：错误状态

  // 使用 useCallback 包装，确保函数引用稳定，避免在组件中不必要的 re-render
  // 并且保证在 useEffect 依赖中是稳定的
  const loadReviews = useCallback(async (bookId) => {
    setIsLoading(true); // 开始加载
    setError(null);     // 清除之前的错误

    try {
      // 模拟网络延迟和获取数据
      const data = await booksApi.getReviews(bookId);
      setReviews(data.data);
    } catch (e) {
      console.error("加载评论失败:", e);
      setError(e); // 捕获并设置错误
      setReviews([]); // 加载失败时清空旧数据
    } finally {
      setIsLoading(false); // 结束加载
    }
  }, []); // 依赖数组为空，因为只使用了 set 状态函数和外部的 booksApi

  // 添加评论的逻辑可以保持在组件中处理 isSaving 状态，
  // 也可以封装到 Hook 中，但通常保存状态在调用组件（Editor）中管理更灵活。
  // 在这里，我们只处理数据更新。
  const addReview = async (payload) => {
    // 假设调用组件会处理 try/catch
    const created = await booksApi.addReview(payload);
    // 成功后，更新本地状态
    setReviews((prev) => [created.data, ...prev]);
    return created;
  };

  // 暴露新的状态
  return { 
    reviews, 
    loadReviews, 
    addReview,
    isLoading, // 暴露给组件使用
    error      // 暴露给组件使用
  };
};