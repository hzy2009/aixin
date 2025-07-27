<template>
    <div>
        <listPage :pageData="pageData" ref="refListPage"/>
    </div>
    <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" :title="modalTitle" :actionText="actionText"></PhoneAndEmailModal>
</template>

<script setup >
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { OEMPARTS_COLUMNS } from '@/utils/const.jsx';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import { message } from 'ant-design-vue';
import { maskMiddle } from '@/utils/index';
import { useTodo } from '../hooks/useTodo.js'


const router = useRouter();
const phoneAndEmailModal = ref();
const refListPage = ref();
const ids = ref([])
const {modalTitle, actionText, handleSubmit} = useTodo()

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    ...OEMPARTS_COLUMNS
]);
const handleClick = () => {
  const records = refListPage.value.getCheckboxRecords() || []
	if (!records.length) {
		return message.error('请先勾选数据')
	}
	ids.value = records.map(item => item.id)
  phoneAndEmailModal.value.opneModal()
}

const handleFinish = (p) => {
		handleSubmit({
			url: `/apm/apmDeviceOrigin/newTodo/front`,
			params: p,
			data: {
				integers: ids.value
			}
		})
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
        list: 'apm/apmDeviceOrigin/list/front',
        // overview: 'apm/apmSourcingOriginSubstitute/overview/front'
    },
    tableColumns,
    tableOperations,
    // requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register'],
})

</script>