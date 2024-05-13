<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user.ts";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import {useRouter} from "vue-router";


const user = ref()
const router = useRouter()


onMounted(async () => {
  // 获取用户信息
  const res = await getCurrentUser()
  if (res){
    user.value = res;
    // Toast.success('获取用户信息成功');
  } else {
    Toast.fail('获取用户信息失败')
  }
});

const logout = async () => {
  const res = await myAxios.post('/user/logout');
  if (res.code === 0){
    Toast.success('退出成功')
    window.location.href = '/user/login'
  }else{
    Toast.fail('退出登录失败' + (res.description ? `，${res.description}` : ''))
  }
}

</script>

<template>
    <template v-if="user">
      <van-cell title="当前用户" :value="user?.username" />
      <van-cell title="修改信息" is-link to="/user/update" />
      <van-cell title="我创建的队伍" is-link to="/user/team/create" />
      <van-cell title="我加入的队伍" is-link to="/user/team/join" />
      <van-cell>
        <van-button class="logout" type="primary" @click="logout">退出登录</van-button>
      </van-cell>

    </template>
</template>

<style scoped>

</style>