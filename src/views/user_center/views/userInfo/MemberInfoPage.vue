<template>
  <div class="member-info-page">
    <div v-if="isLoading" class="loading-state">
      <a-spin size="large" tip="加载会员信息中..." />
    </div>
    <div v-else-if="error" class="error-state">
      <a-alert type="error" :message="error" show-icon />
      <a-button @click="fetchUserInfo" class="retry-button">重试</a-button>
    </div>
    <div v-else-if="userInfo" class="info-content">
      <!-- Top Section with Company Name, Level, Dates, and Avatar -->
      <div class="top-profile-section">
        <div class="profile-details-grid">
          <!-- Column 1 -->
          <div class="profile-detail-item">
            <span class="label">会员名称</span>
            <span class="value company-name-value">{{ userInfo.companyName }}</span>
          </div>
          <div class="profile-detail-item">
            <span class="label">会员等级</span>
            <span class="value membership-value">
              <a-tag class="membership-level-tag">{{ userInfo.memberLevel }}</a-tag>
              <a-button type="link" @click="upgradeMembership" class="upgrade-link">立即升级</a-button>
            </span>
          </div>

          <!-- Column 2 -->
          <div class="profile-detail-item">
             <span class="label">注册时间</span>
            <span class="value date-value">{{ userInfo.registrationDate }}</span>
          </div>
          <div class="profile-detail-item">
            <span class="label">到期时间</span>
            <span class="value date-value">{{ userInfo.expiryDate }}</span>
          </div>
        </div>
        <div class="profile-avatar-area">
          <div class="avatar-image-placeholder">
            <!-- Replace with your actual image -->
            <!-- <img src="/path/to/your-profile-graphic.png" alt="Profile Graphic" /> -->
            <span>会员形象占位</span>
          </div>
        </div>
      </div>

      <SectionTitle title="联系人信息" />
      <div class="info-block">
        <!-- ... (rest of the info-blocks remain the same as the previous "non-tabular" version) ... -->
        <div class="info-grid">
          <div class="info-item">
            <span class="label">联系人</span>
            <span class="value">{{ userInfo.contactPerson?.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">联系电话</span>
            <span class="value">{{ userInfo.contactPerson?.phone }}</span>
          </div>
          <div class="info-item full-width">
            <span class="label">邮箱地址</span>
            <span class="value">{{ userInfo.contactPerson?.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">所属部门</span>
            <span class="value">{{ userInfo.contactPerson?.department }}</span>
          </div>
          <div class="info-item">
            <span class="label">职务/岗位</span>
            <span class="value">{{ userInfo.contactPerson?.position }}</span>
          </div>
        </div>
      </div>

      <SectionTitle title="企业认证信息" />
       <div class="info-block">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">企业类别</span>
            <span class="value">{{ userInfo.companyCertification?.category }}</span>
          </div>
          <div class="info-item">
            <span class="label">所在地区</span>
            <span class="value">{{ userInfo.companyCertification?.location }}</span>
          </div>
          <div class="info-item">
            <span class="label">法人部门</span>
            <span class="value">{{ userInfo.companyCertification?.hrDepartmentContact }}</span>
          </div>
          <div class="info-item">
            <span class="label">是否上市</span>
            <span class="value">{{ userInfo.companyCertification?.isListed }}</span>
          </div>
          <div class="info-item">
            <span class="label">纳税人识别号</span>
            <span class="value">{{ userInfo.companyCertification?.taxpayerId }}</span>
          </div>
          <div class="info-item">
            <span class="label">注册资本 (万元)</span>
            <span class="value">{{ userInfo.companyCertification?.registeredCapital }}</span>
          </div>
          <div class="info-item full-width license-item">
            <span class="label">营业执照</span>
            <span class="value">
              <div v-if="userInfo.companyCertification?.businessLicenseUrl" class="license-image-wrapper">
                <img :src="userInfo.companyCertification.businessLicenseUrl" alt="营业执照" class="license-image" @click="previewLicense"/>
              </div>
              <span v-else>未上传</span>
            </span>
          </div>
        </div>
      </div>

      <SectionTitle title="法人信息" />
      <div class="info-block">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">法定代表人姓名</span>
            <span class="value">{{ userInfo.legalRepresentative?.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">法定代表人身份证号</span>
            <span class="value">{{ userInfo.legalRepresentative?.idCardNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">成立时间</span>
            <span class="value">{{ userInfo.legalRepresentative?.incorporationDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">法人职务</span>
            <span class="value">{{ userInfo.legalRepresentative?.position }}</span>
          </div>
          <div class="info-item">
            <span class="label">法人手机</span>
            <span class="value">{{ userInfo.legalRepresentative?.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">法人邮箱</span>
            <span class="value">{{ userInfo.legalRepresentative?.email }}</span>
          </div>
        </div>
      </div>


      <div class="page-actions">
        <!-- ... page actions ... -->
        <span class="last-update-info">当前信息更新于 {{ userInfo.lastInfoUpdateTime }} <a href="#" @click.prevent="viewUpdateHistory" class="history-link">查看更新记录</a></span>
        <a-button type="primary" @click="toggleEditMode" :loading="isSubmitting" class="edit-button">
          编辑
        </a-button>
      </div>

    </div>
    <a-empty v-else description="暂无会员信息" class="empty-state-full-page"/>
  </div>
</template>

<script setup>
// Script setup remains largely the same as the previous "non-tabular" version
import { ref } from 'vue';
import {
  Spin as ASpin,
  Alert as AAlert,
  Button as AButton,
  Tag as ATag,
  Empty as AEmpty,
} from 'ant-design-vue';
import { useUserInfo } from '../../composables/useUserInfo.js';
import SectionTitle from '../../components/SectionTitle.vue';

const { userInfo, isLoading, error, fetchUserInfo } = useUserInfo();

const isSubmitting = ref(false); // For edit button loading state

const upgradeMembership = () => {
  console.log('Upgrade membership clicked');
  alert('跳转到会员升级页面...');
};

const previewLicense = () => {
  if (userInfo.value?.companyCertification?.businessLicenseUrl) {
    alert(`预览营业执照: ${userInfo.value.companyCertification.businessLicenseUrl}. Actual preview modal needed.`);
  } else {
    alert('营业执照未上传。');
  }
};

const viewUpdateHistory = () => {
    alert('查看更新记录功能待实现');
};

const toggleEditMode = () => {
  console.log('Edit button clicked. Current data:', JSON.parse(JSON.stringify(userInfo.value)));
  alert('编辑功能待实现。将打开编辑模态框或表单。');
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

/* General page, loading, error, empty states are the same as before */
.member-info-page { /* ... */ }
.loading-state, .error-state, .empty-state-full-page { /* ... */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  .retry-button { margin-top: @spacing-md; }
}
.info-content { /* ... */ }

.top-profile-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; // Keep vertical alignment at the start
  padding: @spacing-lg 0; // Add some vertical padding inside the section
  margin-bottom: @spacing-xl;
  border-bottom: 1px solid @border-color-light;

  .profile-details-grid {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr)); // Two equal columns
    gap: @spacing-sm @spacing-xxl; // Small row gap, larger column gap

    .profile-detail-item {
      display: flex;
      flex-direction: column; // Stack label above value
      justify-content: center; // Center content vertically within its cell
      min-height: 38px; // Ensure a minimum height for alignment, adjust as needed

      .label {
        font-size: 13px; // Smaller label text as per design
        color: @text-color-secondary;
        margin-bottom: 3px; // Small space between label and value
        line-height: 1.4;
      }
      .value {
        font-size: 15px; // Value text size
        color: @text-color-base;
        font-weight: 500; // Default weight for values
        line-height: 1.4;
        display: flex; // For aligning tag and button
        align-items: center;

        &.company-name-value {
          font-size: 18px; // Company name is larger
          font-weight: 600;
        }
        &.date-value {
            font-weight: normal; // Dates are not bold in design
            color: @text-color-base; // Ensure dates are clearly visible
        }
      }

      .membership-value { // Container for tag and button
        display: flex;
        align-items: center;
      }
      .membership-level-tag {
        font-size: 12px;
        padding: 2px 10px; // Slightly more padding for the tag
        background-color: #383838; // Dark grey/black tag
        color: #E7C089; // Gold-ish text
        border: none;
        border-radius: 12px; // More rounded tag
        margin-right: @spacing-sm;
        line-height: 1.5; // Ensure text is centered in tag
      }
      .upgrade-link {
        color: @primary-color;
        font-size: 13px; // Slightly smaller link text
        padding: 0;
        font-weight: normal;
        height: auto;
        line-height: normal;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .profile-avatar-area {
    width: 130px; // Adjusted width based on image crop
    height: 90px; // Adjusted height
    flex-shrink: 0;
    margin-left: @spacing-xl; // Keep space from text
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar-image-placeholder {
      width: 100%;
      height: 100%;
      background-color: #FFF0F0; // Lighter pink/red tint
      border-radius: @border-radius-base;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @text-color-tertiary; // Lighter text for placeholder
      font-size: 12px;
      // If using an actual image:
      // img { width: 100%; height: 100%; object-fit: contain; border-radius: @border-radius-base;}
    }
  }
}

// SectionTitle styles are in its own component

.info-block {
  // padding: @spacing-sm 0; // Removed top/bottom padding from here
  margin-bottom: @spacing-lg;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: @spacing-md @spacing-xxl; // row-gap column-gap (increased column gap)
  font-size: 14px;
  padding: @spacing-sm 0; // Add some padding inside the grid area for items

  .info-item {
    display: flex;
    flex-direction: column; // Stack label and value vertically
    padding: @spacing-xs 0; // Small vertical padding for each item for separation

    .label {
      font-size: 13px; // Smaller label
      color: @text-color-secondary;
      margin-bottom: 4px; // Space between label and value
      line-height: 1.3;
    }
    .value {
      font-size: 14px;
      color: @text-color-base;
      font-weight: 500; // Bolder values
      line-height: 1.5;
      word-break: break-all;
    }

    &.full-width {
      grid-column: 1 / -1;
    }
    &.license-item {
      .label {
        // No special alignment needed if stacked
      }
    }
  }
}

.license-image-wrapper { /* ... same as before ... */
  display: inline-block;
  .license-image {
    max-width: 160px;
    max-height: 100px;
    border: 1px solid @border-color-light;
    border-radius: @border-radius-sm;
    cursor: pointer;
    object-fit: contain;
  }
}

.page-actions { /* ... same as before ... */
  margin-top: @spacing-xxl;
  padding-top: @spacing-lg;
  border-top: 1px solid @border-color-light;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .last-update-info {
    font-size: 13px;
    color: @text-color-tertiary;
    margin-right: auto;
    .history-link {
      color: @primary-color;
      margin-left: @spacing-xs;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .edit-button {
    min-width: 90px;
    font-size: 14px;
    padding: 6px 20px;
    height: auto;
  }
}
</style>