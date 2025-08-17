<template>
  <div class="equipment-card-precise" @click="handleCardClick">
    <div class="card-image-section">
      <img
        :src="item.imageUrl || defaultPlaceholder"
        :alt="item.title"
        class="equipment-image-asset"
        @error="onImageError"
      />
    </div>
    <div class="card-content-section">
      <div class="card-tags-area">
        <span v-for="tag in item.tags" :key="tag.text" class="custom-tag-item" :class="tag.type">
          {{ tag.text }}
        </span>
      </div>
      <h3 class="card-title-text">{{ item.productName }}</h3>
      <div class="card-specs-list">
        <p class="spec-line" v-for="spec in fieldList" :key="spec.label">{{ spec.label }}：{{ item[spec.key] }}</p>
      </div>
      <div class="card-price-area">
        <div class="price-main">
          <span class="price-value-text">{{ formattedPrice }}</span>
          <span class="price-unit-text" v-if="item.priceType !== 'ask'">万元</span>
          <span class="price-suffix-text" v-if="item.priceType === 'auction'">起拍</span>
        </div>
        <div class="price-note-text">{{ item.negotiableText || '固定价，不可议价'}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import defaultPlaceholder from '@/assets/images/fallback/detailFall.jpg'; // 准备一个占位图

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({ // Default data structure matching the image
        id: '1',
        imageUrl: null, // Let it default to placeholder
        title: 'Nikon NSR 2205i14E步进式光刻机',
        tags: [
            { text: '全新整机(原厂状态)', type: 'status' },
            { text: '现货', type: 'stock' }
        ],
        specs: [
            { label: '设备类型', value: '光刻设备(Lithography)' },
            { label: '设备型号', value: 'NSR-2205i14E' },
            { label: '设备厂商', value: 'Nikon' },
        ],
        price: 350,
        priceType: 'fixed', // 'fixed', 'ask', 'auction'
        negotiableText: '固定价, 不可议价',
    })
  },
  fieldList: {
    type: Array,
    default: () => [],
    required: true
  }
});

const emit = defineEmits(['details']);

// Use a ref for the image source to handle errors
const imageSrc = ref(props.item.imageUrl || defaultPlaceholder);

const formattedPrice = computed(() => {
  if (props.item.priceType === 'ask') return '****';
  return props.item.price || '面议';
});

const onImageError = () => {
  // If the provided imageUrl fails to load, switch to the default placeholder
  imageSrc.value = defaultPlaceholder;
};

const handleCardClick = () => {
  emit('details', props.item);
};

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.equipment-card-precise {
  background-color: @background-color-base; // White
  border: 1px solid #E5E6EB; // Very light gray border
  border-radius: 4px; // Gentle rounding
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column; // Image on top, content below
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    border-color: fade(@primary-color, 50%); // Lighter red border on hover
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    .card-image-section{
      border-color: fade(@primary-color, 50%); // Lighter red border on hover
    }
  }
}

.card-image-section {
  width: 100%;
  border-bottom: 1px solid #fff;

  .equipment-image-asset {
    width: 280px; // Image has padding around it
    height: 280px;
    object-fit: contain; // Image is fully visible, not cropped
  }
  .image-placeholder-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    .placeholder-logo-faint { // Faint logo if no image
        width: 100px; // Adjust size
        opacity: 0.5;
    }
  }
}

.card-content-section {
  padding: 12px 16px 16px; // Top, L/R, Bottom padding
  display: flex;
  flex-direction: column;
  flex-grow: 1; // Allows content to fill remaining space
}

.card-tags-area {
  margin-bottom: 10px;
  display: flex;
  gap: 8px;

  .custom-tag-item {
    padding: 2px 8px;
    font-size: 12px;
    line-height: 18px;
    border-radius: 2px;
    color: @primary-color; // Red text
    background-color: transparent; // No background
    border: 1px solid @primary-color; // Red border

    &.stock { // "现货" might have a different style if needed, but image shows same
      // color: #00B42A;
      // border-color: #00B42A;
    }
  }
}

.card-title-text {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;

  color: #000000; // Very dark gray, almost black
  margin-bottom: 20px;
  // Ellipsis for exactly 2 lines
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-specs-list {
  font-size: 13px; // Slightly larger than before
  color: #000000; // Light gray for specs
  margin-bottom: 12px; // Space before price
  line-height: 1.6;

  .spec-line {
    margin: 0; // Remove default p margin
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.card-price-area {
  margin-top: auto; // Pushes the price to the bottom of the card
  .price-main {
    display: flex;
    align-items: baseline;
    font-weight: bold; // Both number and unit are bold in image
    font-weight: 400;
    font-size: 24px;
    line-height: 16px;
    .price-value-text {
      font-family: PingFang SC;
      // color: @primary-color; // Red color for price
      color: #000000;
      font-family: Arial, sans-serif; // A good font for numbers
      margin-right: 4px;
      line-height: 1;
    }
    .price-unit-text {
      // color: @primary-color; // Red unit
      color: #000000;
      line-height: 1;
    }
    .price-suffix-text {
        font-size: 14px;
        color: @text-color-base; // Suffix like "起拍" is black
        margin-left: 4px;
    }
  }
  .price-note-text {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    color: #9AA0A3; // Very light gray for the note
    margin-top: 10px; // Small space above the note
  }
}
</style>