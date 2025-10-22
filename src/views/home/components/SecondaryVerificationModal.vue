<template>
  <a-modal
    :open="open"
    title="二次核验"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    :footer="null"
    centered
    width="420px"
  >
    <div class="modal-content">
      <a-form :model="formState" @finish="handleFinish">
        <a-form-item name="email" :rules="[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]">
          <a-input v-model:value="formState.email" placeholder="请输入邮箱" size="large">
            <template #addonAfter>
              <a-button @click="handleSendCode" :disabled="isCountingDown" style="width: 112px; padding: 0;">
                {{ isCountingDown ? `${countdown}s` : '获取验证码' }}
              </a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
          <a-input v-model:value="formState.code" placeholder="请输入验证码" size="large" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="confirmLoading" block size="large">
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Modal as AModal, Form as AForm, FormItem as AFormItem, Input as AInput, Button as AButton, message } from 'ant-design-vue';
import { useAuthStore } from '@/store/authStore';
import defHttp from '@/utils/http/axios';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open']);

const formState = reactive({
  email: '',
  code: '',
});

const confirmLoading = ref(false);
const countdown = ref(60);
const isCountingDown = ref(false);
const authStore = useAuthStore();
let timer = null;

const handleSendCode = async () => {
  if (!formState.email) {
    message.error('请输入邮箱地址!');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formState.email)) {
    message.error('请输入有效的邮箱地址!');
    return;
  }

  isCountingDown.value = true;
  try {
    const res = await defHttp.post({ url: '/apm/sys/emailCaptcha', data: { email: formState.email, captchaMode: 1 } });
    if (res.success) {
      message.success('验证码已发送');
      timer = setInterval(() => {
        if (countdown.value > 1) {
          countdown.value--;
        } else {
          clearInterval(timer);
          isCountingDown.value = false;
          countdown.value = 60;
        }
      }, 1000);
    } else {
      message.error(res.message);
      isCountingDown.value = false;
    }
  } catch (error) {
    message.error('验证码发送失败，请重试。');
    isCountingDown.value = false;
  }
};

const handleFinish = async (values) => {
  confirmLoading.value = true;
  try {
    // Placeholder API call
    console.log('Submitting verification:', values);
    // const res = await defHttp.post({ url: '/api/verify-secondary', data: values });
    
    message.success('核验成功');
    authStore.setSecondaryVerificationStatus(true);
    emit('update:open', false);

  } catch (error) {
    message.error('核验失败');
  } finally {
    confirmLoading.value = false;
  }
};

const handleOk = () => {
  // This is triggered by the form's submit button now
};

const handleCancel = () => {
  emit('update:open', false);
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 24px;
}
</style>

