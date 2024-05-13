<template>
  <div
      id="teamCardList"
  >
    <van-card
        v-for="team in props.teamList"
        :desc="team.description"
        thumb="https://tse3-mm.cn.bing.net/th/id/OIP-C.DbwjqVSpLq6p_ApeEdLHEAHaNK?rs=1&pid=ImgDetMain"
        :title="`${team.name} `"
    >
      <template #tags>
        <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
          {{
            teamStatusEnum[team.status]
          }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          {{ `队伍人数：  ${team.hasJoinNum} / ${team.maxNum}`}}
        </div>
        <div v-if="team.expireTime">
          {{ '过期时间' + team.expireTime }}
        </div>
        <div>
          {{ '创建时间' + team.createTime }}
        </div>
      </template>
      <template #footer>
        <!-- 加入队伍： 仅非队伍创建人、且未加入队伍的人可见-->
        <van-button v-if="team.userId !== currentUser?.id && !team.hasJoin" size="small" plain type="primary" @click="preJoinTeam(team)">加入队伍</van-button>
        <!-- 更新队伍：仅创建人可见-->
        <van-button v-if="team.userId === currentUser?.id" size="small" plain type="primary" @click="doUpdateTeam(team.id)">更新队伍</van-button>
        <!-- 退出队伍：创建人不可见，仅已加入队伍的人可见-->
        <van-button v-if="team.userId !== currentUser?.id && team.hasJoin" size="small" type="primary" plain @click="doQuitTeam(team.id)">退出队伍</van-button>
        <!-- 解散队伍：仅创建人可见-->
        <van-button v-if="team.userId === currentUser?.id" size="small" type="primary" plain @click="doDeleteTeam(team.id)">解散队伍</van-button>
      </template>
    </van-card>
    <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancle">
      <van-field v-model="password" placeholder="请输入密码"/>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team";
import myAxios from "../plugins/myAxios";
import {Dialog, Toast} from "vant";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user.ts";

interface TeamCardListProps {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  //@ts-ignore
  teamList: [] as TeamType[],
});

const router = useRouter();
const currentUser = ref();

const showPasswordDialog = ref(false)
const joinTeamId = ref(0)
const password = ref('')

// 不加这句话会直接弹出密码输入框
const vanDialog = Dialog.Component

onMounted(async () => {
  currentUser.value = await getCurrentUser()
})

const emit = defineEmits(['updateData'])
// 进行操作后向父组件发送更新通知
const updateData = () => {
  emit('updateData')
}


//队伍列表加入队伍
const toAddTeam = async (id: number) => {
  const res = await myAxios.post("/team/join", {
    teamId: id
  });
  if (res?.code === 0) {
    Toast.success("加入成功")
  } else {
    Toast.fail("加入失败" + (res.description ? `， ${res.description} ` : ''));
  }
}

// 跳转更新队伍页面
const doUpdateTeam = (id: number) => {
  router.push({
    path: '/team/update',
    query: {
      id,
    }
  })
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post('/team/quit', {
    teamId: id
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
    updateData();
  } else {
    Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}
/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post('/team/delete', {
    id,
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
    updateData()
  } else {
    Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

//加入队伍
const doJoinTeam = async () =>{
  if (!joinTeamId){
    return;
  }
  const res = await myAxios.post('/team/join',{
    teamId: joinTeamId.value,
    password: password.value,
  });
  if (res?.code === 0){
    Toast.success("加入队伍成功");
    doJoinCancel();
    updateData()
  }else {
    Toast.fail('加入失败' + (res.description ? `，${res.description}` : ''))
  }
}

const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
  if (team.status === 0){
    doJoinTeam();
  }else {
    showPasswordDialog.value = true;
  }
}

const doJoinCancel = () => {
  joinTeamId.value = 0;
  password.value = '';
}




</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 120px;
  object-fit: unset;
}
</style>