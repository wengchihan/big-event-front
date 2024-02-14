import request from "@/utils/request.js";
import { useTokenStore } from "@/stores/token.js";

// 文章分類列表查詢
export const articleCategoryListService = () => {
  const tokenStore = useTokenStore();
  // 在pinia中定義的響應式數據,都不需要.value
  // return request.get("/category", {
  //   headers: { Authorization: tokenStore.token },
  // });   ==> 這裡的 token 交給了 request.js的 攔截器 集中管理
  return request.get("/category");
};

// 文章分類 - addCategory
export const articleCatgoryAddService = (categoryData) => {
  return request.post("/category", categoryData);
};

// 文章分類修改 - updateCategory
export const articleCategoryUpdateService = (categoryData) => {
  return request.put("/category", categoryData);
};

// 刪除文章分類 - deleteCategory
export const articleCategoryDeleteService = (id) => {
  return request.delete("/category?id=" + id);
};

// 文章列表查詢
export const articleListService = (params) => {
  return request.get("/article", { params: params });
};

// 文章添加
export const articleAddService = (articleData) => {
  return request.post("/article", articleData);
};

// 修改
export const articleUpdateService = (articleData) => {
  return request.put("/article", articleData);
};
