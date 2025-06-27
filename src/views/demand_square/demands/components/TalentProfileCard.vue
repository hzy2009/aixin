<template>
  <div class="expert-talent-card">
    <!-- 头部信息 -->
    <div class="card-header">
      <!-- 左侧：头像 -->
      <a-avatar :size="48" class="expert-avatar" :src="talent.gender === '男' ? ManImg : WomanImg">
        <template #icon><UserOutlined /></template>
      </a-avatar>

      <!-- 右侧：信息 -->
      <div class="header-info">
        <!-- 上方：姓名 -->
        <h4 class="expert-name">{{ talent.realname}}</h4>
        <!-- 下方：联系方式 (已应用打码) -->
        <div class="contact-details">
          <p class="expert-contact">电话:{{ maskPhone(talent.phone) }}</p>
          <!-- <span class="separator">|</span> -->
          <p class="expert-email">邮箱:{{ maskEmail(talent.email) }}</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="card-body">
      <div class="section skill-section">
        <h5 class="section-title">主要研究方向:</h5>
        <ul v-if=" formatSkillDescLsit.length && formatSkillDescLsit.length > 1" class="research-list">
          <li
            v-for="(area, index) in formatSkillDescLsit"
            :key="index"
            class="research-item"
          >
            {{ area }}
          </li>
        </ul>
        <div v-else-if="formatSkillDescLsit.length === 1" class="skill-desc">{{ formatSkillDescLsit[0] }}></div>
        <p v-else class="empty-text">暂无研究方向</p>
      </div>
      <div class="section">
        <h5 class="section-title">合作意向:</h5>
        <p class="cooperation-intention">{{ talent.desiredCooperationDirection || '暂无合作意向' }}</p>
      </div>
    </div>

    <!-- 底部 -->
    <div class="card-footer">
      <div class="tags-container">
        <template v-if="talent.tags && talent.tags.length">
            <span
              v-for="tag in talent.tags"
              :key="tag"
              class="tag-item"
            >
              {{ tag }}
            </span>
        </template>
        <span v-else class="empty-text">暂无标签</span>
      </div>
      <a-button class="view-details-btn" @click.stop="viewExpertProfile(talent)">
        查看详情
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Avatar as AAvatar, Button as AButton } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import ManImg from '@/assets/images/auth/m.png';
import WomanImg from '@/assets/images/auth/w.png';
const props = defineProps({
  talent: {
    type: Object,
    required: true,
  }
});

const router = useRouter();

const emit = defineEmits(['handleDetail']);

// 正常显示第二字，其他字都用*代替
const formatName = (name) =>{
  let newName = '';
  for (let i = 0; i < name.length; i++) {
    if (i === 1) {
      newName += name[i];
    } else {
      newName += '*';
    }
  }
  return newName;
}

/**
 * 电话号码打码
 * @param {string} phone - 电话号码
 * @returns {string} - 打码后的电话号码
 */
const maskPhone = (phone) => {
  if (!phone) return '暂无';
  // 匹配11位手机号，格式化为 138****1234
  if (/^\d{11}$/.test(phone)) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  // 其他格式（如座机）采用通用规则：保留前3后2
  if (phone.length > 5) {
    return phone.substring(0, 3) + '****' + phone.substring(phone.length - 2);
  }
  // 过短的号码直接部分隐藏
  return phone.substring(0, 1) + '****';
};

/**
 * 邮箱打码
 * @param {string} email - 邮箱地址
 * @returns {string} - 打码后的邮箱地址
 */
const maskEmail = (email) => {
  if (!email) return '暂无';
  const parts = email.split('@');
  if (parts.length !== 2) return email; // 非标准格式直接返回

  const username = parts[0];
  const domain = parts[1];
  
  let maskedUsername;
  if (username.length <= 1) {
    maskedUsername = '*';
  } else if (username.length <= 3) {
    // 用户名较短时，保留第一个字符
    maskedUsername = username.substring(0, 1) + '****';
  } else {
    // 用户名较长时，保留前三个字符
    maskedUsername = username.substring(0, 3) + '****';
  }

  return `${maskedUsername}@${domain}`;
};
const formatSkillDescLsit = computed(() => {
  return props.talent.skillDesc.split('\n');
})

const viewExpertProfile = (item) => {
  emit('handleDetail', item);
  // router.push({ name: 'TalentProfile', params: { id } });
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';
// 定义颜色变量以便维护
@text-primary: #1D2129;
@text-secondary: #4E5969;
@text-tertiary: #86909C;
@border-color: #E5E6EB;
@bg-light-gray: #F7F8FA;
@avatar-bg: #E6F0FF;
@avatar-icon: #4096FF;

.expert-talent-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  transition: box-shadow 0.3s ease;
  font-family: 'PingFang SC', sans-serif;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  position: relative;
  margin-bottom: 16px;
  border-bottom: 1px solid @border-color;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 72px;
    height: 2px;
    background-color: @primary-color;
  }
}

.expert-avatar {
  background-color: @avatar-bg;
  :deep(.anticon) {
    color: @avatar-icon;
  }
}

.header-info {
  flex: 1;
  min-width: 0;
}

.expert-name {
  font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0%;
    color: #656C74;
  margin: 0 0 10px 0;
}

.contact-details {
    justify-content: space-between;
  display: flex;
  align-items: center;
    color: #656C74;
  font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: justify;

  
  p {
    margin: 0;
  }

  .separator {
    margin: 0 8px;
  }
}

.card-body {
  margin-bottom: 20px;
  .skill-section{
    height: 90px;
    overflow: hidden;
  }
  .section {
    margin-bottom: 16px;
    &:last-child { margin-bottom: 0; }
    .section-title {
      font-family: PingFang SC;
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0%;
        color: #656C74;

      margin: 0 0 8px 0;
    }
    .research-list {
      list-style: none;
      padding-left: 0;
      margin: 0;
      height: 66px;
      overflow: hidden;
      .research-item {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0%;
        text-align: justify;
        color: #656C74;
      }
    }
    .skill-desc{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0%;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
    - webkit-box-orient: vertical;
      overflow: hidden;
      // text-align: justify;
      color: #656C74;
    }
    .cooperation-intention {
        color: #656C74;
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0%;
        text-align: justify;
         margin: 0;
         overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .empty-text {
      font-size: 14px;
      color: @text-tertiary;
    }
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tags-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    .tag-item {
      background-color: @bg-light-gray;
      color: @text-secondary;
      padding: 2px 8px;
      border-radius: 2px;
      font-size: 14px;
    }
    .empty-text {
      font-size: 14px;
      color: @text-tertiary;
    }
  }

  .view-details-btn {
    color: @primary-color;
    border-color: @primary-color;
    width: 100px;
    height: 42px;
    &:hover, &:focus {
      color: #fff;
      background-color: @primary-color;
      border-color: @primary-color;
    }
  }
}
</style>