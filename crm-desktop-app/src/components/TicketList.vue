<template>
  <v-container class="main-container">
    <v-row>
      <v-col>
        <v-card class="berry-card-hover">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Tickets</span>
            <div class="d-flex gap-2">
              <v-select
                v-model="selectedModule"
                :items="modulesWithLocalizedLabels"
                item-title="localizedLabel"
                item-value="name"
                label="Module"
                @update:model-value="loadTickets"
                density="compact"
                style="min-width: 200px;"
              />
              <v-btn
                @click="loadTickets"
                :loading="loading"
                color="primary"
                variant="elevated"
                class="berry-gradient"
              >
                <v-icon>mdi-refresh</v-icon>
                Refresh
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <!-- Desktop/Tablet Table View -->
            <div class="d-none d-md-block">
              <v-data-table
                :items="tickets"
                :headers="headers"
                :loading="loading"
                loading-text="Loading tickets..."
                no-data-text="No tickets found"
                :items-per-page="10"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ getFieldValue(item, 'ticket_no') || item.id }}</td>
                    <td>{{ getFieldValue(item, 'ticket_title') || getFieldValue(item, 'title') }}</td>
                    <td>
                      <v-chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        class="font-weight-medium"
                      >
                        {{ getModuleLabel(selectedModule) }}
                      </v-chip>
                    </td>
                    <td>{{ getFieldValue(item, 'ticketstatus') || getFieldValue(item, 'status') }}</td>
                    <td>{{ getFieldValue(item, 'ticketpriorities') || getFieldValue(item, 'priority') }}</td>
                    <td>{{ getFieldValue(item, 'assigned_user_id') || getFieldValue(item, 'assigned_user') }}</td>
                    <td>{{ getFieldValue(item, 'createdtime') || getFieldValue(item, 'created_time') }}</td>
                    <td>
                      <div class="d-flex gap-1">
                        <v-btn
                          size="small"
                          variant="text"
                          color="primary"
                          @click="viewTicket(item)"
                        >
                          <v-icon>mdi-eye</v-icon>
                          View
                        </v-btn>
                        <v-btn
                          size="small"
                          variant="text"
                          color="green"
                          @click="addComment(item)"
                        >
                          <v-icon>mdi-comment-plus</v-icon>
                          Comment
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </div>

            <!-- Mobile/Small Tablet Card View -->
            <div class="d-block d-md-none">
              <!-- Loading state for mobile -->
              <div v-if="loading" class="text-center py-8">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                />
                <div class="mt-4">Loading tickets...</div>
              </div>

              <!-- No data state for mobile -->
              <div v-else-if="tickets.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-ticket-outline</v-icon>
                <div class="mt-4 text-grey">No tickets found</div>
              </div>

              <!-- Mobile card layout -->
              <div v-else class="ticket-cards">
                <v-card
                  v-for="ticket in tickets"
                  :key="ticket.id"
                  class="ticket-card mb-3 berry-card-hover"
                  variant="elevated"
                  hover
                >
                  <v-card-text class="pb-2">
                    <!-- Header row with ticket number and status -->
                    <div class="d-flex justify-space-between align-center mb-2">
                      <div class="ticket-number">
                        <v-chip size="small" color="primary" variant="outlined">
                          #{{ getFieldValue(ticket, 'ticket_no') || ticket.id }}
                        </v-chip>
                      </div>
                      <div class="ticket-status">
                        <v-chip
                          size="small"
                          :color="getStatusColor(getFieldValue(ticket, 'ticketstatus') || getFieldValue(ticket, 'status'))"
                          variant="flat"
                        >
                          {{ getFieldValue(ticket, 'ticketstatus') || getFieldValue(ticket, 'status') }}
                        </v-chip>
                      </div>
                    </div>

                    <!-- Module info row -->
                    <div class="d-flex align-center mb-2">
                      <v-chip
                        size="small"
                        color="secondary"
                        variant="outlined"
                        class="font-weight-medium"
                      >
                        <v-icon start size="small">mdi-view-module</v-icon>
                        {{ getModuleLabel(selectedModule) }}
                      </v-chip>
                    </div>

                    <!-- Ticket title -->
                    <div class="ticket-title mb-2">
                      <strong>{{ getFieldValue(ticket, 'ticket_title') || getFieldValue(ticket, 'title') }}</strong>
                    </div>

                    <!-- Ticket details -->
                    <div class="ticket-details">
                      <div class="detail-row mb-1">
                        <v-icon size="small" class="mr-2">mdi-flag</v-icon>
                        <span class="detail-label">Priority:</span>
                        <span class="detail-value">{{ getFieldValue(ticket, 'ticketpriorities') || getFieldValue(ticket, 'priority') || '-' }}</span>
                      </div>
                      <div class="detail-row mb-1">
                        <v-icon size="small" class="mr-2">mdi-account</v-icon>
                        <span class="detail-label">Assigned:</span>
                        <span class="detail-value">{{ getFieldValue(ticket, 'assigned_user_id') || getFieldValue(ticket, 'assigned_user') || '-' }}</span>
                      </div>
                      <div class="detail-row mb-2">
                        <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                        <span class="detail-label">Created:</span>
                        <span class="detail-value">{{ formatDate(getFieldValue(ticket, 'createdtime') || getFieldValue(ticket, 'created_time')) }}</span>
                      </div>
                    </div>
                  </v-card-text>

                  <!-- Actions -->
                  <v-card-actions class="pt-0">
                    <v-btn
                      size="small"
                      color="primary"
                      variant="elevated"
                      @click="viewTicket(ticket)"
                      class="mr-2"
                    >
                      <v-icon size="small" class="mr-1">mdi-eye</v-icon>
                      View
                    </v-btn>
                    <v-btn
                      size="small"
                      color="success"
                      variant="outlined"
                      @click="addComment(ticket)"
                    >
                      <v-icon size="small" class="mr-1">mdi-comment-plus</v-icon>
                      Comment
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <!-- Add Comment Dialog -->
    <v-dialog v-model="showCommentDialog" max-width="600">
      <v-card v-if="commentTicket" class="berry-card-hover">
        <v-card-title>
          Add Comment to Ticket {{ getFieldValue(commentTicket, 'ticket_no') || commentTicket.id }}
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <label class="text-body-2 text-medium-emphasis mb-2 d-block">Comment</label>
            <QuillEditor
              v-model:content="newComment"
              content-type="html"
              :options="quillOptions"
              style="height: 200px"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeCommentDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="elevated"
            @click="saveComment"
            :loading="savingComment"
            :disabled="!isCommentValid"
            class="berry-gradient-success"
          >
            Save Comment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      :timeout="5000"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- CRM Detail Modal -->
    <v-dialog 
      v-model="showCrmModal" 
      max-width="1200" 
      max-height="800"
      scrollable
    >
      <v-card class="berry-card-hover">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>CRM Ticket Details</span>
          <div class="d-flex gap-2">
            <v-btn
              icon="mdi-open-in-new"
              variant="text"
              size="small"
              @click="openCrmExternal"
              title="Open in Browser"
            />
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="closeCrmModal"
            />
          </div>
        </v-card-title>
        
        <v-card-text class="pa-0">
          <div class="crm-iframe-container">
            <iframe
              v-if="crmUrl"
              :src="crmUrl"
              class="crm-modal-iframe"
              frameborder="0"
              title="CRM Ticket Detail"
            />
            <div v-else class="iframe-loading">
              <v-progress-circular indeterminate color="primary" />
              <div class="mt-4">Loading CRM...</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { graphqlService } from '../services/graphql'
