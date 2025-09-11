<template>
  <a-modal
    :open="isVisible"
    :closable="false"
    :footer="null"
    wrap-class-name="file-upload-modal-final"
    width="680px"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <div class="upload-modal-content-final">
      <!-- 1. Custom Header -->
      <div class="modal-header-final">
        <h2 class="modal-title-final">{{ title }}</h2>
        <button class="close-btn-final" @click="handleCancel" aria-label="关闭">
          <CloseOutlined />
        </button>
      </div>

      <!-- 2. Main Content Body -->
      <div class="modal-body-final">
        <!-- Data Upload Section -->
        <section class="upload-section-final">
          <div class="section-header-final">
            <h3 class="section-title-final">数据上传</h3>
            <a-button class="template-download-btn-final" @click="handleDownloadTemplate">
              <DownloadOutlined /> 下载模板
            </a-button>
          </div>
          <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="false"
            :showUploadList="true"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :before-upload="beforeUpload"
            @change="handleUploadChange"
            
            class="custom-dragger-final"
          >
            <div class="dragger-content-final">
              <p class="dragger-icon-wrapper-final">
                <UploadOutlined />
              </p>
              <p class="dragger-text-final">
                拖放文件到此处，或点击上传
              </p>
              <p class="dragger-hint-final">
                {{ uploadHint }}
              </p>
            </div>
          </a-upload-dragger>
        </section>

        <!-- Data Requirements Section -->
        <section class="requirements-section-final">
          <h3 class="section-title-final">数据要求</h3>
          <ul class="requirements-list-final">
            <li v-for="(req, index) in requirements" :key="index" class="requirement-item-final">
              <span class="check-icon-wrapper-final">
                <CheckOutlined />
              </span>
              <span>{{ req }}</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- 3. Custom Footer -->
      <div class="modal-footer-final">
        <div class="buttons-wrapper-final">
            <a-button class="cancel-btn-final" @click="handleCancel">取消</a-button>
            <a-button
              type="primary"
              :danger="canSubmit"
              class="submit-btn-final"
              :class="{ 'submit-btn--disabled': !canSubmit }"
              :loading="isSubmitting"
              :disabled="!canSubmit"
              @click="handleSubmit"
            >
              提交数据
            </a-button>
        </div>
        <p class="footer-note-final">{{ footerNote }}</p>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  Modal as AModal, UploadDragger as AUploadDragger, Button as AButton, message
} from 'ant-design-vue';
import {
  CloseOutlined, DownloadOutlined,
  UploadOutlined, // Changed icon
  CheckOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  title: { type: String, default: '创建国产替代寻源需求' },
  uploadUrl: { type: String, default: '/api/upload/demand-file' },
  uploadHeaders: { type: Object, default: () => ({}) },
  templateUrl: { type: String, required: true },
  uploadHint: { type: String, default: '支持.ZIP .RAR格式，最大100MB' },
  requirements: {
    type: Array,
    default: () => [
      '下载模板并按照要求填写Excel，数据',
      'Excel最大支持20M，图片不超过 50MB',
      'Excel首行为标题行，从第三行开始为数据',
      '图片名称使用对应料号'
    ]
  },
  footerNote: { type: String, default: '提交数据后，客服人员将在30分钟内审核并与您联系' },
  allowedFileTypes: { type: Array, default: () => ['application/zip', 'application/x-rar-compressed', 'application/vnd.rar', 'application/x-zip-compressed'] },
  maxFileSizeMB: { type: Number, default: 100 }
});

const emit = defineEmits(['close', 'submitSuccess']);
const fileList = ref([]);
const isSubmitting = ref(false);

// Submit is only possible when exactly one file is present and not in an error state.
// We'll consider any status other than 'error' as potentially submittable.
const canSubmit = computed(() => fileList.value.length === 1 && fileList.value[0].status !== 'error');

const handleCancel = () => {
  if (isSubmitting.value) return;
  emit('close');
};

const handleDownloadTemplate = () => {
  if (props.templateUrl) {
    window.open(props.templateUrl, '_blank');
  } else {
    message.warn('模板文件地址未配置');
  }
};

const beforeUpload = (file) => {
  const isAllowedType = props.allowedFileTypes.includes(file.type);
  if (!isAllowedType) message.error(`不支持的文件类型! 请上传 ZIP 或 RAR 格式的文件。`);
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxFileSizeMB;
  if (!isLtMaxSize) message.error(`文件大小不能超过 ${props.maxFileSizeMB}MB!`);
  
  // The fileList update is now solely handled by handleUploadChange based on AntD's internal state
  // if (isAllowedType && isLtMaxSize) {
  //   fileList.value = [file];
  // }
  return false; // Always return false to prevent automatic upload and manage it manually
};

const handleUploadChange = (info) => {
  // 过滤掉不符合类型或大小要求的文件
  // Ant Design Vue 的 Upload 组件在 beforeUpload 返回 false 时，会将文件状态标记为 'error'
  fileList.value = info.fileList.filter(file => {
    // 只有当文件状态不是 'error'，或者文件类型和大小都符合要求时，才保留该文件
    // 这样可以确保即使 AntD 内部将文件标记为 'error'，如果它确实是无效的，我们也会将其从 fileList 中移除
    const isAllowedType = props.allowedFileTypes.includes(file.type);
    const isLtMaxSize = file.size / 1024 / 1024 < props.maxFileSizeMB;
    return (file.status !== 'error' && isAllowedType && isLtMaxSize) || (file.status === 'done' || file.status === 'uploading');
  });
};



