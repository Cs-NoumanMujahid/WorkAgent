<template>
  <v-card rounded="xl" elevation="0" :style="{ backgroundColor: bgColor }">
    <v-card-text class="pa-4">
      <div class="d-flex align-center justify-space-between mb-2">
        <v-avatar :color="iconColor" size="48" rounded="lg">
          <v-icon :icon="icon" color="white" size="24" />
        </v-avatar>
      </div>
      <p class="text-h4 font-weight-bold ma-0 mb-1">{{ value }}</p>
      <p class="text-body-2 text-medium-emphasis ma-0">{{ label }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  value: number | string
  label: string
  icon: string
  bgColor: string
  iconColor: string
}>()
</script>