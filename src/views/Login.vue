<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
// 消息提示框
import { ElMessage } from "element-plus";
// 控制註冊和登入表單的顯示, 預設顯示的是註冊
// true 註冊表單, false 登入表單
const isRegister = ref(false);
// 宣告數據模型 - bind data
const registerData = ref({
  username: "",
  password: "",
  rePassword: "",
});

// 校驗密碼的函式
const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("請再次確認密碼"));
    // 因為 registerData是個響應式的物件 所以需要加個.value 才能取得裡面的password
  } else if (value !== registerData.value.password) {
    callback(new Error("請確保兩次輸入的密碼一致"));
  } else {
    callback();
  }
};

// 宣告表單的校驗規則
const rules = {
  username: [
    { required: true, message: "請輸入用戶名", trigger: "blur" },
    { min: 5, max: 16, message: "長度為5~16位非空字串", trigger: "blur" },
  ],
  password: [
    { required: true, message: "請輸入密碼", trigger: "blur" },
    { min: 5, max: 16, message: "長度為5~16位非空字串", trigger: "blur" },
  ],
  rePassword: [{ validator: checkRePassword, trigger: "blur" }],
};

// 呼叫後台介面,完成註冊
import { userRegisterService, userLoginService } from "@/api/user.js";
const register = async () => {
  // registerData 是一個響應式的物件,如果要獲取值,需要 .value
  // await 是異步的 所以要在上面加上 async
  let result = await userRegisterService(registerData.value);
  /*if (result.code === 0) {
    // success
    alert(result.msg ? result.msg : "註冊成功");
  } else {
    // false
    alert("註冊失敗");
  }*/
  //   alert(result.msg ? result.msg : "註冊成功");
  ElMessage.success(result.msg ? result.msg : "註冊成功");
};

// 登入功能 bind data, 複用註冊表單的資料模型
// 表單資料校驗 -> 可以複用註冊的
// 登入函式
// 導入 router 並使用
import { useRouter } from "vue-router";
// 導入 token
import { useTokenStore } from "@/stores/token.js";
const router = useRouter();
const tokenStore = useTokenStore();
const login = async () => {
  // 呼叫介面,完成登入
  let result = await userLoginService(registerData.value);
  /*if (result.code === 0) {
    // success
    alert(result.msg ? result.msg : "登入成功");
  } else {
    // false
    alert("登入失敗");
  }*/
  //   alert(result.msg ? result.msg : "登入成功");
  ElMessage.success(result.msg ? result.msg : "登入成功");
  // 把得到的token存儲到pinia中
  tokenStore.setToken(result.data);
  // 跳轉到首頁, 借住路由來完成跳轉
  router.push("/");
};

// 宣告函式,清空資料模型的data
const clearRegisterData = () => {
  registerData.value = {
    username: "",
    password: "",
    rePassword: "",
  };
};
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 註冊表單 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>註冊</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="請輸入用戶名"
            v-model="registerData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="請輸入密碼"
            v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="請再次輸入密碼"
            v-model="registerData.rePassword"
          ></el-input>
        </el-form-item>
        <!-- 註冊按鈕 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="register"
          >
            註冊
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="info"
            :underline="false"
            @click="(isRegister = false), clearRegisterData()"
          >
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登入表單 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-else
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>登入</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="請輸入用戶名"
            v-model="registerData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="請輸入密碼"
            v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>記住我</el-checkbox>
            <el-link type="primary" :underline="false">忘記密碼？</el-link>
          </div>
        </el-form-item>
        <!-- 登入按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
            >登入</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="info"
            :underline="false"
            @click="(isRegister = true), clearRegisterData()"
          >
            註冊 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url("@/assets/logo2.png") no-repeat 60% center / 240px auto,
      url("@/assets/login_bg.jpg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
