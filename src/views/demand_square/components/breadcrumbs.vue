<template>
    <a-breadcrumb v-if="breadcrumbs.length" class="page-breadcrumb">
        <a-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link v-if="crumb.path" :to="crumb.path">{{ crumb.name }}</router-link>
        <span v-else>{{ crumb.name }}</span>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue';

const route = useRoute();

const breadcrumbs = computed(() => {
  const matchedBreadcrumbs = route.meta.breadcrumb; // This is an array of strings
  const base = route.meta.breadcrumbBase || []; // New: base breadcrumb from parent route
  const combined = [...base, ...matchedBreadcrumbs];

  if (Array.isArray(combined) && combined.length > 0) {
    return combined.map((name, index) => {
      // A more robust breadcrumb might involve actual paths for intermediate items
      // For now, just names
      return { name };
    });
  }
  return [];
});
</script>
<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.page-breadcrumb {
  margin-bottom: @spacing-lg;
  font-size: 14px;
}
</style>

