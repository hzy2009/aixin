<template>
	<a-modal
		class="prompt-modal-wrapper"
		v-model:open="isVisible"
		:mask-closable="true"
		:footer="null"
		centered
		:title="props.title"
		width="360px"
		@cancel="handleClose"
	>
	   	<div class="prompt-content">
				<a-form ref="formRef" :model="formModel" 
					@finish="onFinish">
					<!-- 默认输入框 -->
					<a-form-item v-if="props.showDefaultFields && !props.customFields" name="email" :rules="rulePresets.email">
							<a-input v-model:value="formModel['email']" :placeholder="`请输入邮箱`" class="iteminput" />
					</a-form-item>
					<a-form-item v-if="props.showDefaultFields && !props.customFields" name="phone" :rules="rulePresets.phone">
							<a-input v-model:value="formModel['phone']" :placeholder="`请输入电话号码`" class="iteminput"/>
					</a-form-item>
					<!-- 自定义输入框 -->
					<a-form-item 
						v-for="field in displayFields" 
						:key="field.name" 
						:name="field.name" 
						:rules="field.rules || []"
					>
						<a-input 
							v-if="field.type === 'input'"
							v-model:value="formModel[field.name]" 
							:placeholder="field.placeholder" 
							class="iteminput" 
						/>
						<a-textarea 
							v-else-if="field.type === 'textarea'"
							v-model:value="formModel[field.name]" 
							:placeholder="field.placeholder" 
							class="iteminput"
							:rows="field.rows || 3"
						/>
					</a-form-item>
				</a-form>
			</div>
			<a-button class="action-button" @click="onFinish">
				{{ props.actionText }}
			</a-button>
	</a-modal>
</template>

<script setup>
	import { Modal as AModal, Button as AButton, Form as AForm, Input as AInput, Textarea as ATextarea } from 'ant-design-vue';
	import { ref, onMounted, reactive, computed } from 'vue'
	const props = defineProps({
		title: {
			type: String,
			default: '热线电话',
		},
		actionText: {
			type: String,
			default: '提交',
		},
		// 是否显示默认的邮箱和电话输入框
		showDefaultFields: {
			type: Boolean,
			default: true,
		},
		// 自定义输入框配置
		customFields: {
			type: Array,
			default: () => null
		}
	})
	const isVisible = ref(false);
	const formModel = reactive({});
	/**
	 * 校验邮箱地址格式
	 */
	const validateEmail = async (_rule, value) => {
		if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
			return Promise.reject('请输入有效的邮箱地址！');
		} else if (!value) {
			return Promise.reject('请输入邮箱地址！');
		}
		return Promise.resolve();
	};
	const rulePresets = {
		email: [{ validator: validateEmail, trigger: 'change', required: true}],
		phone: [{  trigger: 'change', required: true, message: '请输入电话号码' }],
		// 未来可以扩展更多，如身份证号等
	};
	
	// 计算要显示的输入框
	const displayFields = computed(() => {
		if (props.customFields) {
			return props.customFields;
		}
		
		if (props.showDefaultFields) {
			return [
				{
					name: 'email',
					type: 'input',
					placeholder: '请输入邮箱',
					rules: rulePresets.email
				},
				{
					name: 'phone',
					type: 'input',
					placeholder: '请输入电话号码',
					rules: rulePresets.phone
				}
			];
		}
		
		return [];
	});
	
	const emit = defineEmits(['close', 'finish']);
	const formRef = ref(null);
	const handleClose = () => {
		isVisible.value = false;
	};
	const onFinish = async() => {
		formRef.value.validate()
    .then(() => {
			emit('finish', formModel);
    })
    .catch(error => {
      console.log('error', error);
    });
	};
	const opneModal = () => {
		isVisible.value = true;
	}
	
	defineExpose({ opneModal, handleClose });
</script>
<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.prompt-modal-wrapper{
	.prompt-content{
		padding:10px 0 0;
		position: relative;
		text-align: center;
}
.action-button{
		color: #fff;
		background-color: @primary-color;
		padding: 0 20px;
		height: 40px;
		width: 100%;
		&:hover {
			color: #fff;
			border-color: @primary-color;
		}
}
	.iteminput{
		height: 40px;
	}
	:deep(.ant-modal-content) {
		padding: 30px 34px;
	}
}
</style>
