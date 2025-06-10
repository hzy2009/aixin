<template>
    <div class="talent-profile-card" @click="viewTalentDetails(talent)">
        <div class="card-header">
            <span>{{ talent.skillAreaName || '未知研究领域' }}</span>
            <!-- <a-tag v-if="talent.skillAreaName" class="area-tag">{{ talent.skillAreaName }}</a-tag> -->
        </div>
        <div class="card-body">
            <div class="introduction-section">
                <span class="intro-label">主要研究方向介绍：</span>
                <p class="talent-introduction">{{ talent.skillDesc }}</p>
            </div>
        </div>
        <div class="card-footer">
            <span class="talent-identifier">{{ talent.id }}</span>
            <a-button type="default" class="details-button" @click.stop="viewTalentDetails(talent)">
                查看详情
            </a-button>
        </div>
    </div>
</template>

<script setup>
import { Tag as ATag, Button as AButton } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    talent: {
        type: Object,
        required: true,
        default: () => ({
            id: 'talent-001',
            researchArea: '研究领域', // e.g., "模拟IC设计", "数字芯片验证"
            title: '研究方向研究方向研究方向', // e.g., "高性能ADC设计专家"
            introduction: '主要研究方向介绍主要研究方向介绍主要研究方向介绍主要研究方向介绍主要研究方向介绍主要研究方向介绍主要研究方向介绍主要研究方向介绍主要研究方向介绍',
            identifier: 'A1657231197', // Or any other relevant ID/code
        })
    }
});

const router = useRouter();

const emit = defineEmits(['handleDetail']);
const viewTalentDetails = (id) => {
    // TODO: Navigate to the actual talent detail page
    emit('handleDetail', id);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.talent-profile-card {
    background-color: @background-color-base; // White background
    border: 1px solid #F0F0F0; // Very light gray border, almost invisible on white
    border-radius: @border-radius-sm; // Subtle rounding (2px or 4px)
    padding: @spacing-md; // Internal padding for the card
    display: flex;
    flex-direction: column;
    height: 100%; // For consistent height in a grid
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        border-color: @primary-color; // Red border on hover

        // box-shadow: 0 2px 8px rgba(0,0,0,0.06); // Optional: slight shadow on hover
        .details-button {
            // Make button more prominent on card hover
            background-color: @primary-color;
            color: @text-color-light;
            border-color: @primary-color;
        }
    }
}

.card-header {
    font-size: 18px;
    border-bottom: 1px solid #F0F0F0; // Light gray border
    margin-bottom: @spacing-sm; // Space between tag and title
    display: flex; // In case you want to add more items here later
    justify-content: flex-start; // Align tag to the left
    font-weight: 600;
    padding-bottom: @spacing-sm;
}

.area-tag {
    height: 30px;
    gap: 10px;
    border-radius: 4px;
    padding: 0 9px;
    font-size: 12px;
    color: @text-color-secondary; // Gray text for tag
    background-color: #F5F5F5; // Very light gray background for tag
    border: 1px solid #E8E8E8; // Light gray border for tag
    line-height: 30px; // Ensure text is vertically centered
    margin: 0; // Remove default AntD tag margin
}

.card-body {
    flex-grow: 1; // Allows this section to expand and push footer down
    // margin-bottom: @spacing-md; // Space before footer
}

.talent-title {
    font-size: 18px; // Title font size
    font-weight: 500; // Semi-bold
    color: @text-color-base; // Black/dark gray
    margin-bottom: @spacing-xs; // Space below title
    line-height: 1.4;
    // Single line ellipsis for title
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.introduction-section {
    .intro-label {
        color: @text-color-secondary; // Gray for "主要研究方向介绍："
        display: block; // Put label on its own line or inline-block if preferred
        margin-bottom: 3px; // Small space between label and text
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        letter-spacing: 0%;
    }

    .talent-introduction {
        color: #666666; // Slightly darker gray for introduction text itself
        margin: 0; // Remove default paragraph margin
        // Multi-line ellipsis for introduction (e.g., 3 lines)
        display: -webkit-box;
        -webkit-line-clamp: 5; // Show 3 lines
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: calc(1.6em * 3); // Ensure space for 3 lines to maintain card height
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0%;
        text-align: justify;

    }
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: @spacing-sm; // Space above footer content
    // border-top: 1px solid #F0F0F0; // Light gray separator line
}

.talent-identifier {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: justify;
    color: @text-color-tertiary; // Lightest gray for identifier
}

.details-button {
    font-size: 13px;
    color: @primary-color; // Red text
    border: 1px solid @primary-color; // Red border
    background-color: @background-color-base; // White background
    border-radius: 4px;
    padding: 3px 12px; // Button padding
    height: auto; // Let padding define height
    line-height: 1.5;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
    width: 100px;
    height: 42px;
    &:hover,
    &:focus {
        // Hover style is handled by parent card hover for this design
        // If standalone hover needed:
        // background-color: @primary-color;
        // color: @text-color-light;
        // border-color: @primary-color;
    }
}
</style>