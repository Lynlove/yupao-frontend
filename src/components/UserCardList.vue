<script setup lang="ts">
  import {UserType} from "../models/user";
  import {onMounted, onUpdated} from "vue";

  interface UserCardListProps{
    loading: boolean;
    userList: UserType[];
  }

  const props = withDefaults(defineProps<UserCardListProps>(), {
    loading: true,
    // @ts-ignore
    userList: [] as UserType[],
  })

  onUpdated(() => {
    console.log('userCardList',props.userList);
  })
</script>

<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList">
  </van-skeleton>
  <van-card
      v-for="user in userList"
      :desc="user.profile"
      :title="`${user.username} (${user.planetCode})`"
      :thumb="user.avatarUrl">
    <template #tags>
      <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="mini">联系我</van-button>
    </template>
  </van-card>

</template>

<style scoped>

</style>