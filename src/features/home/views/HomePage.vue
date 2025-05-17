<template>
  <div class="home-page">
    <!-- Hero Section (Assuming this is mostly correct from previous attempts) -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>致力于为半导体行业提供专业的信息服务</h1>
        <h2>连接产业链上下游，促进产业协同发展</h2>
        <p>
          汇聚国产替代资源，精准对接原厂直供，赋能研发设计协同创新，汇集权威产业数据，打通芯片设计、制造、封装、测试环节，助力企业快速匹配优质国产供应商，降低供应链风险；优化创新协作生态，共享技术方案与攻关经验，加速核心器件自主化进程；数据驱动价值创造，赋能行业生态共创未来，携手突破“卡脖子”难题，共襄中国芯竞争力！
        </p>
      </div>
    </section>

    <!-- Stats Section - REFINED -->
    <section class="stats-section-wrapper">
      <div class="stats-content container">
        <div v-for="stat in statsData" :key="stat.label" class="stat-item">
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-description">{{ stat.description }}</div>
        </div>
      </div>
    </section>

    <!-- Image Carousel Section - REFINED -->
    <section class="image-carousel-section">
      <div class="container no-padding-container">
        <a-carousel :dots="false" effect="fade">
          <template #prevArrow>
            <div class="custom-slick-arrow custom-slick-prev">
              <span>◀</span> <!-- Left pointing triangle -->
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow custom-slick-next">
              <span>▶</span> <!-- Right pointing triangle -->
            </div>
          </template>
          <div v-for="(item, index) in carouselItems" :key="index" class="carousel-slide">
            <img :src="item.image" :alt="item.caption" />
            <div class="carousel-caption-wrapper">
              <div class="carousel-caption">{{ item.caption }}</div>
            </div>
          </div>
        </a-carousel>
      </div>
    </section>

    <!-- Industry Trends Section - REFINED -->
    <section class="content-section industry-trends-section">
      <div class="section-header-refined container">
        <h2 class="section-title-main">行业动态</h2>
        <span class="section-subtitle-main">INDUSTRY TRENDS</span>
        <a-button type="link" class="more-link-main" @click="navigateTo('/industry-dynamics')">更多</a-button>
      </div>
      <div class="section-content container">
        <a-list item-layout="horizontal" :data-source="industryTrends" :split="false">
          <template #renderItem="{ item }">
            <a-list-item class="trend-item-refined">
              <a :href="item.link" target="_blank" class="trend-title-link">
                <span class="trend-title">{{ item.title }}</span>
              </a>
              <span class="trend-date">{{ item.date }}</span>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </section>

    <!-- Expert Talent Section - REFINED -->
    <section class="content-section expert-talent-section">
      <div class="section-header-refined container">
        <h2 class="section-title-main">行业人才</h2>
        <span class="section-subtitle-main">EXPERT TALENT</span>
        <a-button type="link" class="more-link-main" @click="navigateTo('/expert-talent')">更多</a-button>
      </div>
      <div class="section-content container">
        <div class="expert-grid-refined">
          <div v-for="expert in expertTalents" :key="expert.name" class="expert-card-refined">
            <div class="expert-card-header">
              <h3 class="expert-name">{{ expert.name }}</h3>
              <span class="expert-experience">行业经验: {{ expert.experience }}</span>
            </div>
            <div class="expert-card-body">
              <p class="skills-label">核心技能：</p>
              <ul>
                <li v-for="skill in expert.skills" :key="skill">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Member Section (Assuming this is mostly correct) -->
    <section class="content-section platform-member-section">
      <div class="section-header-refined container"> <!-- Use refined header style -->
        <h2 class="section-title-main">平台会员</h2>
        <span class="section-subtitle-main">PLATFORM MEMBER</span>
        <a-button type="link" class="more-link-main" @click="navigateTo('/platform-members')">更多</a-button>
      </div>
      <div class="section-content container">
        <div class="member-grid">
          <div v-for="member in platformMembers" :key="member.name" class="member-item">
            <img :src="member.logo" :alt="member.name" class="member-logo" />
            <p class="member-name">{{ member.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Industry Research Report Section (Assuming this is mostly correct) -->
    <section class="content-section industry-research-section">
        <div class="section-header-refined container"> <!-- Use refined header style -->
          <h2 class="section-title-main">行研报告</h2>
          <span class="section-subtitle-main">INDUSTRY RESEARCH REPORT</span>
          <a-button type="link" class="more-link-main" @click="navigateTo('/research-reports')">更多</a-button>
        </div>
      <div class="section-content container">
        <div class="report-grid">
          <a-card v-for="report in researchReports" :key="report.title" class="report-card" hoverable>
            <template #cover>
              <img :alt="report.title" :src="report.image" class="report-image"/>
            </template>
            <a-card-meta :title="report.title" :description="report.snippet">
            </a-card-meta>
            <div class="report-date">{{ report.date }}</div>
          </a-card>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Carousel as ACarousel, Card as ACard, List as AList, ListItem as AListItem, Button as AButton, CardMeta as ACardMeta } from 'ant-design-vue';
// Removed icon imports as we'll use text/CSS for arrows

// Import placeholder images
import heroBg from '@/assets/images/home/banner.png'; // Assuming you have this
import carouselImg1 from '@/assets/images/home/carousel1.png';
import carouselImg2 from '@/assets/images/home/carousel1.png';
import dosiliconLogo from '@/assets/images/home/dosilicon-logo.png';
import reportThumb1 from '@/assets/images/home/image (1).png';
import reportThumb2 from '@/assets/images/home/image (2).png';
import reportThumb3 from '@/assets/images/home/image (3).png';


const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

// Mock Data (same as before)
const statsData = ref([
  { number: '500+', label: '国产替代寻源', description: '寻找并采用国内企业生产的芯片或相关技术以替代原本依赖的进口产品' },
  { number: '360+', label: '原厂件寻源', description: '通过正规渠道获取直接生产或授权的正品元器件' },
  { number: '78+', label: '研发攻关', description: '集中资源突破关键技术瓶颈或解决复杂问题' },
  { number: '180+', label: '检测验证', description: '通过系统化测试与分析确保芯片设计、制造等环节符合各种要求' },
  { number: '50+', label: '线下沙龙', description: '专家分享、实践互动促进行业合作与发展' },
]);

const carouselItems = ref([
  { image: carouselImg1, caption: '半导体设备：工欲善其事，必先利其器' },
  { image: carouselImg2, caption: '先进封装技术引领未来趋势' },
]);

const industryTrends = ref([
  { title: '中国半导体行业协会2025年环境、安全和健康国际研讨会...', link: '#', date: '2025-04-22' },
  { title: '探索下一代芯片材料：硅基之外的无限可能与挑战深度解析', link: '#', date: '2025-04-20' },
  { title: '全球半导体市场复苏信号明显，AI芯片需求持续旺盛驱动增长', link: '#', date: '2025-04-18' },
  { title: '国产EDA工具取得新突破，助力本土芯片设计自主化进程加速', link: '#', date: '2025-04-15' },
]);

const expertTalents = ref([
  { name: '数字IC设计', experience: '10年', skills: ['精通Verilog/VHDL等硬件描述语言', '熟悉数字电路设计、时序分析、低功耗设计', '掌握EDA工具（Cadence, Synopsys）'] },
  { name: '模拟IC设计', experience: '12年', skills: ['精通ADC/DAC, PLL, LDO等模块设计', '熟悉版图设计与寄生参数提取', '掌握Spectre, HSPICE等仿真工具'] },
  { name: '射频IC设计', experience: '8年', skills: ['精通LNA, PA, Mixer, VCO设计', '熟悉Smith圆图、S参数等射频理论', '掌握ADS, HFSS等设计软件'] },
  { name: 'FPGA开发', experience: '7年', skills: ['精通Xilinx/Intel FPGA架构与开发流程', '熟悉高速接口（PCIe, DDR）设计', '掌握Vivado, Quartus等工具'] },
]);

const platformMembers = ref([
  { name: '东芯半导体', logo: dosiliconLogo },
  { name: '华大半导体', logo: dosiliconLogo },
  { name: '紫光展锐', logo: dosiliconLogo },
  { name: '中芯国际', logo: dosiliconLogo },
]);

const researchReports = ref([
  { title: '中国半导体行业协会2025年环境、安全...', image: reportThumb1, snippet: '近年来，集成电路产业在成为国家重点鼓励、扶持的战略性新兴产业的同时，也日益面临着更为严峻的环境和安全问题，国内外多项...', date: '2025-04-22' },
  { title: 'AI芯片市场发展趋势与投资机遇深度分析报告（2025版）', image: reportThumb2, snippet: '人工智能技术的飞速发展正深刻改变着各行各业，AI芯片作为其核心硬件支撑，市场需求持续高速增长，本报告旨在深入分析当前AI芯片...', date: '2025-04-18' },
  { title: '第三代半导体材料（SiC/GaN）产业化进程及国产替代展望', image: reportThumb3, snippet: '以碳化硅（SiC）、氮化镓（GaN）为代表的第三代半导体材料凭借其优异的物理特性，在新能源汽车、5G通信、快充等领域展现出巨大应用潜力...', date: '2025-04-12' },
]);

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// Helper class for containers that should not have default horizontal padding
.no-padding-container {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.home-page {
  // General styles for the home page if needed
}

// --- Hero Section (Styles from previous attempts, assumed mostly correct) ---
.hero-section {
  /* ... styles ... */
  position: relative;
  background-image: url('@/assets/images/home/hero-background.jpg');
  background-size: cover;
  background-position: center;
  color: @text-color-light;
  padding: 100px 0 120px;
  text-align: center;
  .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 1; }
  .hero-content {
    position: relative; z-index: 2;
    h1 { font-size: 42px; margin-bottom: @spacing-md; font-weight: 700; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }
    h2 { font-size: 26px; margin-bottom: @spacing-lg; font-weight: 400; color: #e0e0e0; text-shadow: 1px 1px 2px rgba(0,0,0,0.4); }
    p { font-size: 16px; line-height: 1.8; max-width: 850px; margin: 0 auto @spacing-lg; color: #dadada; }
  }
}

// --- Stats Section - REFINED ---
@stats-section-bottom-border-color: #e0efff; // A light blue similar to the design's line

.stats-section-wrapper {
  padding: 30px 0 25px; // Adjusted padding
  background-color: #fff;
  border-bottom: 3px solid @stats-section-bottom-border-color; // The blue line at the bottom
  // margin-bottom: 0; // No margin if carousel section starts immediately after

  .stats-content {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: nowrap;
    gap: @spacing-sm; // Slightly reduced gap
  }

  .stat-item {
    text-align: center;
    flex-basis: 0;
    flex-grow: 1;
    padding: 0 @spacing-xs;

    .stat-number {
      font-size: 42px; // Adjusted from image
      font-weight: 700;
      color: @primary-color;
      margin-bottom: 2px;
      line-height: 1.1;
    }
    .stat-label {
      font-size: 15px; // Adjusted from image
      font-weight: 500;
      color: @text-color-base;
      margin-bottom: 6px;
    }
    .stat-description {
      font-size: 12px;
      color: @text-color-secondary;
      line-height: 1.4;
      max-width: 180px;
      margin: 0 auto;
    }
  }
}


// --- Image Carousel Section - REFINED ---
.image-carousel-section {
  // The container for this section might not need padding if the carousel spans full width of its container
  margin-bottom: 50px; // Space after carousel

  .carousel-slide {
    position: relative;
    height: 400px; // Adjust height to match design proportions
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .carousel-caption-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
        padding: 30px 20px 20px; // More padding at bottom for caption
    }
    .carousel-caption {
      color: @text-color-light;
      text-align: center;
      font-size: 18px; // As per design
      font-weight: 500;
    }
  }

  // Custom Slick Arrows - REFINED
  :deep(.custom-slick-arrow) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.3); // Semi-transparent black
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;

    span {
      color: white;
      font-size: 18px; // Adjust size of arrow character
      line-height: 1; // Ensure proper vertical alignment
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  :deep(.custom-slick-prev) {
    left: 20px;
  }
  :deep(.custom-slick-next) {
    right: 20px;
  }
}


// --- Common Refined Section Header ---
.section-header-refined {
  display: flex;
  align-items: center; // Vertically align items
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8; // Light gray border bottom

  &::before { // The red vertical bar
    content: '';
    display: inline-block;
    width: 4px;
    height: 22px; // Height of the bar
    background-color: @primary-color;
    margin-right: 12px; // Space between bar and title
  }

  .section-title-main {
    font-size: 20px; // Main title font size
    font-weight: 600;
    color: @text-color-base;
    margin: 0;
    line-height: 1; // Match height of bar
  }

  .section-subtitle-main {
    font-size: 13px;
    font-weight: 400;
    color: @text-color-secondary;
    margin-left: 8px;
    text-transform: uppercase;
    line-height: 1; // Match height of bar
    position: relative;
    top: 1px; // Fine-tune vertical alignment with title
  }

  .more-link-main {
    margin-left: auto; // Pushes "更多" to the right
    color: @text-color-secondary;
    font-size: 14px;
    padding: 0; // Remove default button padding
    &:hover {
      color: @primary-color;
    }
  }
}

// --- Content Section (common for Trends, Talent, etc.) ---
.content-section {
  padding: 0 0 50px; // Remove top padding, rely on margin from previous section. Add bottom padding.
  &:nth-child(odd) { // Example for alternating backgrounds if needed later, design seems consistently light gray or white.
     background-color: #f9f9f9; // Very light gray
  }
   &:nth-child(even) {
     background-color: #fff;
  }
  .section-content.container {
      padding-top: 20px; // Add padding to content after header
  }
}
// Initial sections often don't have top padding if they follow a visually distinct element like carousel
.industry-trends-section, .expert-talent-section {
    padding-top: 30px; // Specific top padding for these sections
}


// --- Industry Trends Section - REFINED ---
.industry-trends-section {
  .trend-item-refined {
    display: flex; // Use flex for alignment
    justify-content: space-between; // Pushes date to the right
    align-items: center;
    padding: 12px 0 !important; // Override AntD list padding
    border-bottom: 1px dotted #e0e0e0; // Dotted separator
    &:last-child {
      border-bottom: none;
    }

    .trend-title-link {
        text-decoration: none;
        flex-grow: 1; // Allow title to take available space
        margin-right: 15px; // Space before date
    }
    .trend-title {
      color: #333; // Darker black for title
      font-size: 15px;
      line-height: 1.5;
      &:hover {
        color: @primary-color;
      }
    }
    .trend-date {
      color: #999; // Lighter gray for date
      font-size: 14px;
      white-space: nowrap; // Prevent date from wrapping
    }
  }
}

// --- Expert Talent Section - REFINED ---
.expert-talent-section {
  background-color: #fff; // White background for this section as per design
  padding-bottom: 50px; // Ensure enough space at the bottom

  .expert-grid-refined {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); // Responsive grid
    gap: 25px; // Gap between cards
  }

  .expert-card-refined {
    background-color: #fff; // Card background
    border: 1px solid #e8e8e8; // Light border for the card
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); // Subtle shadow
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .expert-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #f0f0f0; // Separator line in card

      .expert-name {
        font-size: 17px;
        font-weight: 600;
        color: @text-color-base; // Darker name
        margin: 0;
      }
      .expert-experience {
        font-size: 13px;
        color: @text-color-secondary; // Gray for experience
      }
    }

    .expert-card-body {
      .skills-label {
        font-size: 14px;
        font-weight: 500;
        color: @text-color-base;
        margin-bottom: 8px;
      }
      ul {
        list-style: none; // Remove default bullets
        padding-left: 0;
        margin: 0;
        li {
          font-size: 13px;
          color: #555; // Slightly darker gray for skills
          line-height: 1.7;
          margin-bottom: 4px;
          position: relative;
          padding-left: 15px; // Space for custom bullet

          &::before { // Custom bullet
            content: '•';
            position: absolute;
            left: 0;
            color: @primary-color; // Red bullet
            font-size: 14px; // Adjust bullet size
          }
        }
      }
    }
  }
}


