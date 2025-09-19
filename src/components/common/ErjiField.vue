<template>
  <div class="erjisb-field">
    <a-select
      v-model:value="model.productMainTypeCode"
      placeholder="请选择主分类"
      style="width: 48%; margin-right: 4%"
      :options="selectOptions('product_main_type')"
      :disabled="disabled"
      @change="handleMainTypeChange"
      allow-clear
    />
    <a-select
      v-model:value="model.productType"
      placeholder="请选择子分类"
      style="width: 48%"
      :options="subTypeOptions"
      :disabled="disabled || !model.productMainTypeCode"
      @change="handleSubTypeChange"
      allow-clear
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Select as ASelect } from 'ant-design-vue';
import { selectOptions } from '@/utils/index';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// Use a computed property to proxy the v-model
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const subTypeOptions = computed(() => {
  if (model.value.productMainTypeCode === 'product_type') {
    return selectOptions('product_type');
  } else if (model.value.productMainTypeCode === 'product_type_material') {
    return selectOptions('product_type_material');
  } else {
      return [];
  }
});

const handleMainTypeChange = (value, option) => {
  // Update the name for the main type
  model.value.productMainTypeName = option?.label;
  // Clear the sub-type when the main type changes
  model.value.productType = undefined;
  model.value.productTypeName = undefined;
};

const handleSubTypeChange = (value, option) => {
  // Update the name for the sub type
  model.value.productTypeName = option?.label;
};
</script>

<style scoped>
.erjisb-field {
  display: flex;
  width: 100%;
}
</style>
