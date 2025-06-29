<template>
  <div class="expert-talent-card" @click="viewExpertProfile(expert.id)">
    <div class="card-header">
      <a-avatar :size="40" :src="expert.gender == '男'? ManImg : WomanImg" class="expert-avatar">
        <template #icon v-if="!expert.avatarUrl"><UserOutlined /></template>
      </a-avatar>
      <div> </div>
      <div class="expert-info">
        <h4 class="expert-name">{{expert.realname}}</h4>
        <p class="expert-contact">电话: {{ expert.phone }}</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-line">
        <span class="info-label">合作方向:</span>
        <span class="info-value">{{ expert.desiredCooperationDirection }}</span>
      </div>
      <div class="info-line research-areas">
        <span class="info-label">研究方向:</span>
        <ul class="areas-list">
          <li class="area-item"> {{ expert.skillDesc }}</li>
          <!-- <li v-for="(area, index) in expert.researchAreas" :key="index" class="area-item">
            {{ index + 1 }}. {{ area }}
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Avatar as AAvatar } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue'; // For fallback avatar
import { useRouter } from 'vue-router';
import ManImg from '@/assets/images/auth/m.png';
import WomanImg from '@/assets/images/auth/w.png';
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();

const props = defineProps({
  expert: {
    type: Object,
    required: true,
    default: () => ({})
  }
});
const router = useRouter();


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
  if (name.length == 2) {
    newName += '*';
  }
  return newName;
}

const viewExpertProfile = (id) => {
  // TODO: Navigate to expert's detail page
  // router.push({ name: 'ExpertProfile', params: { id } });
  const path = authStore.islogin ? `/demands/TalentDetailPage/${id}` : '/demands/Talent';
  router.push({ path});
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.expert-talent-card {
  background-color: #fff; // Light gray background for card
  padding: 22px 15px;
  border-radius: @border-radius-sm; // Slight rounding
  border: 1px solid transparent; // For hover effect
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%; // For consistent height in a grid

  &:hover {
    // border-color: @primary-color;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E5E6EB; // Light gray separator
}

.expert-avatar {
  margin-right: @spacing-sm + 2px;
  // Default AntD avatar styling should be fine, or add custom border if needed
  // e.g., border: 1px solid @border-color-light;
  // For the pink/blue circle avatars in image, you might need to set background color
  // for the avatar if no src is provided, or use SVG icons.
  // Example for colored fallback:
  // &.pink-bg { background-color: #FFE7E9; :deep(.anticon) { color: #FF4D6A; } }
  // &.blue-bg { background-color: #E6F7FF; :deep(.anticon) { color: @primary-color; } }
}

.expert-info {
  display: flex;
  justify-content: space-between;
  align-items: center;  
  flex: 1;
  .expert-name {
    font-size: 16px;
    font-weight: 500; // Semi-bold
    color: @text-color-tertiary; // Lightest gray for phone
    margin-bottom: 2px;
  }
  .expert-contact {
    font-size: 14px;
    color: @text-color-tertiary; // Lightest gray for phone
    margin: 0;
  }
}

.card-body {
  .info-line {
    margin-bottom: 9.5px; // 6px space between lines
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0%;
    // color: #656C74;
    color: @text-color-base;

    &:last-child {
      margin-bottom: 0;
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: -webkit-box;
    -webkit-line-clamp: 1; 
    -webkit-box-orient: vertical;
    .info-label {
      color: @text-color-secondary; // Gray label
      margin-right: 4px;
    }
    .info-value {
      // color: #4E5969; // Darker gray value
      color: @text-color-secondary; // Gray label
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // display: -webkit-box;
      // -webkit-line-clamp: 1; 
      // -webkit-box-orient: vertical;
      // overflow: hidden;
      // text-overflow: ellipsis;
    }
  }

  .research-areas {
    display: flex;
    color: @text-color-secondary; // Gray label
    .info-label {
      // display: block; // Label on its own line for research areas
      margin-bottom: 2px;
    }
    .areas-list {
      list-style: none;
      padding-left: 0; // No default list padding
      margin: 0;
      .area-item {
        // color: #4E5969; // Same as info-value
        // Numbering is part of the text
      }
    }
  }
}
</style>