// --- Platform Member Section (Styles from previous attempts, assumed mostly correct) ---
.platform-member-section {
  background-color: #f9f9f9;
  padding-bottom: 50px;
  .member-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    gap: @spacing-xl;
  }
  .member-item {
    text-align: center;
    .member-logo { height: 60px; max-width: 150px; object-fit: contain; margin-bottom: @spacing-sm; filter: grayscale(100%); transition: filter 0.3s ease; &:hover { filter: grayscale(0%); } }
    .member-name { font-size: 14px; color: @text-color-secondary; }
  }
}

// --- Industry Research Report Section (Styles from previous, AntD Card used here) ---
.industry-research-section {
    background-color: #fff;
    padding-bottom: 60px;
  .report-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: @spacing-lg;
  }
  .report-card { // Using AntD Card, so some styles are via :deep
    .report-image { height: 180px; object-fit: cover; }
    :deep(.ant-card-meta-title) { font-size: 16px; font-weight: 500; color: @text-color-base; white-space: normal; min-height: 44px; }
    :deep(.ant-card-meta-description) { font-size: 13px; color: @text-color-secondary; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; min-height: 60px; }
    .report-date { margin-top: @spacing-sm; font-size: 12px; color: lighten(@text-color-secondary, 20%); text-align: right; }
  }
}

