<template>
  <a-modal
    :visible="visible"
    :title="title"
    @cancel="handleCancel"
    :footer="null"
    width="600px"
    :bodyStyle="{ padding: '24px 40px' }"
  >
    <div class="upload-modal-content">
      <div class="upload-header">
        <span class="upload-title">EXCEL批量上传</span>
        <a-button type="primary" :href="templateUrl" download v-if="templateUrl">下载模板</a-button>
      </div>

      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="false"
        :action="action"
        :headers="uploadHeaders"
        :before-upload="beforeUpload"
        @change="handleChange"
        :accept="accept"
        class="upload-dragger"
      >
        <p class="ant-upload-drag-icon">
          <cloud-upload-outlined />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
      </a-upload-dragger>

      <div class="upload-tips">
        <p class="tips-title">温馨提示：</p>
        <p>1. 上传文件仅支持.xls或.xlsx格式</p>
        <p>2. 单次上传数据量建议不超过5000条</p>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Modal as AModal, Upload as AUpload, message, Button as AButton } from 'ant-design-vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/authStore';

const AUploadDragger = AUpload.Dragger;

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '上传数据',
  },
  action: {
    type: String,
    required: true,
  },
  templateUrl: {
    type: String,
    default: '',
  },
  accept: {
    type: String,
    default: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
});

const emit = defineEmits(['update:visible', 'success']);

const authStore = useAuthStore();
const fileList = ref([]);

const uploadHeaders = computed(() => ({
  'X-Access-Token': authStore.token,
}));

const handleCancel = () => {
  emit('update:visible', false);
  fileList.value = [];
};

const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
  if (!isExcel) {
    message.error('只能上传 Excel 文件!');
  }
  const isLt10M = file.size / 1024 / 1024 < 10; // Limit to 10MB
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB!');
  }
  // 5000条数据限制的提示在UI上，这里只做文件类型和大小的硬性检查
  return isExcel && isLt10M;
};

const handleChange = (info) => {
  const { status } = info.file;
  if (status === 'done') {
    const response = info.file.response;
    if (response && (response.code === 200 || response.success === true)) {
        message.success(response.message || `${info.file.name} 文件上传成功。`);
        emit('success');
        handleCancel();
    } else {
        message.error(response.message || `${info.file.name} 文件上传失败。`);
    }
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败。`);
  }
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.upload-modal-content {
  .upload-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .upload-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }

  .upload-dragger {
    background-color: #FAFAFA;
    border: 1px dashed #D9D9D9;
    border-radius: 4px;
    padding: 40px 0;
    
    .ant-upload-drag-icon {
      font-size: 48px;
      color: @primary-color;
      margin-bottom: 20px;
    }

    .ant-upload-text {
      font-size: 16px;
      color: #666;
    }
  }

  .upload-tips {
    margin-top: 24px;
    font-size: 14px;
    color: #999;
    line-height: 1.8;

    .tips-title {
      color: #666;
      font-weight: 500;
    }
  }
}
</style>