<template>
  <div class="vxe-grid-wrapper">
    <vxe-grid
      ref="gridRef"
      :columns="columns"
      :data="data"
      :loading="loading"
      :edit-config="editConfig"
      border="full"
      height="auto"
      align="center"
      header-align="center"
      class-name="custom-vxe-table"
      :row-config="{ isHover: true }"
      :column-config="{ resizable: true }"
      @cell-click="handleCellClick"
    >
      <!-- Custom Slot for Switch -->
      <template #switch="{ row }">
        <div class="switch-container">
          <span>否</span>
          <a-switch v-model:checked="row.isSelected" @change="(checked) => onSwitchChange(checked, row)" />
          <span>是</span>
        </div>
      </template>

      <!-- Custom Slot for Buttons -->
      <template #buttons="{ row }">
        <div class="button-group">
          <a-button
            v-for="button in buttonConfig"
            :key="button.key"
            :type="button.type || 'primary'"
            :danger="button.danger"
            :disabled="button.disabled || (typeof button.getDisabledState === 'function' ? button.getDisabledState(row) : false)"
            class="actionButton"
            @click="() => onButtonClick(button.key, row)"
          >
            {{ button.label }}
          </a-button>
        </div>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Switch as ASwitch, Button as AButton } from 'ant-design-vue';

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  // Configuration for action buttons in a #buttons slot
  buttonConfig: { type: Array, default: () => [] },
  // Configuration for vxe-grid's edit behavior
  editConfig: {
    type: Object,
    default: () => ({
      trigger: 'click',
      mode: 'cell',
      showStatus: true,
    })
  }
});

const emit = defineEmits(['switchChange', 'buttonClick', 'cellClick']);

const gridRef = ref(null);

const onSwitchChange = (checked, row) => {
  emit('switchChange', { checked, row });
};

const onButtonClick = (key, row) => {
  emit('buttonClick', { key, row });
};

const handleCellClick = (params) => {
  emit('cellClick', params);
};

// Expose grid methods if parent needs to interact with it
defineExpose({
  getGridRef: () => gridRef.value,
  getUpdateRecords: () => gridRef.value?.getUpdateRecords(), // Example of exposing a method
});
</script>

<style lang="less" scoped> // Use global style tag for deep selectors
@import '@/assets/styles/_variables.less';

.custom-vxe-table {
  // Header styles
  .vxe-header--column {
    background-color: #FAFAFA !important;
    color: #31363F;
    font-weight: 500;
    font-size: 14px;
  }
  // Cell styles
  .vxe-body--column {
    font-size: 14px;
    color: #646A73;
  }
   // Hover row
  .vxe-body--row.row--hover {
    background-color: #f5f5f5;
  }
  // Border styles
  &.vxe-grid--border-full .vxe-body--column,
  &.vxe-grid--border-full .vxe-header--column {
    border-right: 1px solid #E5E6EB;
    border-bottom: 1px solid #E5E6EB;
  }
  &.vxe-grid--border-full {
    border: 1px solid #E5E6EB;
  }

  // Input styles for editable cells
  .vxe-input--inner {
      height: 30px;
      border-radius: @border-radius-sm;
      border: 1px solid #DCDCDC;
      &:focus {
          border-color: @primary-color;
          box-shadow: 0 0 0 2px fade(@primary-color, 20%);
      }
  }
}
</style>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: @text-color-secondary;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: nowrap;

  .actionButton {
    border-radius: 4px;
    padding: 2px 6px; 
  }
}
</style>