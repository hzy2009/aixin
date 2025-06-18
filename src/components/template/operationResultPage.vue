<template>
  <div class="operation-result-page-container">
    <div class="result-content-wrapper">
      <div class="result-icon-wrapper">
        <CheckCircleFilled class="result-icon" />
      </div>
      <h2 class="result-title">{{ title }}</h2>
      <p v-if="subtitle" class="result-subtitle">{{ subtitle }}</p>
      <p v-if="contactInfo" class="result-subtitle">{{ contactInfo }}</p>
      <p v-if="emilt" class="result-subtitle">{{ emilt }}</p>
      <!-- <p v-if="contactInfo" class="result-contact-info">{{ contactInfo }}</p> -->

      <div class="result-actions">
        <a-button
          v-if="primaryActionText"
          type="primary"
          danger
          class="action-button primary-action"
          @click="handlePrimaryAction"
        >
          {{ primaryActionText }}
        </a-button>
        <a-button
          v-if="secondaryActionText"
          type="default"
          class="action-button secondary-action"
          @click="handleSecondaryAction"
        >
          {{ secondaryActionText }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button as AButton } from 'ant-design-vue';
import { CheckCircleFilled } from '@ant-design/icons-vue';

const props = defineProps({
  // status: { // 'success', 'error', 'warning', 'info' - for future icon changes
  //   type: String,
  //   default: 'success',
  // },
  // title: {
  //   type: String,
  //   required: true,
  //   default: '操作成功',
  // },
  // subtitle: {
  //   type: String,
  //   default: '',
  // },
  // contactInfo: {
  //   type: String,
  //   default: '',
  // },
  // primaryActionText: {
  //   type: String,
  //   default: '', // e.g., "查看详情"
  // },
  // primaryActionPayload: { // Data to pass with primary action
  //   type: [String, Number, Object, Array, Boolean],
  //   default: null,
  // },
  // secondaryActionText: {
  //   type: String,
  //   default: '', // e.g., "返回列表"
  // },
  // secondaryActionPayload: { // Data to pass with secondary action
  //   type: [String, Number, Object, Array, Boolean],
  //   default: null,
  // },
  pageData: {
    type: Object,
    default: () => ({}),
  },
});
const {
  status,
  title = '一键敲门成功',
  subtitle = '客服人员将在30分钟内与您联系',
    // E-MAIL: chenjingwei@icshare.com
  contactInfo = '联系人：陈靖玮 座机：021-55698507',
  emilt = 'E-MAIL: chenjingwei@icshare.com',
  primaryActionText = '查看详情',
  primaryActionPayload,
  secondaryActionText = '返回列表',
  secondaryActionPayload,
} = props.pageData;

const emit = defineEmits(['primaryAction', 'secondaryAction']);

const handlePrimaryAction = () => {
  if (primaryActionText) {
    emit('primaryAction', props.primaryActionPayload);
  }
};

const handleSecondaryAction = () => {
  if (secondaryActionText) {
    emit('secondaryAction', props.secondaryActionPayload);
  }
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.operation-result-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px; // Ensure it takes some vertical space
  padding: @spacing-xxl @spacing-lg;
  background-color: @background-color-base; // White background for the content area
  // If this page is rendered within another layout (e.g., UserCenterCommonLayout),
  // the overall page background might be different.
}

.result-content-wrapper {
  text-align: center;
  max-width: 500px; // Limit width for better readability
}

.result-icon-wrapper {
  margin-bottom: 32px; // 24px space below icon
  .result-icon {
    font-size: 112px; // Large icon size
    color: @primary-color; // Red color for success checkmark
  }
  // TODO: Add styles for other status icons if needed
  // &.status-error .result-icon { color: @error-color; }
}

.result-title {
  margin-bottom: 10px; // 8px space to subtitle
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 24px;
  line-height: 22px;
  letter-spacing: 0%;
  color: #272A30;
}

.result-subtitle {
  color: #656C74; // Gray
  margin-bottom: 2px; // Very small space to contact info
  // line-height: 1.6;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: center;

}
.result-contact-info {
  font-size: 14px;
  color: @text-color-secondary; // Gray
  margin-bottom: @spacing-md; // 32px space to buttons
  line-height: 1.6;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: @spacing-sm; // 8px gap between buttons
  margin-top: 10px;
  .action-button {
    min-width: 100px; // Standard width for these buttons
    height: 36px; // Standard height
    font-size: 14px;
    border-radius: @border-radius-sm; // Consistent rounding
  }

  .primary-action { // "查看详情"
    background-color: @primary-color;
    border-color: @primary-color;
    &:hover {
      background-color: darken(@primary-color, 8%);
      border-color: darken(@primary-color, 8%);
    }
  }

  .secondary-action { // "返回列表"
    border-color: #9AA0A3; // Standard AntD default button border
    color: #C3CBCF; // Black/dark gray text
    &:hover {
      color: @primary-color;
      border-color: @primary-color;
    }
  }
}
</style>