// Generic container style - Ensure this is defined in your global styles or _mixins.less
// .container {
//   max-width: @content-max-width; // e.g., 1200px
//   margin-left: auto;
//   margin-right: auto;
//   padding-left: @spacing-md; // e.g., 16px
//   padding-right: @spacing-md;
// }

.carousel-trends-combined-section {
  padding: 30px 0; // Overall padding for the section
  background-color: #f9f9fa; // Light gray background for this entire block

  .columns-wrapper {
    display: flex;
    gap: 30px; // Space between carousel and trends list
  }

  .carousel-column {
    flex: 0 0 60%; // Carousel takes ~60% width
    // border: 1px solid #ddd; // Optional: for debugging layout
    position: relative; // For absolute positioning of arrows if needed
    overflow: hidden; // Ensures arrows don't overflow if they are large

    .carousel-slide-refined {
      height: 380px; // Adjust height to match design proportions
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .carousel-caption-refined-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.65); // Solid dark overlay for caption
      padding: 12px 20px;
    }
    .carousel-caption-refined {
      color: @text-color-light;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
    }

    :deep(.custom-slick-arrow) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2; // Above slide content
      width: 36px; // Arrow background size
      height: 36px;
      background-color: rgba(0, 0, 0, 0.35); // Darker, semi-transparent
      border-radius: 50%;
      display: flex !important;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s ease;

      span { // The arrow character itself
        color: white;
        font-size: 20px;
        font-weight: bold;
        line-height: 1;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.55);
      }
    }
    :deep(.custom-slick-prev) { left: 15px; } // Position inside the carousel
    :deep(.custom-slick-next) { right: 15px; }
  }

  .trends-column {
    flex: 1; // Trends list takes remaining space
    // border: 1px solid #ddd; // Optional: for debugging layout
    display: flex;
    flex-direction: column;

    .section-header-trends-column {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      margin-bottom: 15px; // Space before the list starts
      border-bottom: 1px solid #e8e8e8;

      &::before { // Red vertical bar
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px; // Adjusted height
        background-color: @primary-color;
        margin-right: 10px;
      }
      .section-title-main { font-size: 18px; font-weight: 600; color: @text-color-base; margin: 0; }
      .section-subtitle-main { font-size: 12px; color: #aaa; margin-left: 8px; text-transform: uppercase; position: relative; top: 1px;}
      .more-link-main { margin-left: auto; color: #888; font-size: 13px; padding: 0; &:hover { color: @primary-color; } }
    }

    .trends-list-content {
      flex-grow: 1; // Allows list to fill available vertical space if column is taller
      overflow-y: auto; // If list becomes too long
    }

    .trend-item-column {
      display: flex;
      justify-content: space-between;
      align-items: flex-start; // Align date to top if content wraps
      padding: 10px 0 !important;
      border-bottom: 1px dotted #e0e0e0;
      &:last-child { border-bottom: none; }

      .trend-item-content-wrapper {
        flex-grow: 1;
        margin-right: 15px; // Space before date
      }

      .trend-title-link-column { text-decoration: none; }
      .trend-title-column {
        color: #333;
        font-size: 15px;
        font-weight: 500; // Slightly bolder than description
        line-height: 1.4;
        margin-bottom: 4px; // Space between title and description
        &:hover { color: @primary-color; }
      }
      .trend-description-column {
        font-size: 12px;
        color: #777; // Description color
        line-height: 1.5;
        // For multiline ellipsis (optional, can be tricky with dynamic height)
        display: -webkit-box;
        -webkit-line-clamp: 2; // Show 2 lines of description
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: 2.8em; // Approx 2 lines height to maintain spacing
      }
      .trend-date-column {
        color: #999;
        font-size: 13px;
        white-space: nowrap;
        padding-top: 2px; // Align with first line of title roughly
      }
    }
  }
}
</style>