<template>
  <div class="avatar-group d-flex align-center">
    <v-tooltip
      v-for="(user, index) in limitedUsers"
      :key="user.id"
      :text="user.fullName"
      location="top"
    >
      <template #activator="{ props }">
        <v-avatar
          v-bind="props"
          :size="size"
          class="avatar-item border-2"
          :style="{ marginLeft: index === 0 ? '0' : '-12px', zIndex: max - index }"
          border
        >
          <v-img v-if="user.avatar" :src="user.avatar" cover />
          <v-sheet
            v-else
            :color="getUserColor(user.fullName)"
            class="fill-height d-flex align-center justify-center text-white font-weight-bold"
            :style="{ fontSize: `${size / 2.5}px` }"
          >
            {{ getInitials(user.fullName) }}
          </v-sheet>
        </v-avatar>
      </template>
    </v-tooltip>
    <v-avatar
      v-if="remainingCount > 0"
      :size="size"
      color="grey-lighten-3"
      class="avatar-item border-2"
      :style="{ marginLeft: '-12px', zIndex: 0 }"
    >
      <span class="text-caption font-weight-bold text-medium-emphasis">+{{ remainingCount }}</span>
    </v-avatar>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/shared/types/user'

const props = withDefaults(defineProps<{
  users: User[]
  max?: number
  size?: number
}>(), {
  max: 4,
  size: 32
})

const limitedUsers = computed(() => props.users.slice(0, props.max))
const remainingCount = computed(() => Math.max(0, props.users.length - props.max))

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getUserColor = (name: string) => {
  const colors = ['#1867c0', '#5cbbff', '#4caf50', '#ff9800', '#f44336', '#9c27b0']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
</script>

<style scoped>
.avatar-group {
  padding-left: 0;
}
.avatar-item {
  border: 2px solid white !important;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  user-select: none;
}
.avatar-item:hover {
  transform: translateY(-4px) scale(1.1);
  z-index: 100 !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>
