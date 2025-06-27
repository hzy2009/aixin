<template>
  <a-modal
    :open="isVisible"
    :closable="false"
    :mask-closable="true"
    :footer="null"
    wrap-class-name="success-prompt-modal-wrapper"
    centered
    width="448px"
    @cancel="handleClose"
  >
    <div class="success-prompt-content">
      <button class="close-button-icon" @click="handleClose" aria-label="关闭">
        <CloseOutlined />
      </button>

      <div class="icon-container">
        <CheckCircleFilled class="success-icon" />
      </div>

      <h2 class="success-title">{{ title }}</h2>
      <div class="meessage-container">
        <div class="success-message">{{ message }}</div>
        <div v-if="contactInfo" class="contact-info">
            <div>联系方式：{{ contactInfo.phone }}</div>
            <div>E-MAIL：{{ contactInfo.email }}</div>
        </div>
      </div>
      <a-button class="action-button" @click="handleAction" v-if="props.showButton">
        {{ buttonText }}
      </a-button>
    </div>
  </a-modal>
</template>

<script setup>
import { Modal as AModal, Button as AButton } from 'ant-design-vue';
import { CheckCircleFilled, CloseOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '一键敲门成功',
  },
  message: {
    type: String,
    default: '“一键敲门”后后，客服人员将在30分钟内与您联系',
  },
  contactInfo: {
    type: Object, // { name: '陈靖玮', phone: '010-55698507', email: 'chenjingwei@icshare.com' }
    default: null,
  },
  buttonText: {
    type: String,
    default: '返回首页',
  },
  onAction: { // Callback function for the button
    type: Function,
    default: null,
  },
  onClose: { // Callback function for when modal is closed
    type: Function,
    default: null,
  },
  showButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'action']); // Standard close event
const router = useRouter();

const handleClose = () => {
  if (props.onClose) {
    props.onClose();
  }
  emit('close'); // Also emit a standard close event for parent v-model like usage
};

const handleAction = () => {
    console.log(props)
//   if (props.onAction) {
//     props.onAction();
//   } else {
//     router.push({ path: '/' });
//   }
//   emit('action'); // Emit an action event
  handleClose(); // Usually close modal after action
  router.push({ path: '/' });
};
</script>

<style lang="less"> // Global styles for modal wrapper
.success-prompt-modal-wrapper {
  .ant-modal {
    padding-bottom: 0;
  }
  .ant-modal-content {
    padding: 0;
    border-radius: 4px; // As per image (subtle rounding)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.45); // Standard semi-transparent dark mask
  }
}
</style>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.success-prompt-content {
  padding: 85px 40px 55px 40px;
  position: relative;
  text-align: center; // Center all content
  background-color: @background-color-base;
}

.close-button-icon {
  position: absolute;
  top: 16px; // Adjust based on visual
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px; // Icon size for X
  color: #00000073; // AntD default close icon color
  padding: 5px; // Make click area a bit larger
  line-height: 1;
  transition: color 0.3s;
  &:hover {
    color: #000000D9;
  }
}

.icon-container {
  margin-bottom: 16px;
  .success-icon {
    font-size: 112px; // Large checkmark icon
    color: @primary-color; // Red color for the icon
  }
}

.success-title {
  font-family: PingFang SC;
font-weight: 400;
font-size: 24px;
line-height: 22px;
letter-spacing: 0%;

  color: @text-color-base;
  margin-bottom: 10px;
}
.meessage-container{
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0%;
    text-align: center;
    color: #656C74;
    margin-bottom: 10px;
}

.success-message {
//   font-size: 14px;
//   color: @text-color-secondary; // Gray text
//   line-height: 1.6;
  margin-bottom: 0;
//   max-width: 320px; // Prevent message from being too wide
  margin-left: auto;
  margin-right: auto;
}

.contact-info {
//   font-size: 14px;
//   color: @text-color-secondary;
//   line-height: 1.7;
//   margin-bottom: 24px;
  p {
    margin-bottom:04px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.action-button {
  min-width: 120px;
  height: 36px;
  font-size: 14px;
  border-color: #C3CBCF; // Gray border
  color: #C3CBCF; // Dark text
  border-radius: @border-radius-sm;
    
  &:hover, &:focus {
    color: @primary-color;
    border-color: @primary-color;
    // background-color: fade(@primary-color, 5%); // Optional light bg on hover
  }
}
</style>