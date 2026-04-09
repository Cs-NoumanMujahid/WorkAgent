<template>
  <v-container fluid class="pa-6">
    <div class="mb-8 d-flex align-center justify-space-between">
      <div>
        <h1 class="text-h3 font-weight-bold mb-2">User Management</h1>
        <p class="text-body-1 text-medium-emphasis">View and manage system users and roles.</p>
      </div>
    </div>

    <AdminUserManagementTable
      :users="authStore.allUsers"
      @delete-user="openDeleteConfirm"
      @edit-user="openEditDialog"
      @add-user="openAddDialog"
      @query-change="handleQueryChange"
    />

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h5 font-weight-bold">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete user "<strong>{{ selectedUser?.fullName }}</strong>"? 
          This will permanently remove their account and local data.
        </v-card-text>
        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="handleDeleteUser">Delete User</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Role Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card v-if="selectedUser" rounded="xl" class="pa-6">
        <h2 class="text-h5 font-weight-bold mb-4">Edit User Role</h2>
        <div class="d-flex align-center ga-3 mb-6">
          <v-avatar size="48">
             <v-img v-if="selectedUser.avatar" :src="selectedUser.avatar" />
             <v-icon v-else icon="mdi-account" />
          </v-avatar>
          <div>
            <div class="font-weight-bold">{{ selectedUser.fullName }}</div>
            <div class="text-caption text-medium-emphasis">{{ selectedUser.email }}</div>
          </div>
        </div>

        <v-select
          v-model="editRole"
          :items="['user', 'admin']"
          label="Assigned Role"
          variant="outlined"
          rounded="lg"
        />

        <div class="d-flex justify-end ga-3 mt-4">
          <v-btn variant="text" rounded="lg" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" rounded="lg" @click="handleUpdateRole">Save Changes</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import type { User } from '~/shared/types/user'

definePageMeta({ middleware: 'admin' })

const authStore = useAuthStore()
const uiStore = useUiStore()

const deleteDialog = ref(false)
const editDialog = ref(false)
const selectedUser = ref<User | null>(null)
const editRole = ref<'user' | 'admin'>('user')

const query = reactive({
  q: '',
  role: 'All',
})

const handleQueryChange = async (payload: { q: string; role: string }) => {
  query.q = payload.q
  query.role = payload.role
  try {
    await authStore.fetchUsers({ q: query.q || undefined, role: query.role })
  } catch {
    uiStore.showSnackbar('Failed to load users.', 'error')
  }
}

onMounted(async () => {
  await authStore.fetchUsers()
})

const openDeleteConfirm = (user: User) => {
  selectedUser.value = user
  deleteDialog.value = true
}

const openEditDialog = (user: User) => {
  selectedUser.value = user
  editRole.value = user.role
  editDialog.value = true
}

const openAddDialog = () => {
  uiStore.showSnackbar('User creation is handled via registration flow in this demo.', 'info')
}

const handleDeleteUser = async () => {
  if (selectedUser.value) {
    try {
      await authStore.deleteUser(selectedUser.value.id)
      uiStore.showSnackbar('User removed from system.', 'success')
      deleteDialog.value = false
    } catch {
      uiStore.showSnackbar('Failed to delete user.', 'error')
    }
  }
}

const handleUpdateRole = async () => {
  if (selectedUser.value) {
    try {
      await authStore.updateUserRole(selectedUser.value.id, editRole.value)
      uiStore.showSnackbar(`Role updated to ${editRole.value}`, 'success')
      editDialog.value = false
    } catch {
      uiStore.showSnackbar('Failed to update role.', 'error')
    }
  }
}
</script>
