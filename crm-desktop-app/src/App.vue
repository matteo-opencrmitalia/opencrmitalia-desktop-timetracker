<template>
  <v-app>
    <v-app-bar
      :elevation="2"
      :title="'CRM Desktop App'"
    >
      <template v-slot:append>
        <!-- Theme Toggle Button -->
        <v-btn
          @click="toggleTheme"
          variant="text"
          :icon="isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          class="mr-2"
          :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        />
        
        <v-btn
          v-if="!isAuthenticated"
          @click="showLoginDialog = true"
          color="primary"
          variant="elevated"
          class="berry-gradient"
        >
          <v-icon start>mdi-login-variant</v-icon>
          Login
        </v-btn>
        <v-btn
          v-else
          @click="logout"
          color="error"
          variant="elevated"
          class="berry-gradient-error"
        >
          <v-icon start>mdi-power</v-icon>
          Logout
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container v-if="!isAuthenticated" class="d-flex justify-center align-center" style="min-height: 60vh;">
        <v-card width="400" elevation="8">
          <v-card-title class="text-center">
            <v-icon size="large" class="mb-2">mdi-account-key</v-icon>
            <br>
            Authentication Required
          </v-card-title>
          <v-card-text class="text-center">
            Please login to access the CRM system
          </v-card-text>
          <v-card-actions class="justify-center pb-4">
            <v-btn @click="showLoginDialog = true" color="primary" size="large">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>

      <div v-else>
        <TicketList />
      </div>
    </v-main>

    <!-- Login Dialog -->
    <v-dialog v-model="showLoginDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h5">CRM Login</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="loginForm.serverUrl"
              label="Server URL"
              placeholder="http://localhost:19080"
              required
              :rules="[v => !!v || 'Server URL is required']"
            />
            <v-text-field
              v-model="loginForm.username"
              label="Username"
              required
              :rules="[v => !!v || 'Username is required']"
            />
            <v-text-field
              v-model="loginForm.password"
              label="Password"
              type="password"
              required
              :rules="[v => !!v || 'Password is required']"
            />
            <v-checkbox
              v-model="loginForm.saveCredentials"
              label="Save credentials"
              color="primary"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="showLoginDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="handleLogin"
            :loading="isLogging"
          >
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading overlay -->
    <v-overlay v-model="isLogging" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
      <div class="mt-4 text-white">Authenticating...</div>
    </v-overlay>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import TicketList from './components/TicketList.vue'
import { authService } from './services/auth'
import type { LoginCredentials } from './types/auth'

// Theme management
const theme = useTheme()
const isDarkMode = ref(false)

const isAuthenticated = ref(false)
const showLoginDialog = ref(false)
const isLogging = ref(false)

const loginForm = ref<LoginCredentials & { saveCredentials: boolean }>({
  serverUrl: 'http://localhost:19080',
  username: '',
  password: '',
  saveCredentials: false
})

const handleLogin = async () => {
  isLogging.value = true
  try {
    const success = await authService.login(loginForm.value)
    if (success) {
      isAuthenticated.value = true
      showLoginDialog.value = false
      if (loginForm.value.saveCredentials) {
        await authService.saveCredentials(loginForm.value)
      }
    }
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLogging.value = false
  }
}

const logout = async () => {
  await authService.logout()
  isAuthenticated.value = false
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  theme.global.name.value = isDarkMode.value ? 'berry-dark' : 'berry'
  
  // Save theme preference to localStorage
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(async () => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    theme.global.name.value = 'berry-dark'
  } else {
    isDarkMode.value = false
    theme.global.name.value = 'berry'
  }
  
  const savedCredentials = await authService.getSavedCredentials()
  if (savedCredentials) {
    loginForm.value = { ...savedCredentials, saveCredentials: true }
    const success = await authService.login(savedCredentials)
    if (success) {
      isAuthenticated.value = true
    }
  }
})
</script>