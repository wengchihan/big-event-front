// 導入axios  npm install axios
import { useTokenStore } from "@/stores/token";
import axios from "axios";
// 消息提示框
import { ElMessage } from "element-plus";
// 導入router
import router from "@/router";
// baseURL
// const baseURL = "http://localhost:8080";
const baseURL = "/api"; // http://localhost:5173/api
const instance = axios.create({ baseURL });

// 添加請求攔截器
instance.interceptors.request.use(
  (config) => {
    // 請求前的回調
    // 添加token
    const tokenStore = useTokenStore();
    // 判斷有沒有token
    if (tokenStore.token) {
      config.headers.Authorization = tokenStore.token;
    }
    return config;
  },
  (err) => {
    // 請求錯誤的回調
    Promise.reject(err);
  }
);

// 添加響應攔截器
instance.interceptors.response.use(
  (result) => {
    // 判斷業務狀態碼
    if (result.data.code === 0) {
      // success
      return result.data;
    }
    // 操作失敗
    // alert(result.data.msg ? result.msg : "伺服器發生錯誤");
    ElMessage.error(result.data.msg ? result.msg : "伺服器發生錯誤");
    // 異步操作的狀態轉換為失敗
    return Promise.reject(result.data);
  },
  (err) => {
    // 判斷響應狀態碼, 如果為401,則未登入,提示請登入,並跳轉到登入頁面
    if (err.response.status === 401) {
      ElMessage.error("請先登入");
      router.push("/login");
    } else {
      ElMessage.error("伺服器列外");
    }
    return Promise.reject(err); //异步的状态转化成失败的状态
  }
);

export default instance;
