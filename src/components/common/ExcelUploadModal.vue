<template>
  <a-modal
    :visible="visible"
    :title="title"
    @cancel="handleCancel"
    :footer="null"
  >
    <div class="upload-modal-content">
      <div class="template-download" v-if="templateUrl">
        <a :href="templateUrl" download>下载模板文件</a>
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
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
        <p class="ant-upload-hint">
          支持单个文件上传，仅限 Excel 格式 (xls, xlsx)。
        </p>
      </a-upload-dragger>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Modal as AModal, Upload as AUpload, message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/authStore';

const AUploadDragger = AUpload.Dragger;

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '上传文件',
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
  padding: 24px 0;
}
.template-download {
  margin-bottom: 16px;
  text-align: right;
  a {
    color: @primary-color;
  }
}
</style>
