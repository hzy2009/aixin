<template>
    <section class="home-breakthroughs-section section-padding">
      <div class="container">
        <div class="breakthroughs-column">
          <SectionHeader title-ch="定制开发动态" title-en="CUSTOMIZATION DEVELOPMENT  UPDATES" more-link="/rd-dynamics" />
          <!-- Use the new SpecificPagedList component -->
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
    <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="填写信息获取最新进展" actionText="联系平台获取最新进展"></PhoneAndEmailModal>

    </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SectionHeader from '@/components/common/SectionHeader.vue';
import SpecificPagedList from './SpecificPagedList.vue';
import defHttp from '@/utils/http/axios'
import { useModalStore } from '@/store/modalStore'; 
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import { message } from 'ant-design-vue';

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