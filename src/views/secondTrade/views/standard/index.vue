<template>
    <div>
        <listPage :pageData="pageData" ref="refListPage"/>
        <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" :title="modalTitle" :actionText="actionText"></PhoneAndEmailModal>
    </div>
</template>

<script setup >
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { STANDARD_COLUMNS } from '@/utils/const.jsx';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import { message } from 'ant-design-vue';
import { maskMiddle } from '@/utils/index';
import { useTodo } from '../hooks/useTodo.js'
import { useModalStore } from '@/store/modalStore'; 
import defHttp from '@/utils/http/axios'
const modalStore = useModalStore();


const router = useRouter();
const phoneAndEmailModal = ref();
const refListPage = ref();
const ids = ref([])
const {modalTitle, actionText, handleSubmit} = useTodo()

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    ...STANDARD_COLUMNS
]);
const handleClick = () => {
  const records = refListPage.value.getCheckboxRecords() || []
	if (!records.length) {
		return message.error('请先勾选数据')
	}
	ids.value = records.map(item => item.id)
  phoneAndEmailModal.value.openModal()
}

const handleFinish = async (p) => {
    const res = await defHttp.post({
        url: `/apm/apmDeviceStandard/newTodo`,
        params: p,
        data: ids.value
    });
    if (res.success) {
        phoneAndEmailModal.value.handleClose()
        const defaultConfig = {
        title: '一键敲门成功',
        message: '一键敲门后，客服人员将在30分钟内与您联系',
        contactInfo: { name: '陈靖玮', phone: '4000118892', email: 'info-service@icshare.com' },
        buttonText: '返回首页',
        showButton: false,
        onAction: null, // Default onAction is handled in store to go home
        };
        modalStore.showSuccessPrompt({ ...defaultConfig });
    }
}
const tableOperations = reactive([
    {
        title: '一键敲门',
        clickFn: handleClick,
        type: 'primary'
    }
])

const pageData = ref({
    url: {
        list: 'apm/apmDeviceStandard/list/front',
        // overview: 'apm/apmSourcingOriginSubstitute/overview/front'
    },
    tableColumns,
    tableOperations,
    // requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register'],
})

</script>