import { authService } from '../services/auth'
import type { Ticket } from '../types/ticket'

const tickets = ref<Ticket[]>([])
const modules = ref<Array<{ name: string, label: string }>>([])
const selectedModule = ref('HelpDesk')
const languageStrings = ref<Record<string, string>>({})
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const showCommentDialog = ref(false)
const commentTicket = ref<Ticket | null>(null)
const newComment = ref('')
const savingComment = ref(false)

// CRM detail modal state
const showCrmModal = ref(false)
const crmUrl = ref('')

const quillOptions = {
  theme: 'snow',
  placeholder: 'Enter your comment here...',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['blockquote', 'code-block'],
      ['clean']
    ]
  }
}

const isCommentValid = computed(() => {
  if (!newComment.value) return false
  // Remove HTML tags to check if there's actual content
  const textContent = newComment.value.replace(/<[^>]*>/g, '').trim()
  return textContent.length > 0
})

const modulesWithLocalizedLabels = computed(() => {
  return modules.value.map(module => ({
    name: module.name,
    label: module.label,
    localizedLabel: getModuleLabel(module.name)
  }))
})

const headers = [
  { title: 'Ticket No', key: 'ticket_no', sortable: true },
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Module', key: 'module', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Assigned To', key: 'assigned_user', sortable: true },
  { title: 'Created', key: 'created_time', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

const getFieldValue = (ticket: Ticket, fieldName: string): string => {
  const field = ticket.fields.find(f => f.name === fieldName)
  return field ? field.rawValue : ''
}

const getModuleLabel = (moduleName: string): string => {
  // First try from language strings
  if (languageStrings.value[moduleName]) {
    return languageStrings.value[moduleName]
  }
  
  // Fallback to modules list
  const module = modules.value.find(m => m.name === moduleName)
  return module ? module.label : moduleName
}

const getStatusColor = (status: string): string => {
  if (!status) return 'grey-500'
  
  const statusLower = status.toLowerCase()
  if (statusLower.includes('open') || statusLower.includes('new')) return 'info'
  if (statusLower.includes('closed') || statusLower.includes('resolved')) return 'success'
  if (statusLower.includes('pending') || statusLower.includes('wait')) return 'warning'
  if (statusLower.includes('urgent') || statusLower.includes('high')) return 'error'
  return 'secondary'
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const loadLanguages = async () => {
  try {
    const response = await graphqlService.getLanguages()
    // Convert array to key-value object for easier lookup
    languageStrings.value = response.languages.strings.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)
  } catch (error) {
    console.warn('Failed to load language strings:', error)
    // Non-blocking error, continue with default labels
  }
}

const loadModules = async () => {
  try {
    const response = await graphqlService.getModules()
    modules.value = response.modulesList.modules
  } catch (error) {
    console.error('Failed to load modules:', error)
    errorMessage.value = 'Failed to load modules'
    showError.value = true
  }
}

const loadTickets = async () => {
  loading.value = true
  try {
    const response = await graphqlService.getTickets(selectedModule.value)
    tickets.value = response.recordList.records
  } catch (error) {
    console.error('Failed to load tickets:', error)
    errorMessage.value = 'Failed to load tickets'
    showError.value = true
  } finally {
    loading.value = false
  }
}

const viewTicket = (ticket: Ticket) => {
  // Get the base URL from auth service
  const baseUrl = authService.getBaseUrl()
  
  // Construct the CRM detail page URL
  crmUrl.value = `${baseUrl}/index.php?module=${selectedModule.value}&view=Detail&record=${ticket.id}`
  
  // Open modal
  showCrmModal.value = true
}

const closeCrmModal = () => {
  showCrmModal.value = false
  crmUrl.value = ''
}

const openCrmExternal = () => {
  if (!crmUrl.value) return
  
  try {
    // Open in external browser
    if (window.require && typeof window.require === 'function') {
      // We're in Electron, use shell.openExternal
      const { shell } = window.require('electron')
      shell.openExternal(crmUrl.value)
        .then(() => console.log('Opened CRM detail page externally:', crmUrl.value))
        .catch((error: any) => {
          console.error('Failed to open external URL:', error)
          // Fallback to window.open if shell.openExternal fails
          window.open(crmUrl.value, '_blank')
        })
    } else {
      // Fallback for web browser
      window.open(crmUrl.value, '_blank')
    }
  } catch (error) {
    console.error('Error opening external URL:', error)
    errorMessage.value = 'Failed to open external link'
    showError.value = true
  }
}

const addComment = (ticket: Ticket) => {
  commentTicket.value = ticket
  newComment.value = ''
  showCommentDialog.value = true
}

const closeCommentDialog = () => {
  showCommentDialog.value = false
  commentTicket.value = null
  newComment.value = ''
}

const saveComment = async () => {
  if (!commentTicket.value || !isCommentValid.value) {
    return
  }

  savingComment.value = true
  try {
    const response = await graphqlService.createComment({
      recordId: commentTicket.value.id,
      comment: newComment.value, // Send HTML content as-is
      module: selectedModule.value
    })

    if (response.createComment.success) {
      errorMessage.value = 'Comment added successfully!'
      closeCommentDialog()
    } else {
      errorMessage.value = response.createComment.message || 'Failed to add comment'
    }
    showError.value = true
  } catch (error) {
    console.error('Failed to add comment:', error)
    errorMessage.value = `Failed to add comment: ${error.message || error}`
    showError.value = true
  } finally {
    savingComment.value = false
  }
}

onMounted(async () => {
  await authService.init()
  await loadLanguages()
  await loadModules()
  await loadTickets()
})
</script>

<style scoped>
/* Main container layout */
.main-container {
  position: relative;
}

/* Mobile card layout */
.ticket-cards {
  padding: 0;
}

.ticket-card {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.ticket-number {
  flex-shrink: 0;
}

.ticket-status {
  flex-shrink: 0;
}

.ticket-title {
  font-size: 16px;
  line-height: 1.4;
  color: #333;
}

.ticket-details {
  font-size: 14px;
}

.detail-row {
  display: flex;
  align-items: center;
  color: #666;
}

.detail-label {
  font-weight: 500;
  margin-right: 4px;
  min-width: 70px;
}

.detail-value {
  color: #333;
  flex: 1;
}

/* Responsive breakpoints */
@media (max-width: 600px) {
  .ticket-card {
    margin-bottom: 12px !important;
  }
}

/* Fix Quill list styling */
:deep(.ql-editor) {
  font-family: inherit;
  font-size: inherit;
}

:deep(.ql-editor ol) {
  padding-left: 1.5em;
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}

:deep(.ql-editor ul) {
  padding-left: 1.5em;
}

:deep(.ql-editor li) {
  list-style-type: none;
  padding-left: 0;
  position: relative;
}

:deep(.ql-editor ul > li::before) {
  content: '•';
  position: absolute;
  left: -1.2em;
  color: #666;
  font-weight: bold;
}

:deep(.ql-editor ol > li) {
  counter-increment: list-1;
}

:deep(.ql-editor ol > li::before) {
  content: counter(list-1, decimal) '.';
  position: absolute;
  left: -1.5em;
  color: #666;
  font-weight: bold;
}

:deep(.ql-editor ul[data-list=bullet] > li::before) {
  content: '•';
}

:deep(.ql-editor ol[data-list=ordered] > li::before) {
  content: counter(list-1, decimal) '.';
}

/* Fix blockquote styling */
:deep(.ql-editor blockquote) {
  border-left: 4px solid #ccc;
  margin-bottom: 5px;
  margin-top: 5px;
  padding-left: 16px;
}

/* Fix code block styling */
:deep(.ql-editor .ql-code-block-container) {
  background-color: #f5f5f5;
  border-radius: 3px;
  padding: 8px;
  font-family: monospace;
  margin: 5px 0;
}

/* CRM Modal Iframe Styling */
.crm-iframe-container {
  width: 100%;
  height: 600px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.crm-modal-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.iframe-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  background: #f8f9fe;
}
</style>