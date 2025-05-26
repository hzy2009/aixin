<template>
  <section class="home-expert-talent-section section-padding">
    <div class="container">
      <SectionHeader title-ch="行业人才" title-en="EXPERT TALENT" more-link="/experts" />
      <div class="expert-grid">
        <a-card v-for="expert in experts" :key="expert.id" class="expert-card" :body-style="{ padding: '20px' }">
          <div class="expert-card__top-line">
            <h3 class="expert-card__title">{{ expert.title }}</h3>
            <span class="expert-card__experience">行业经验: {{ expert.experience }}</span>
          </div>
          <hr class="expert-card__separator" />
          <div class="expert-card__skills-section">
            <p class="expert-card__skills-label">核心技能:</p>
            <ul class="expert-card__skills-list">
              <li v-for="(skill, index) in expert.skills" :key="index">{{ skill }}</li>
            </ul>
          </div>
        </a-card>
      </div>
    </div>
  </section>
</template>

<script setup>
// Script remains the same
import { ref } from 'vue';
import { Card as ACard } from 'ant-design-vue';
import SectionHeader from '@/components/common/SectionHeader.vue';

const experts = ref([
  { id: 1, title: '数字IC设计', experience: '10年', skills: ['精通Verilog/VHDL等硬件描述语言', '熟悉数字电路设计、时序分析、低功耗', '掌握EDA工具 (Cadence, Synopsys)'] },
  { id: 2, title: '模拟IC设计', experience: '12年', skills: ['精通LDO, ADC/DAC, PLL设计', '熟悉版图设计与寄生参数提取', '掌握Virtuoso, Spectre, Calibre'] },
  { id: 3, title: '射频IC设计', experience: '8年', skills: ['精通PA, LNA, Mixer, VCO设计', '熟悉ADS, HFSS等仿真工具', '有WiFi/BT/5G芯片流片经验'] },
  { id: 4, title: '芯片验证工程师', experience: '7年', skills: ['精通UVM验证方法学', '熟练使用SystemVerilog, SVA', '掌握VCS, Verdi等验证工具'] },
  { id: 5, title: '嵌入式软件工程师', experience: '9年', skills: ['精通C/C++, RTOS', '熟悉ARM架构, Linux内核驱动开发', '掌握Keil, IAR, GCC工具链'] },
  { id: 6, title: '版图设计工程师', experience: '6年', skills: ['熟悉深亚微米工艺节点版图设计', '掌握Calibre DRC/LVS/PEX', '有主流Foundry Tapeout经验'] },
  { id: 7, title: 'DFT工程师', experience: '7年', skills: ['精通Scan, ATPG, BIST, JTAG', '熟悉业界主流DFT工具', '有复杂SoC DFT设计经验'] },
  { id: 8, title: '工艺集成工程师', experience: '11年', skills: ['熟悉CMOS工艺流程与器件物理', '精通工艺监控与良率分析', '有新工艺平台开发经验'] },
]);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding {
  padding: @spacing-xxl 0;
  background-color: @background-color-section-alt;
}

.expert-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: @spacing-lg;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 575px) {
    grid-template-columns: 1fr;
  }
}

.expert-card {
  background-color: @background-color-base;
  border: 1px solid @border-color-light;
  border-radius: @border-radius-base;
  transition: box-shadow 0.3s ease, border-color 0.3s ease; // Added border-color to transition

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); // Slightly more pronounced shadow on hover
    border-color: darken(@border-color-light, 5%); // Optional: slightly darken border on hover

    .expert-card__title {
      color: @primary-color; // Title color changes to primary red on hover
    }
  }

  &__top-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-sm;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: @text-color-base; // Default title color is black/dark gray
    margin: 0;
    transition: color 0.3s ease; // Smooth transition for color change
  }

  &__experience {
    font-size: 13px;
    color: @text-color-secondary;
  }

  &__separator {
    border: none;
    height: 1px;
    background-color: @border-color-light;
    margin-top: @spacing-xs;
    margin-bottom: @spacing-md;
  }

  &__skills-section {
    // No changes needed here
  }

  &__skills-label {
    font-size: 14px;
    color: @text-color-secondary;
    margin-bottom: @spacing-sm;
    font-weight: 500;
  }

  &__skills-list {
    list-style-type: disc;
    padding-left: 18px;
    margin: 0;
    font-size: 13px;
    color: @text-color-secondary;

    li {
      margin-bottom: 7px;
      line-height: 1.5;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>