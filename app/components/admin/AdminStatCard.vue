<template>
  <v-card rounded="xl" elevation="0" border class="pa-4 h-100">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-avatar :color="`${color} lighten-5`" size="48" rounded="lg">
        <v-icon :icon="icon" :color="color" size="24" />
      </v-avatar>
      <v-chip v-if="trend" :color="trendColor" size="x-small" variant="tonal" class="font-weight-bold">
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </v-chip>
    </div>
    <div class="text-h4 font-weight-bold mb-1">{{ value }}</div>
    <div class="text-body-2 text-medium-emphasis">{{ label }}</div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  color: string
  trend?: number
}>()

const trendColor = computed(() => {
  return 'success' // Simplification
})
</script>
