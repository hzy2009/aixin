<template>
	  <div>
		    <edit :pageData="pageData" @goBack="goBack" ref="editPage">
			        <template #moreForm>
				          <a-button class="action-button submit-button" @click="handleSubmitForm">确认新密码</a-button>
				        </template>
			    </edit>
		  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import edit from '@/components/template/edit.vue';
import { useAuthStore } from '@/store/authStore';
import defHttp from '@/utils/http/axios'
import { useModalStore } from '@/store/modalStore';

import { message } from 'ant-design-vue'
import { STATUS_HISTORY_COLUMNS } from '@/utils/const.jsx';
const editPage = ref()
const authStore = useAuthStore();
const modalStore = useModalStore();
const props = defineProps({
	IdProp: { type: String, default: null },
});

const router = useRouter();

const validatePass = async (_rule, value) => {
	const p = editPage.value.getAllData();
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

	if (!value) {
		return Promise.reject('请输入新密码');
	}
	if (!passwordRegex.test(value)) {
		return Promise.reject('密码必须至少8位，且包含数字、字母和符号');
	} else {
		// If the new password is valid, trigger validation for the confirm password field
		if (p.confirmpassword) {
			editPage.value.formRef.formRef.validateFields('confirmpassword');
		}
		return Promise.resolve();
	}
};

const validatePass2 = async (_rule, value) => {
	const p = editPage.value.getAllData()
	if (value == '' || value === null || value === undefined) {
		return Promise.reject('请输入密码');
	} else if (value !== p.password && p.password) {
		return Promise.reject("两次密码不一致");
	} else {
		return Promise.resolve();
	}
};

// // --- 表单配置 ---
const formConfigs = [
	{ label: '原密码', field: 'oldpassword', span: 24, fieldType: 'password', rules: [{ required: true }], tips: '密码由8位以上的英文字母、数字和符号组成，英文字母需含大小写' },
	{
		label: '新密码', field: 'password', fieldType: 'password', span: 24, rules: [{ required: true, validator: validatePass, trigger: 'change' }], tips: '密码由8位以上的英文字母、数字和符号组成，英文字母需含大小写'
	},
	{ label: '确定新密码', field: 'confirmpassword', fieldType: 'password', span: 24, rules: [{ required: true, validator: validatePass2, trigger: 'change' }] },
]

const pageTitle = '爱芯享电子信息服务平台'

const pageData = reactive({
	IdProp: props.IdProp,
	apiMap: {
		detail: 'sys/user/login/setting/getUserData',
	},
	formConfigs,
	statusHistoryColumns: STATUS_HISTORY_COLUMNS,
	pageTitle,
	statusTrackingTitle: '升级VIP进度',
	useFooterAction: false,
})

const handleSubmitForm = async () => {
	const data = await editPage.value.validate()
	data.username = authStore.userInfo.username
	const res = await defHttp.put({ url: `sys/user/updatePassword`, data })
	if (res.success) {
		message.success(res.message)
	} else {
		message.error(res.message)
	}
}


</script>
<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.action-button {
	margin-left: 137px;
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
</style>