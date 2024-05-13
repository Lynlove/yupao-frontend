<script setup lang="ts">


import {useRoute} from "vue-router";
import {onMounted, ref, watchEffect} from "vue";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios.ts"
import qs from 'qs'
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";


// 用户列表
const userList = ref([])
// 默认不开启匹配模式
const isMatchMode = ref(false);

const loading = ref(true)

// onMounted(async () => {
//
//   // 为给定 ID 的 user 创建请求
//   const userListData = await myAxios.get('/user/recommend', {
//     // withCredentials: true,
//     params: {
//       pageSize: 8,
//       pageNum: 1,
//     },
//     //序列化
//     paramsSerializer: {
//       serialize: params => qs.stringify(params, {indices: false}),
//     }
//   })
//       .then(function (response) {
//         console.log('/user/recommend succeed', response);
//         Toast.success('请求成功');
//         return response?.data?.records;
//       })
//       .catch(function (error) {
//         console.log('/user/recommend error', error);
//         Toast.fail('请求失败');
//       });
//   if (userListData) {
//     userListData.forEach(user => {
//       user.tags = JSON.parse(user.tags)
//     })
//     userList.value = userListData;
//   }
// })

/**
 * 加载数据
 */
const loadData = async () => {
  let userListData;
  loading.value = true;
  // 心动模式 根据标签匹配用户
  if (isMatchMode.value){
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    }).then(function (response){
      console.log('/user/match', response)
      // Toast.success('请求成功')
      return response?.data
    }).catch(function (error){
      console.log('/user/match', error)
      Toast.fail('请求失败')
    })
  }else {
    // 普通模式
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response) {
          console.log('/user/recommend', response);
          // Toast.success('请求成功');
          return response?.data?.records;
        })
        .catch(function (error) {
          console.log('/user/recommend', error);
          Toast.fail('请求失败');
        })
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      user.tags = JSON.parse(user.tags);
    })
    userList.value = userListData;
  }
  loading.value = false;
  // console.log('Index loadData',userListData)
}

watchEffect(() => {
  loadData();
})
</script>

<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode"></van-switch>
    </template>
  </van-cell>
  <user-card-list :user-list=userList :loading="loading"></user-card-list>
  <van-empty v-if="!userList || userList.length < 1" description="数据为空"></van-empty>
</template>

<style scoped>

</style>