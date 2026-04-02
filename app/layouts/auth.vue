<template>
  <v-app>
    <v-main style="background-color: #f5f5f5;">
      <v-container fluid class="fill-height d-flex align-center justify-center">
        <v-card width="1100" elevation="3" rounded="lg" class="overflow-hidden">
          <v-row no-gutters>

            <!-- Left Panel - Form -->
            <v-col cols="12" md="6" class="d-flex align-center justify-center pa-8 pa-md-12">
              <slot />
            </v-col>

            <!-- Right Panel - Animation -->
            <v-col
              cols="12"
              md="6"
              class="d-none d-md-flex align-center justify-center pa-6"
            >
              <v-sheet
                rounded="lg"
                class="d-flex flex-column align-center justify-center pa-8 w-100"
                style="background-color: #f0fdf4; height: 100%;"
              >
                <Vue3Lottie
                  :animation-data="yogaAnimation"
                  :height="320"
                  :width="320"
                />
                <h2 class="text-h6 font-weight-bold text-center mt-6" style="color: #333;">
                  Make your work easier and organized with Task Manager
                </h2>
              </v-sheet>
            </v-col>

          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import yogaAnimation from '~/assets/animations/yoga.json'
</script>