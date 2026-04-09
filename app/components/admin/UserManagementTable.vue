<template>
  <v-card rounded="xl" elevation="0" border class="overflow-hidden">
    <!-- Table Header Tools -->
    <div class="pa-4 d-flex align-center justify-space-between border-b flex-wrap ga-3">
      <div class="d-flex align-center ga-3 flex-grow-1" style="max-width: 400px;">
        <v-text-field
          v-model="search"
          placeholder="Search users by name..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          clearable
        />
      </div>
      <div class="d-flex align-center ga-2">
        <v-select
          v-model="roleFilter"
          :items="roleOptions"
          label="Role"
          density="compact"
          variant="outlined"
          hide-details
          rounded="lg"
          style="width: 140px;"
        />
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      :search="search"
      class="bg-transparent"
      hover
    >
      <template #[`item.fullName`]="{ item }">
        <div class="d-flex align-center ga-3 py-2">
          <v-avatar size="32">
            <v-img v-if="item.avatar" :src="item.avatar" cover />
            <v-sheet
              v-else
              :color="getUserColor(item.fullName)"
              class="fill-height d-flex align-center justify-center text-white text-caption font-weight-bold"
            >
              {{ getInitials(item.fullName) }}
            </v-sheet>
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold">{{ item.fullName }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
          </div>
        </div>
      </template>

      <template #[`item.role`]="{ item }">
        <v-chip
          :color="item.role === 'admin' ? 'primary' : 'grey-lighten-2'"
          size="x-small"
          class="text-uppercase font-weight-bold"
          variant="flat"
        >
          {{ item.role }}
        </v-chip>
      </template>

      <template #[`item.createdAt`]="{ item }">
        <span class="text-caption text-medium-emphasis">
          {{ new Date(item.createdAt).toLocaleDateString() }}
        </span>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex ga-1">
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            size="small"
            color="medium-emphasis"
            @click="$emit('edit-user', item)"
          />
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            size="small"
            color="error"
            :disabled="isCurrentUser(item)"
            @click="$emit('delete-user', item)"
          />
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { User } from '~/shared/types/user'
const authStore = useAuthStore()

const props = defineProps<{
  users: User[]
}>()

const emit = defineEmits(['add-user', 'edit-user', 'delete-user', 'query-change'])

const search = ref('')
const roleFilter = ref('All')
const roleOptions = ['All', 'user', 'admin']

const headers = [
  { title: 'User / Email', key: 'fullName', align: 'start' as const },
  { title: 'Role', key: 'role', align: 'center' as const },
  { title: 'Joined Date', key: 'createdAt', align: 'start' as const },
  { title: 'Actions', key: 'actions', align: 'end' as const, sortable: false },
]

const filteredUsers = computed(() => {
  return props.users.filter(u => {
    const matchesSearch = !search.value || 
      u.fullName.toLowerCase().includes(search.value.toLowerCase())
    const matchesRole = roleFilter.value === 'All' || u.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

let queryTimer: any = null
const emitQuery = () => {
  emit('query-change', { q: search.value || '', role: roleFilter.value })
}

watch([search, roleFilter], () => {
  if (queryTimer) clearTimeout(queryTimer)
  queryTimer = setTimeout(() => {
    emitQuery()
  }, 250)
}, { immediate: true })

const isCurrentUser = (user: User) => user.id === authStore.user?.id

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const getUserColor = (name: string) => {
  const colors = ['#1867c0', '#5cbbff', '#4caf50', '#ff9800', '#f44336', '#9c27b0']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
</script>
