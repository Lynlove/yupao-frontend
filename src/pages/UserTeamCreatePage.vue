<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <van-button type="primary" @click="toAddTeam">创建队伍</van-button>
    <team-card-list :team-list="teamList"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {Toast} from "vant";

const router = useRouter();
const searchText = ref([]);
//跳转到添加队伍页面
const toAddTeam = () => {
  router.push({
    path: '/team/add',
  })
}
const teamList = ref([]);
/**
 * 搜索队伍
 * @param val
 * @returns {Promise<void>}
 */
const listTeam = async (val = ' ') => {
  const res = await myAxios.get("/team/list/my/create", {
    params: {
      searchText: val,
      pageNum: 1
    }
  });
  if (res.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail("获取队伍列表失败，请刷新重试");
  }
}
//只会在页面加载时触发一次
onMounted(() => {
  listTeam();
})
const onSearch = (val) => {
  listTeam(val);
}
</script>
<style scoped>
#teamPage {
}
</style>