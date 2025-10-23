<template>
    <section class="home-breakthroughs-section section-padding">
      <div class="container">
        <div class="breakthroughs-column">
          <SectionHeader title-ch="定制开发动态" title-en="CUSTOMIZATION DEVELOPMENT  UPDATES" more-link="/rd-dynamics" @request-verification="requestVerification" />
          <!-- Use the new SpecificPagedList component -->
          <div style="position: relative;">
            <div v-if="!isVerified" class="content-mask" @click="requestVerification">
              <div class="mask-text">详情查看请点击二次核验。</div>
            </div>
            <SpecificPagedList
              :items="breakthroughItems"
              :items-per-page="7"
              :auto-cycle-interval="6000"
              :show-pagination="breakthroughItems.length > 7"
              @item-click="handleBreakthroughItemRowClick"
              @action-click="handleBreakthroughActionBtnClick"
            />
          </div>
        </div>
      </div>
    <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="填写信息获取最新进展" actionText="联系平台获取最新进展"></PhoneAndEmailModal>

    </section>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import SectionHeader from '@/components/common/SectionHeader.vue';
import SpecificPagedList from './SpecificPagedList.vue';
import defHttp from '@/utils/http/axios'
import { useModalStore } from '@/store/modalStore'; 
import { useAuthStore } from '@/store/authStore';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import { message } from 'ant-design-vue';

const emit = defineEmits(['request-verification']);

const authStore = useAuthStore();
const isVerified = computed(() => authStore.isSecondarilyVerified);

const requestVerification = () => {
  emit('request-verification');
};

const modalStore = useModalStore();
const router = useRouter();
const breakthroughItems = ref([]);
const fetchBreakthroughItems = async () => {
  const res = await defHttp.get({ url: `/apm/apmNewsForRd/list/front`, params: { page: 1, pageSize: 28 } });
  let items = [];
  if (res.success) {
    items = res.result.records
  }
  breakthroughItems.value = items;
};
const currentItem = ref(null);
const phoneAndEmailModal = ref(null);
const handleBreakthroughItemRowClick = (item) => {
  console.log('Breakthrough item ROW clicked:', item);
  // Potentially navigate to a detail page if the row itself is meant to be a link
  router.push({ path: `/rd-dynamics` });
};
const handleFinish = async (data) => {
  const res = await defHttp.get({ url: `/apm/apmTodo/apmNewsForRd/newTodo/${currentItem.value.id}`, params: data });
  if (res.success) {
    const defaultConfig = {
      title: '一键敲门成功',
      message: '一键敲门后，客服人员将在30分钟内与您联系',
      contactInfo: { name: '陈靖玮', phone: '4000118892', email: 'info-service@icshare.com' },
      buttonText: '返回首页',
      onAction: null, // Default onAction is handled in store to go home
    };
    modalStore.showSuccessPrompt({ ...defaultConfig });
    phoneAndEmailModal.value.handleClose()
  } else {
    message.error(res.message)
  }
}
const handleBreakthroughActionBtnClick = async (item) => {
  currentItem.value = item;
  phoneAndEmailModal.value.openModal()
};

onMounted(() => {
  fetchBreakthroughItems();
});
</script>
<style scoped lang="less">
.content-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.mask-text {
  font-size: 16px;
  font-weight: bold;
  color: #BC1A2C; /* Using primary color from the project */
  padding: 10px 20px;
  border: 1px solid #BC1A2C;
  border-radius: 4px;
}
</style>
