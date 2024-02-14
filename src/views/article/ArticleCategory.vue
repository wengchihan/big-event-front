<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
const categorys = ref([]);

import {
  articleCategoryListService,
  articleCatgoryAddService,
  articleCategoryDeleteService,
  articleCategoryUpdateService,
} from "@/api/article.js";
// 宣告一個異步的函式
// 獲取所有文章分類的資料 - DB
const articleCategoryList = async () => {
  let result = await articleCategoryListService();
  categorys.value = result.data;
};
// 呼叫 - 刷新頁面
articleCategoryList();

// 控制添加的分類彈窗
const dialogVisible = ref(false);

// 添加分類的數據模型
const categoryModel = ref({
  categoryName: "",
  categoryAlias: "",
});
// 添加分類的表單校驗
const rules = {
  categoryName: [
    { required: true, message: "請輸入分類名稱", trigger: "blur" },
  ],
  categoryAlias: [
    { required: true, message: "請輸入分類別名", trigger: "blur" },
  ],
};
// 呼叫介面,添加表單 addCategory
// 導入 addCategory.js => api article.js
import { ElMessage } from "element-plus";

const addCategory = async () => {
  // 呼叫介面
  let result = await articleCatgoryAddService(categoryModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");
  // 呼叫獲取所有文章分類的函式 -> 目的 刷新頁面
  articleCategoryList();
  dialogVisible.value = false;
};

// 定義變數,控制標題的展示
const title = ref("");

// 展示編輯彈窗
const showDialog = (row) => {
  //  dialogVisible = true; title = "編輯分類"; 這裡放在標籤上是可以運行的,
  // 但是在 函式裡需要 .value
  dialogVisible.value = true;
  title.value = "編輯分類";
  // 資料拷貝
  categoryModel.value.categoryName = row.categoryName;
  categoryModel.value.categoryAlias = row.categoryAlias;
  // 擴展id屬性,將來需要傳遞給後台,完成分類的修改
  categoryModel.value.id = row.id;
};

// 編輯分類
const updateCategory = async () => {
  // 呼叫介面
  let result = await articleCategoryUpdateService(categoryModel.value);
  ElMessage.success(result.msg ? result.msg : "修改成功");
  // 呼叫獲取所有文章分類的函式 -> 目的 刷新頁面
  articleCategoryList();
  // 隱藏彈窗
  dialogVisible.value = false;
};

// 清空模型的data
const clearData = () => {
  categoryModel.value.categoryName = "";
  categoryModel.value.categoryAlias = "";
};

// 刪除分類 - 導入 ElBox
import { ElMessageBox } from "element-plus";
const deleteCategory = (row) => {
  // 提示用戶,是否確認刪除 - 確認框
  ElMessageBox.confirm("你確認要刪除該分類訊息嗎？", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // 呼叫介面
      let result = await articleCategoryDeleteService(row.id);
      ElMessage({
        type: "success",
        message: "刪除成功",
      });
      // 刷新頁面
      articleCategoryList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消刪除",
      });
    });
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分類</span>
        <div class="extra">
          <el-button
            type="primary"
            @click="
              dialogVisible = true;
              title = '添加分類';
              clearData();
            "
            >添加分類</el-button
          >
        </div>
      </div>
    </template>
    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序號" width="100" type="index"> </el-table-column>
      <el-table-column label="分類名稱" prop="categoryName"></el-table-column>
      <el-table-column label="分類別名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- 可以把row裡面的data給categoryModel -->
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategory(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="沒有資料" />
      </template>
    </el-table>

    <!-- 添加分類彈窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form
        :model="categoryModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="分類名稱" prop="categoryName">
          <el-input
            v-model="categoryModel.categoryName"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分類別名" prop="categoryAlias">
          <el-input
            v-model="categoryModel.categoryAlias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="title == '添加分類' ? addCategory() : updateCategory()"
          >
            確認
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改分類彈窗 -->
    <!--<el-dialog v-model="dialogVisible" title="修改分類" width="30%">
      <el-form
        :model="categoryModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="分類名稱" prop="categoryName">
          <el-input
            v-model="categoryModel.categoryName"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分類別名" prop="categoryAlias">
          <el-input
            v-model="categoryModel.categoryAlias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="console.log('123')">
            確認
          </el-button>
        </span>
      </template>
    </el-dialog>-->
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
