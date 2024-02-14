// 導入request.js
import request from "@/utils/request.js";

// 提供呼叫註冊介面的函式
export const userRegisterService = (registerData) => {
  // 借助UrlSearchParams完成傳遞參數, 因為請求參數的格式是: x-www-form-urlencoded
  const params = new URLSearchParams();
  for (let key in registerData) {
    params.append(key, registerData[key]);
  }
  return request.post("/user/register", params);
};

// 提供呼叫登入介面的函式
export const userLoginService = (loginData) => {
  // 借助UrlSearchParams完成傳遞參數, 因為請求參數的格式是: x-www-form-urlencoded
  const params = new URLSearchParams();
  for (let key in loginData) {
    params.append(key, loginData[key]);
  }
  return request.post("/user/login", params);
};

// 獲取用戶詳細訊息
export const userInfoService = () => {
  return request.get("/user/userInfo");
};

// 修改個人資訊
export const userInfoUpdateService = (userInfoData) => {
  return request.put("/user/update", userInfoData);
};
