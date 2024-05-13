<template>
  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索的标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>


  <van-divider content-position="left">已选标签</van-divider>
  <van-row gutter="16">
    <van-col v-for="tag in activeIds">
      <van-tag closeable size="medium" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>

  <van-divider content-position="right">选择标签</van-divider>

  <div v-if="activeIds.length == 0">请选择标签</div>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />

  <div style="padding: 16px">
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const searchText = ref('');

// 已选中的标签
const activeIds = ref([])
// 左侧选中项的索引
const activeIndex = ref(0)
// 标签列表
const originTagList = [
  {
    text: '性别',
    children: [
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ]
  },
  {
    text: '年级',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大3', id: '大3'},
      {text: '大4', id: '大4'},
      {text: '大5', id: '大5'},
      {text: '大6', id: '大6'},
      {text: '大7', id: '大7'},
    ]
  },
]
const tagList = ref(originTagList)

// 删除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag
  })
}
// 搜索
const onSearch = () => {
  tagList.value = originTagList.map(parentTag => {
    const tempChildrenTag = [...parentTag.children];
    const tempParentTag = {...parentTag};
    tempParentTag.children = tempChildrenTag.filter(item => item.text.includes(searchText.value))
    console.log(searchText, tempParentTag)
    return tempParentTag;
  })

}
// 取消搜索
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
}

/**
 * 执行搜索
 */
const doSearchResult = () => {

  router.push({
    path: '/user/list',
    query: {
      tags: activeIds.value
    }
  })
}
</script>

<style scoped>

</style>