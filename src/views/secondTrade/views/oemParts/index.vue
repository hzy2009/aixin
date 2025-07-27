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

const handleFinish = async (p) => {
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
    // const res = await defHttp.post({
    //     url: `/apm/apmDeviceOrigin/newTodo`,
    //     params: p,
    //     data: ids.value
    // });
    // if (res.success) {
    //     phoneAndEmailModal.value.handleClose()
    //     const defaultConfig = {
    //     title: '一键敲门成功',
    //     message: '一键敲门后，客服人员将在30分钟内与您联系',
    //     contactInfo: { name: '陈靖玮', phone: '4000118892', email: 'info-service@icshare.com' },
    //     buttonText: '返回首页',
    //     showButton: false,
    //     onAction: null, // Default onAction is handled in store to go home
    //     };
    //     modalStore.showSuccessPrompt({ ...defaultConfig });
    // }
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
        localTableData: [
        {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
         {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
        {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
         {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
        {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
         {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
        {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
         {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
        {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
         {
            partNumber: 'KC-312156',
            productName: 'MS-400',
            productCategory: '产品类别',
            productModel: '产品型号',
            specification: '5x10-9m',
            compatibleModels: 'MS-400',
            originalManufacturer: '*******有限公司',
            productionDate: '2025-08-29',
            productStatus: '正常状态',
            quantity: '35080',
            postedBy: 'B15675',
            guaranteePeriod: '1年',
            priceExcludingTax: '58000',
            tax: '12%',
            paymentTermsName: '付款条件名称',
            tradeTypeName: '交易方式名称',
            shippingTypeName: '物流方式名称',
            usageDuration: '使用时长',
            description: '描述'
        },
    ]
    // requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register'],
})

</script>