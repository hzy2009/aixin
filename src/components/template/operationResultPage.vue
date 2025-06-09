<template>
  <div class="operation-result-page-container">
    <div class="result-content-wrapper">
      <div class="result-icon-wrapper">
        <CheckCircleFilled class="result-icon" />
      </div>
      <h2 class="result-title">{{ title }}</h2>
      <p v-if="subtitle" class="result-subtitle">{{ subtitle }}</p>
      <p v-if="contactInfo" class="result-contact-info">{{ contactInfo }}</p>

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
  subtitle = '一键敲门后后，客服人员将在30分钟内与您联系',
  contactInfo = '联系电话：180 0000 0000',
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
  margin-bottom: @spacing-xl; // 24px space below icon
  .result-icon {
    font-size: 72px; // Large icon size
    color: @primary-color; // Red color for success checkmark
  }
  // TODO: Add styles for other status icons if needed
  // &.status-error .result-icon { color: @error-color; }
}

.result-title {
  font-size: 24px; // "需求创建成功"
  font-weight: 500; // Semi-bold
  color: @text-color-base; // Dark gray / black
  margin-bottom: @spacing-xs; // 8px space to subtitle
}

.result-subtitle {
  font-size: 14px;
  color: @text-color-secondary; // Gray
  margin-bottom: 2px; // Very small space to contact info
  line-height: 1.6;
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

  .action-button {
    min-width: 100px; // Standard width for these buttons
    height: 36px; // Standard height
    font-size: 14px;
    border-radius: @border-radius-sm; // Consistent rounding
  }

  .primary-action { // "查看详情"
    // type="primary" danger should handle red background
    // If not, uncomment and adjust:
    // background-color: @primary-color;
    // border-color: @primary-color;
    // color: white;
    // &:hover {
    //   background-color: darken(@primary-color, 8%);
    //   border-color: darken(@primary-color, 8%);
    // }
  }

  .secondary-action { // "返回列表"
    border-color: #D9D9D9; // Standard AntD default button border
    color: @text-color-base; // Black/dark gray text
    &:hover {
      color: @primary-color;
      border-color: @primary-color;
    }
  }
}
</style>