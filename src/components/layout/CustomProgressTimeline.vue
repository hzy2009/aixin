<template>
  <div class="status-timeline-container-wrapper">
    <div class="timeline-section-header" v-if="showTitle">
      <h3 class="timeline-main-title">状态跟踪</h3>
    </div>
    <div class="timeline-horizontal-scroll">
      <div class="status-timeline-track">
        <div
          v-for="(step, index) in formattedSteps"
          :key="step.operateCode || index"
          :class="['timeline-milestone', {
            'is-completed': step.isCompleted,
            'is-active': step.isActive,
            'is-first': index === 0,
            'is-last': index === formattedSteps.length - 1
          }]"
         
        >
          <!-- The dot -->
          <div class="milestone-dot-anchor">
            <div class="milestone-dot"></div>
          </div>

          <!-- The line connecting to the NEXT dot (if not the last step) -->
          <div
            class="milestone-connector-line"
            v-if="index < formattedSteps.length - 1"
          ></div>

          <!-- Text content below the dot -->
          <div class="milestone-label-content">
            <div class="milestone-title">{{ step.operateName }}</div>
            <div v-if="step.displayDate" class="milestone-date">{{ step.displayDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  progressList: {
    type: Array,
    required: true,
    default: () => []
  },
  showTitle: {
    type: Boolean,
    default: false // Defaulting to false as per the minimal image
  },
  stepWidth: { // Prop to control the minimum width of each step area
    type: Number,
    default: 120 // Adjust as needed based on longest text
  }
});

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return null;
  try {
    const date = new Date(dateTimeString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  } catch (e) { return null; }
};
const formatFutureDate = (dateString) => dateString || null;

const formattedSteps = computed(() => {
  let lastCompletedIndex = -1;
  for (let i = props.progressList.length - 1; i >= 0; i--) {
    if (props.progressList[i].id !== null && props.progressList[i].createTime !== null) {
      lastCompletedIndex = i;
      break;
    }
  }
  return props.progressList.map((step, index) => {
    const isCompletedOrActive = index <= lastCompletedIndex;
    const isActive = index === lastCompletedIndex;
    return {
      ...step,
      displayDate: step.createTime ? formatDate(step.createTime) : (step.futureDate ? formatFutureDate(step.futureDate) : null),
      isCompleted: isCompletedOrActive,
      isActive: isActive,
    };
  });
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// Variables for precise styling
@dot-size-final: 26px;
@line-thickness-final: 2px;
@inactive-color-final: #E8E8E8;

@title-active-final: @primary-color;
@title-inactive-final: #666666; // Darker gray for inactive titles
@date-active-final: @primary-color;
@date-inactive-final: #999999; // Lighter gray for inactive dates

.status-timeline-container-wrapper {
  width: 100%;
  max-width: @content-max-width; // Apply max-width here for the "版心"
  margin: 0 auto; // Center the container
  padding: @spacing-md 0; // Some vertical padding for the whole component
}

.timeline-section-header {
  margin-bottom: 30px;
  padding-left: @spacing-xs; // Slight indent for title if needed
  .timeline-main-title {
    font-size: 16px;
    font-weight: 500;
    color: @text-color-base;
    display: inline-block;
    position: relative;
    padding-bottom: 6px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: @primary-color;
    }
  }
}

.timeline-horizontal-scroll {
  width: 100%;
  overflow-x: auto; // Enable horizontal scrolling if content overflows
  padding-bottom: @spacing-sm; // For scrollbar visibility
}

.status-timeline-track {
  display: inline-flex; // Use inline-flex so it only takes width of its content
  align-items: flex-start; // Align nodes at their top
  position: relative; // For the overall line structure
  min-width: 100%; // Ensure it tries to take available space before scrolling
}

.timeline-milestone {
  flex:1;
  position: relative; // For absolute positioning of the connector line
  display: flex;
  flex-direction: column;
  align-items: flex-start; // KEY: Dot and text are left-aligned within this node
  padding-right: @spacing-md; // Space to the right of each node (except last)
                               // This space is where the line to the next node will visually sit.

  &:last-child {
    flex:0.2;
    padding-right: 0; // No padding for the last item
    .milestone-connector-line {
      display: none; // No line after the last dot
    }
  }

  .milestone-dot-anchor {
    height: @dot-size-final; // Defines the vertical line for dot and line
    display: flex; // To help center dot if needed, but dot is at start
    align-items: center;
    margin-bottom: 20px; // Space between dot and title text
    position: relative; // For the dot itself
  }

  .milestone-dot {
    width: @dot-size-final;
    height: @dot-size-final;
    background-color: @inactive-color-final;
    border-radius: 50%;
    position: relative; // For z-index
    z-index: 2; // Dot above line
  }

  .milestone-connector-line {
    position: absolute;
    height: @line-thickness-final;
    background-color: @inactive-color-final;
    // Starts from the center of the current dot and extends rightwards
    left: (@dot-size-final / 2); // Start from the center of the current dot
    // Width should be calculated to reach the center of the next dot.
    // This is tricky with dynamic stepWidth. Let's make it span the padding-right of the node.
    // width: 100%; // This will span the *entire* milestone node's width
    // Instead, make it span towards the next node.
    // The line actually belongs "between" nodes.
    // This line connects the CURRENT dot to the NEXT dot.
    top: (@dot-size-final / 2) - (@line-thickness-final / 2); // Vertically center
    width: calc(100% - (@dot-size-final / 2)); // Span from current dot center to right edge of node space
                                               // The next node's dot will align with this line's end
    z-index: 1; // Line behind dot
  }


  .milestone-label-content {
    text-align: left; // Explicitly left-align text
  }

  .milestone-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0px;

    color: @title-inactive-final;
    margin-bottom: 2px;
    white-space: nowrap;
  }

  .milestone-date {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    line-height: 22px;
    letter-spacing: 0px;
    color: @date-inactive-final;
    white-space: nowrap;
  }

  // Styling for completed/active states
  &.is-completed {
    .milestone-dot {
      background-color: @primary-color;
    }
    .milestone-title {
      color: @title-active-final;
    }
    .milestone-date {
      color: @date-active-final;
    }
    // If this step is completed, the line connecting it to the *next* step
    // should be red IF the next step is also completed OR this is the active step.
    // This means the .milestone-connector-line of a completed step is red.
    .milestone-connector-line {
      background-color: @primary-color;
    }
  }

  // If this is the active (last completed) step, its outgoing line should be gray
  // because it connects to an inactive step.
  &.is-active {
    .milestone-connector-line {
      background-color: @inactive-color-final;
    }
  }
}
</style>