const handleSubmit = async () => {
  if (!canSubmit.value) {
    message.warn('请先选择一个有效的文件');
    return;
  }
  
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    // AntD file object is in originFileObj when selected manually
    formData.append('file', fileList.value[0].originFileObj || fileList.value[0]);
    
    // TODO: Replace with your actual upload API call
    console.log('Submitting file:', fileList.value[0].name);
    // const response = await apiClient.post(props.uploadUrl, formData, { headers: { 'Content-Type': 'multipart/form-data', ...props.uploadHeaders } });

    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResponse = { success: true, message: '提交成功', result: { id: 'file123', name: fileList.value[0].name } };
    
    if (mockResponse.success) {
      message.success('数据提交成功！');
      emit('submitSuccess', mockResponse.result);
      emit('close');
    } else {
        throw new Error(mockResponse.message);
    }
  } catch (error) {
    message.error('数据提交失败: ' + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

watch(() => props.isVisible, (visible) => {
  if (!visible) fileList.value = [];
});
</script>

<style lang="less">
.file-upload-modal-final {
  .ant-modal-content { padding: 0; border-radius: 4px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
  .ant-modal-body { padding: 0; }
  .ant-modal { padding-bottom: 0; }
}
</style>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.upload-modal-content-final {
  padding: 24px 32px 32px 32px;
  position: relative;
}

.modal-header-final {
  padding-bottom: 16px;
  border-bottom: 1px solid @border-color-light;
  margin-bottom: 24px;
  position: relative;
  .modal-title-final {
    font-size: 16px;
    font-weight: 500;
    color: @text-color-base;
    margin: 0;
    display: inline-block;
    &::after { // Red underline accent
      content: '';
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 150px; // Wider to match longer title
      height: 2px;
      background-color: @primary-color;
    }
  }
  .close-btn-final {
    position: absolute;
    top: -4px;
    right: -12px; // Adjusted to match image position
    background: none; border: none; cursor: pointer;
    font-size: 18px; // Slightly smaller X
    color: #8C8C8C;
    padding: 0; line-height: 1;
    transition: color 0.3s;
    &:hover { color: #595959; }
  }
}

.section-header-final {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  .section-title-final {
    font-size: 14px;
    font-weight: 500;
    color: @text-color-base;
    margin: 0;
  }
  .template-download-btn-final {
    color: @primary-color;
    border-color: @primary-color;
    font-size: 13px;
    padding: 4px 12px;
    height: auto;
    border-radius: @border-radius-sm;
    &:hover, &:focus { background-color: fade(@primary-color, 10%); }
  }
}

.custom-dragger-final {
  display: block;
  border-radius: 2px;
  &:hover { border-color: @primary-color; }

  // Use :deep to style AntD internal elements
  :deep(.ant-upload-list) {
    // padding: 0 16px; // Add padding to the list container
  }

  :deep(.ant-upload-drag-icon .anticon) {
    color: #8C8C8C;
    font-size: 28px; // Smaller icon
    margin-bottom: 16px;
  }
  :deep(.ant-upload-text.dragger-text-final) {
    font-size: 14px;
    color: #8C8C8C;
    // The "点击上传" part is not styled differently in this image
  }
  :deep(.ant-upload-hint.dragger-hint-final) {
    font-size: 12px;
    color: #BFBFBF;
    margin-top: 8px;
  }
  :deep(.ant-upload-list-item) {
    background-color: white;
    border: 1px solid @border-color-light;
    margin-top: 16px !important;
  }
}

.requirements-section-final {
  margin-top: 24px;
  .section-title-final { margin-bottom: 12px; }
  .requirements-list-final {
    list-style: none; padding: 0; margin: 0;
    font-size: 13px;
    color: #595959;
    .requirement-item-final {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      &:last-child { margin-bottom: 0; }
      .check-icon-wrapper-final {
        width: 16px; height: 16px;
        background-color: #52C41A;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-right: 8px;
        margin-top: 3px;
        .anticon {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }
      }
    }
  }
}

.modal-footer-final {
  margin-top: 32px;
  // This wrapper handles the alignment
  .buttons-wrapper-final {
    display: flex;
    justify-content: flex-end;
  }
  .cancel-btn-final, .submit-btn-final {
    width: 88px;
    height: 32px;
    font-size: 14px;
    font-weight: 400;
    border-radius: @border-radius-sm;
  }
  .cancel-btn-final {
    border-color: #D9D9D9;
    color: @text-color-secondary;
    &:hover { color: @primary-color; border-color: @primary-color; }
  }
  .submit-btn-final {
    margin-left: 12px;
    // Default (disabled) state
    &.submit-btn--disabled {
      background-color: #F5F5F5;
      border-color: #D9D9D9;
      color: #BFBFBF;
      // Override AntD's disabled opacity to match image
      :deep(span) {
        opacity: 1;
      }
    }
    // Enabled state (will be red because of `danger` prop on a-button)
  }
  .footer-note-final {
    text-align: right;
    font-size: 12px;
    color: #BFBFBF;
    margin-top: 10px;
  }
}
</style>