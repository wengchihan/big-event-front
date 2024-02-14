<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";

// 文章分類數據模型 - 後端DB取出？
const categorys = ref([]);

// const title = ref("");

// 用戶搜索時選中的分類id
const categoryId = ref("");

// 用戶搜索時選中的發佈狀態
const state = ref("");

// 文章列表數據模型 - 後端DB取出？
const articles = ref([]);

// 分頁條數據模型
const pageNum = ref(1); // 當前頁
const total = ref(20); // 總條數
const pageSize = ref(3); // 每頁條數

// 當每頁條數發生了變化，呼叫此函式
const onSizeChange = (size) => {
  pageSize.value = size;
  articleList();
};
// 當前頁碼發生了變化，呼叫此函式
const onCurrentChange = (num) => {
  pageNum.value = num;
  articleList();
};

import {
  articleCategoryListService,
  articleListService,
  articleAddService,
  articleUpdateService,
} from "@/api/article.js";
// 回顯文章分類
const articleCategoryList = async () => {
  let result = await articleCategoryListService();
  categorys.value = result.data;
};

// 獲取文章列表的數據
const articleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null,
  };

  let result = await articleListService(params);

  // 渲染視圖
  total.value = result.data.total;
  articles.value = result.data.items;

  // 處理數據,給數據模型擴展一個屬性categoryName,分類名稱
  for (let i = 0; i < articles.value.length; i++) {
    let article = articles.value[i];
    for (let j = 0; j < categorys.value.length; j++) {
      if (article.categoryId == categorys.value[j].id) {
        article.categoryName = categorys.value[j].categoryName;
      }
    }
  }
};

articleCategoryList();
articleList();

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Plus } from "@element-plus/icons-vue";
// 控制抽屜是否顯示
const visibleDrawer = ref(false);
// 添加表單數據模型
const articleModel = ref({
  title: "",
  categoryId: "",
  coverImg: "",
  content: "",
  state: "",
});
// 添加表單校驗 -
const rules = {
  title: [{ required: true, message: "請輸入文章標題", trigger: "blur" }],
  content: [{ required: true, message: "請輸入文章內容", trigger: "blur" }],
  state: [{ required: true, message: "請輸入文章狀態", trigger: "blur" }],
};

// 導入token
import { useTokenStore } from "@/stores/token.js";
import { ElMessage } from "element-plus";
const tokenStore = useTokenStore();
// 上傳成功的回調函式
const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data;
  console.log(result.data);
};
// 添加文章
const addArticle = async (clickState) => {
  // 把發佈狀態賦值給數據模型
  articleModel.value.state = clickState;
  // 呼叫介面
  let result = await articleAddService(articleModel.value);

  ElMessage.success(result.msg ? result.msg : "添加成功");

  // 讓抽屜消失
  visibleDrawer.value = false;

  // 刷新當前列表
  articleList();
};

// 控制編輯彈窗
const dialogVisible = ref(false);

// 添加編輯的資料模型 - 在上面
// const articleModel = ref({
//   title: "",
//   categoryId: "",
//   coverImg: "",
//   content: "",
//   state: "",
// });

// 編輯回顯函式
const showDialog = (row) => {
  dialogVisible.value = true;
  // 將row中的數據賦值給articleModel
  articleModel.value.title = row.title;
  articleModel.value.content = row.content;
  articleModel.value.state = row.state;
  //修改的时候必须传递分类的id，所以扩展一个id属性
  articleModel.value.categoryId = row.id;
};
// 修改的函式
const updateArticle = async () => {
  let result = await articleUpdateService(articleModel.value);
  ElMessage.success(result.message ? result.message : "修改成功");
  // 刷新
  articleList();
  // 隱藏dialog
  dialogVisible.value = false;

  articleList();
};

// 清空模型的data
const clearData = () => {
  articleModel.value.title = "";
  articleModel.value.content = "";
  articleModel.value.state = "";
};

// 編輯管理
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button
            type="primary"
            @click="
              visibleDrawer = true;
              clearData();
            "
            >添加文章</el-button
          >
        </div>
      </div>
    </template>
    <!-- 搜索表單 -->
    <el-form inline>
      <el-form-item label="文章分類：">
        <el-select
          style="width: 200px"
          placeholder="請選擇"
          v-model="categoryId"
        >
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="發佈狀態：">
        <el-select style="width: 200px" placeholder="請選擇" v-model="state">
          <el-option label="已發佈" value="已發佈"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="articleList">搜索</el-button>
        <el-button
          @click="
            categoryId = '';
            state = '';
            articleList();
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column
        label="文章標題"
        width="400"
        prop="title"
      ></el-table-column>
      <el-table-column label="分類" prop="categoryName"></el-table-column>
      <el-table-column label="發表時間" prop="createTime"> </el-table-column>
      <el-table-column label="狀態" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog(row)"
          ></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="沒有數據" />
      </template>
    </el-table>
    <!-- 分頁條 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屜 -->
    <el-drawer
      v-model="visibleDrawer"
      title="添加文章"
      direction="rtl"
      size="50%"
    >
      <!-- 添加文章表單 -->
      <el-form :model="articleModel" label-width="100px">
        <el-form-item label="文章標題">
          <el-input
            v-model="articleModel.title"
            placeholder="請輸入標題"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章分類">
          <el-select placeholder="請選擇" v-model="articleModel.categoryId">
            <el-option
              v-for="c in categorys"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章封面">
          <!-- 
                auto-upload:設置是否自動上傳
                action:設置伺服器介面的路徑
                name:上傳的文件字段名
                headers:設置上傳的請求頭
                on-success:設置上傳成功的回調函式
             -->
          <el-upload
            class="avatar-uploader"
            :auto-upload="true"
            :show-file-list="false"
            action="/api/upload"
            name="file"
            :headers="{ Authorization: tokenStore.token }"
            :on-success="uploadSuccess"
          >
            <img
              v-if="articleModel.coverImg"
              :src="articleModel.coverImg"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章內容">
          <div class="editor">
            <quill-editor
              theme="snow"
              v-model:content="articleModel.content"
              contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticle('已發佈')"
            >發佈</el-button
          >
          <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 添加編輯彈窗 -->
    <el-dialog v-model="dialogVisible" title="編輯管理" width="30%">
      <el-form
        :model="articleModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="文章標題" prop="title">
          <el-input
            v-model="articleModel.title"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章內容" prop="content">
          <el-input
            v-model="articleModel.content"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item label="已發佈 || 草稿" prop="state">
          <el-input
            v-model="articleModel.state"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateArticle()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
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

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
