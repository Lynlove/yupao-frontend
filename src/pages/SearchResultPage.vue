<script setup lang="ts">


import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios.ts"
import qs from 'qs'
import UserCardList from "../components/UserCardList.vue";

const router = useRoute()
// 搜索的标签
const {tags} = router.query
// 用户列表
const userList = ref([])

const loading = ref<boolean>(true)

onMounted(async () => {
  loading.value = true

  // 为给定 ID 的 user 创建请求
  const userListData = await myAxios.get('/user/search/tags', {
    withCredentials: false,
    params: {
      tagNameList: tags
    },
    //序列化
    paramsSerializer: {
      serialize: params => qs.stringify(params, { indices: false}),
    }
  })
  .then(function (response) {
    console.log('/user/search/tags succeed', response);
    // Toast.success('请求成功');
    return response?.data
  })
  .catch(function (error) {
    console.log('/user/search/tags error', error);
    Toast.fail('请求失败');
  });
  if (userListData){
    userListData.forEach(user => {
      user.tags = JSON.parse(user.tags)
    })
    userList.value = userListData;
  }
  loading.value = false;

})

</script>

<template>
  <user-card-list :user-list="userList" :loading="loading"></user-card-list>
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空"></van-empty>
</template>

<style scoped>

</style>