<template>
  <div class="image-upload-container">
    <a-upload
      v-model:file-list="fileList"
      :name="name"
      list-type="picture-card"
      :multiple="isMultiple"
      class="custom-image-uploader"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      accept="image/*"
      :headers="getHeaders()"
      :data="{ biz: 'temp' }"
      @change="handleUploadChange"
      @preview="handleImagePreview"
      :max-count="maxCount"
      :disabled="disabled"
    >
      <div v-if="!maxCount || fileList.length < maxCount">
        <PlusOutlined />
        <div style="margin-top: 8px">上传</div>
      </div>
    </a-upload>
    <div v-if="uploadHint" class="upload-hint">{{ uploadHint }}</div>

    <!-- Image Preview Modal -->
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handlePreviewCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch, reactive, computed } from 'vue';
import { Upload as AUpload, Modal as AModal, message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/authStore';
import { getFileAccessHttpUrl, getRandom } from "@/utils/index";

const props = defineProps({
  value: { // Can be a single string or an array of strings/objects
    type: [String, Array],
    default: () => [],
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  uploadHint: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'file',
  },
});

const emit = defineEmits(['update:value']);

const auth = useAuthStore();
const uploadUrl = `${import.meta.env.VITE_GLOB_UPLOAD_URL}/sys/common/upload` || '/api';

const fileList = ref([]);
const isMultiple = computed(() => props.maxCount > 1);

// --- Internal State for Preview ---
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

// --- Header for Upload ---
const getHeaders = () => reactive({
  'X-Access-Token': auth.token,
  'X-Tenant-Id': auth.userInfo.id || '0',
});

// --- Utility to transform URL to AntD file object ---
const urlToFileObject = (url, index = 0) => ({
  uid: `-${index + 1}`,
  name: 'image.png',
  status: 'done',
  url: getFileAccessHttpUrl(url),
  response: { status: 'history', message: url }, // Store original url
});

// --- Watch to sync prop `value` to internal `fileList` ---
watch(() => props.value, (newValue) => {
  if (!newValue || newValue.length === 0) {
    fileList.value = [];
    return;
  }

  let newFileList = [];
  if (Array.isArray(newValue)) {
    // Likely already a file list from AntD, just use it
    if (newValue.every(item => typeof item === 'object' && item.uid)) {
        newFileList = [...newValue];
    } else { // An array of strings
        newFileList = newValue.map((url, index) => urlToFileObject(url, index));
    }
  } else if (typeof newValue === 'string') {
    // A single URL string or a comma-separated string
    const urls = newValue.split(',').filter(url => url);
    newFileList = urls.map((url, index) => urlToFileObject(url, index));
  }
  
  // Avoid unnecessary updates if the lists are the same
  if (JSON.stringify(fileList.value) !== JSON.stringify(newFileList)) {
      fileList.value = newFileList;
  }
}, { immediate: true, deep: true });


// --- Upload Logic ---
const beforeUpload = (file) => {
  if (file.type.indexOf('image') < 0) {
    message.error('请上传图片文件!');
    return false;
  }
  return true;
};

const handleUploadChange = (info) => {
  // Sync fileList back to parent
  emit('update:value', info.fileList);

  if (info.file.status === 'done') {
    if (info.file.response.success === false) {
      message.error(info.file.response.message);
      // Remove failed file
      const index = fileList.value.findIndex(item => item.uid === info.file.uid);
      if (index !== -1) fileList.value.splice(index, 1);
    } else {
      message.success(`${info.file.name} 上传成功`);
      // Update file object with server response
      const index = fileList.value.findIndex(item => item.uid === info.file.uid);
      if (index !== -1) {
          fileList.value[index].response = info.file.response;
          fileList.value[index].url = getFileAccessHttpUrl(info.file.response.message);
      }
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败.`);
  }
};

// --- Preview Logic ---
const getBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

const handleImagePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handlePreviewCancel = () => {
  previewVisible.value = false;
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.image-upload-container {
  .custom-image-uploader {
    :deep(.ant-upload-select-picture-card),
    :deep(.ant-upload-list-picture-card .ant-upload-list-item-container) {
      width: 120px !important;
      height: 120px !important;
      margin: 0 8px 8px 0 !important;
    }

    :deep(.ant-upload-select-picture-card) {
      background-color: #FAFAFA;
      border: 1px dashed #D9D9D9;
      &:hover {
        border-color: @primary-color;
      }
    }
  }

  .upload-hint {
    font-size: 14px;
    color: @text-color-tertiary;
    margin-top: @spacing-xs;
    line-height: 1.5;
  }
}
</style>
