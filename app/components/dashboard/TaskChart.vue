<template>
  <v-card rounded="xl" elevation="0" height="315">
    <v-card-text class="pa-5 h-100 d-flex flex-column">

      <div class="d-flex align-center justify-space-between mb-4">
        <p class="text-body-1 font-weight-bold ma-0">
          Task Distribution
        </p>

        <v-btn-toggle
          v-if="taskStore.tasks.length > 0"
          v-model="chartView"
          rounded="lg"
          density="compact"
          mandatory
          color="primary"
          variant="outlined"
        >
          <v-btn value="status" class="text-none" size="small">
            Status
          </v-btn>
          <v-btn value="priority" class="text-none" size="small">
            Priority
          </v-btn>
        </v-btn-toggle>
      </div>

  
      <div class="chart-wrapper flex-grow-1 d-flex align-center justify-center">
        <div v-if="taskStore.tasks.length === 0" class="text-center">
          <v-icon icon="mdi-chart-donut" size="48" color="grey-lighten-1" />
          <p class="text-body-2 text-medium-emphasis mt-2">Have you created a task yet?</p>
        </div>
        <apexchart
          v-else
          type="donut"
          height="220"
          width="100%"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>

    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const taskStore = useTaskStore()
const chartView = ref<'status' | 'priority'>('status')


const statusSeries = computed(() => [
  taskStore.completedTasks,
  taskStore.inProgressTasks,
  taskStore.pendingTasks,
  taskStore.overdueTasks,
])

const prioritySeries = computed(() => {
  const high = taskStore.tasks.filter(t => t.priority === 'high').length
  const medium = taskStore.tasks.filter(t => t.priority === 'medium').length
  const low = taskStore.tasks.filter(t => t.priority === 'low').length
  return [high, medium, low]
})

const chartSeries = computed(() =>
  chartView.value === 'status'
    ? statusSeries.value
    : prioritySeries.value
)


const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    redrawOnParentResize: false,
    redrawOnWindowResize: false,
    animations: {
      enabled: false, 
    },
  },

  labels:
    chartView.value === 'status'
      ? ['Completed', 'In Progress', 'Pending', 'Overdue']
      : ['High', 'Medium', 'Low'],

  colors:
    chartView.value === 'status'
      ? ['#000000', '#f44336', '#4caf50', '#ff9800']
      : ['#f44336', '#ff9800', '#4caf50'],

  legend: {
    position: 'bottom',
  },

  dataLabels: {
    enabled: false,
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
      },
    },
  },
}))
</script>

<style scoped>
.chart-wrapper {
  width: 100%;


  display: flex;
  align-items: center;
  justify-content: center;

}
</style>