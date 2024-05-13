<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <team-card-list :team-list="teamList"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
  </div>
</template>
<script setup>
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {Toast} from "vant";


const searchText = ref([]);

const teamList = ref([]);
/**
 * 搜索队伍
 * @param val
 * @returns {Promise<void>}
 */
const listTeam = async (val = ' ') => {
  const res = await myAxios.get("/team/list/my/join", {
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