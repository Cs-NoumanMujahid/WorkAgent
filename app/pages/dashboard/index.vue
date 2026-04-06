<template>
  <div>
    
    <DashboardWelcomeBanner />

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="4" md="auto" style="flex: 1;">
        <DashboardStatCard
          :value="taskStore.totalTasks"
          label="Total Tasks"
          icon="mdi-format-list-bulleted"
          bg-color="#fff0f0"
          icon-color="#ef5350"
        />
      </v-col>
      <v-col cols="6" sm="4" md="auto" style="flex: 1;">
        <DashboardStatCard
          :value="taskStore.completedTasks"
          label="Completed"
          icon="mdi-checkbox-marked-circle"
          bg-color="#f0fff4"
          icon-color="#4caf50"
        />
      </v-col>
      <v-col cols="6" sm="4" md="auto" style="flex: 1;">
        <DashboardStatCard
          :value="taskStore.pendingTasks"
          label="Pending"
          icon="mdi-clock-outline"
          bg-color="#fffbf0"
          icon-color="#ff9800"
        />
      </v-col>
      <v-col cols="6" sm="4" md="auto" style="flex: 1;">
        <DashboardStatCard
          :value="taskStore.inProgressTasks"
          label="In Progress"
          icon="mdi-progress-clock"
          bg-color="#f0f4ff"
          icon-color="#2196f3"
        />
      </v-col>
      <v-col cols="6" sm="4" md="auto" style="flex: 1;">
        <DashboardStatCard
          :value="taskStore.overdueTasks"
          label="Overdue"
          icon="mdi-alert-circle-outline"
          bg-color="#fdf0ff"
          icon-color="#9c27b0"
        />
      </v-col>
    </v-row>

    <!-- Recent Tasks + Chart -->
    <v-row>
      <v-col cols="12" md="6">
        <DashboardRecentTasks />
      </v-col>
      <v-col cols="12" md="6">
        <DashboardTaskChart />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const taskStore = useTaskStore()
</script>