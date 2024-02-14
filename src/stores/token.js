// 定義store
import { defineStore } from "pinia";
import { ref } from "vue";
/*
    第一個參數:名字,唯一性
    第二個參數:函式,函式的內部可以定義狀態的所有內容

    返回值:函式
*/

export const useTokenStore = defineStore(
  "token",
  () => {
    // 定義狀態的內容

    // 1. 響應式變數
    const token = ref("");

    // 2. 定義一個函式,修改token的值
    const setToken = (newToken) => {
      token.value = newToken;
    };

    // 3. 函式, 移除token的值
    const removeToken = () => {
      token.value = "";
    };

    return {
      token,
      setToken,
      removeToken,
    };
  },
  {
    persist: true, // 持久化存儲
  }
);
