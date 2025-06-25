<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack">
      <template v-slot:role="{ dataSource }">
        <span>{{ dataSource.role }}</span>
        <a-button class='upgrade-button upgrade-button-vip' @click="upgradeVip" v-if="dataSource.role == '普通会员' && (!dataSource.progressList || dataSource.progressList.length == 0)">升级VIP</a-button>
        <span v-if="dataSource.role == '普通会员' && (!dataSource.progressList || dataSource.progressList.length == 0)">提交升级VIP申请后，管理员将在30分钟内与您联系</span>
      </template>
      <template v-slot:endTime="{ dataSource }">
        <span>{{ dataSource.endTime ? formatDate(dataSource.endTime) : ''}}</span>
        <a-button class='upgrade-button' @click="renewVip">会员续费</a-button>
      </template>
      <template v-slot:createTime="{ dataSource }">
        <span>{{ dataSource.createTime ? formatDate(dataSource.createTime) : ''}}</span>
      </template>
    </detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import defHttp from '@/utils/http/axios'
import { useModalStore } from '@/store/modalStore'; 
import {formatDate} from '@/utils';
import {message} from 'ant-design-vue'
import { BUSINESS_REF_LIST, TENANT_REF_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const';

const authStore = useAuthStore();
const modalStore = useModalStore();
const props = defineProps({
  IdProp: { type: String, default: null },
});
console.log('authStore.isVip', authStore.isVip)

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '会员等级', field: 'role', span: 24, fieldType: 'slot' },
  {
    label: '会员类型', field: 'type', dictKey: 'trade', span: 24, fieldType: 'select',
  },
  { label: '会员开始日期', field: 'createTime', span: 24, fieldType: 'slot'},
  { label: '会员结束日期', field: 'endTime', span: 24, fieldType: 'slot' },
  
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '在籍天数', field: 'onlineDays', span: 24, },
]


// const demandTypeDisplayName = '研发攻关';

const pageTitle = '爱芯享信息共享平台'

const localeGetDetail = () => {
  return defHttp.get({ url: '/apm/apmTodo/vipUpgrade/userInfo' }); //apm/apmTodo/vipUpgrade/userInfo
}

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    detail: '/apm/apmTodo/vipUpgrade/userInfo',
  },
  formConfigs,
  statusHistoryColumns: STATUS_HISTORY_COLUMNS,
  pageTitle,
  statusTrackingTitle: '升级VIP进度',
  isUseBack: false,
  localeGetDetail
})

const upgradeVip = async () => {
  const res = await defHttp.get({ url: `/apm/apmTodo/vipUpgrade/newTodo` });
  if (res.success) {
    const defaultConfig = {
      title: '一键敲门成功',
      message: '一键敲门后后，客服人员将在30分钟内与您联系',
      contactInfo: { name: '陈靖玮', phone: '010-55698507', email: 'chenjingwei@icshare.com' },
      buttonText: '返回首页',
      showButton: false,
      onAction: null, // Default onAction is handled in store to go home
    };
    modalStore.showSuccessPrompt({ ...defaultConfig });
  }else {
    message.error(res.message)
  }
}

const renewVip = async () => {
  const res = await defHttp.get({ url: `/apm/apmTodo/vipPay/newTodo` });
  if (res.success) {
     const defaultConfig = {
      title: '一键敲门成功',
      message: '一键敲门后后，客服人员将在30分钟内与您联系',
      contactInfo: { name: '陈靖玮', phone: '010-55698507', email: 'chenjingwei@icshare.com' },
      buttonText: '返回首页',
      onAction: null, // Default onAction is handled in store to go home
      // onClose: null,
    };
    modalStore.showSuccessPrompt({ ...defaultConfig });
  } else {
    message.error(res.message)
  }
}

</script>
<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.upgrade-button {
  margin-left: 70px;
  margin-right: 13px;
  color: #fff;
  background-color: @primary-color;
  padding: 0 20px;
  height: 30px;
  &:hover {
    color: #fff;
    border-color: @primary-color;
  }
}
.upgrade-button-vip{
  margin-left: 93px;
}
</style>
