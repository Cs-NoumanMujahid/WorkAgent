<template>
  <v-container class="pa-6">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">Settings</h1>
      <p class="text-body-1 text-medium-emphasis">
        Personalize your workspace experience.
      </p>
    </div>

    <v-row>
      <v-col cols="12" md="8">
        <!-- Appearance Section -->
        <v-card rounded="xl" border elevation="0" class="pa-6 mb-6">
          <div class="d-flex align-center ga-3 mb-6">
            <v-icon icon="mdi-palette-outline" color="primary" size="large" />
            <h2 class="text-h5 font-weight-bold">Appearance</h2>
          </div>

          <div class="mb-6">
            <p class="text-subtitle-1 font-weight-bold mb-1">Application Background</p>
            <p class="text-body-2 text-medium-emphasis mb-4">Choose a background color for your workspace.</p>
            
            <div class="d-flex flex-wrap ga-3">
              <v-tooltip
                v-for="color in bgPresets"
                :key="color.value"
                :text="color.name"
                location="top"
              >
                <template #activator="{ props }">
                  <div
                    v-bind="props"
                    class="color-preset-circle cursor-pointer transition-swing"
                    :style="{ backgroundColor: color.value, border: uiStore.appBackground === color.value ? '3px solid #1867c0' : '1px solid #e0e0e0' }"
                    @click="uiStore.setAppBackground(color.value)"
                  >
                    <v-icon
                      v-if="uiStore.appBackground === color.value"
                      icon="mdi-check"
                      size="small"
                      :color="isDark(color.value) ? 'white' : 'black'"
                    />
                  </div>
                </template>
              </v-tooltip>
            </div>
          </div>
          
          <v-divider class="mb-6" />
          
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-subtitle-1 font-weight-bold mb-0">Custom Color</p>
              <p class="text-caption text-medium-emphasis ma-0">Set a specific hex code for your background.</p>
            </div>
            <v-menu :close-on-content-click="false">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="outlined"
                  rounded="lg"
                  prepend-icon="mdi-colorize"
                  class="text-none"
                >
                  Pick Color
                </v-btn>
              </template>
              <v-color-picker
                :model-value="uiStore.appBackground"
                @update:model-value="uiStore.setAppBackground"
                hide-inputs
                show-swatches
              />
            </v-menu>
          </div>
        </v-card>

        <!-- Other Settings Placeholder -->
        <v-card rounded="xl" border elevation="0" class="pa-6">
          <div class="d-flex align-center ga-3 mb-6">
            <v-icon icon="mdi-bell-outline" color="primary" size="large" />
            <h2 class="text-h5 font-weight-bold">Notifications</h2>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">Notification preferences will be available in a future update.</p>
          <v-btn variant="tonal" rounded="lg" disabled>Manage Notifications</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const uiStore = useUiStore()

const bgPresets = [
  { name: 'Default Light', value: '#f5f7fa' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Soft Blue', value: '#eef2ff' },
  { name: 'Mint Green', value: '#f0fdf4' },
  { name: 'Warm Sand', value: '#fafaf9' },
  { name: 'Lavender', value: '#f5f3ff' },
  { name: 'Dark Mode (Mock)', value: '#1e1e1e' },
]

const isDark = (hex: string) => {
  if (!hex || hex.length < 7) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}
</script>

<style scoped>
.color-preset-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-center: center;
  justify-content: center;
}
.color-preset-circle:hover {
  transform: scale(1.1);
}
.cursor-pointer {
  cursor: pointer;
}
</style>
