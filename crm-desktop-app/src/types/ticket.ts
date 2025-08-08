export interface TicketField {
  name: string
  rawValue: string
}

export interface Ticket {
  id: string
  fields: TicketField[]
}

export interface TicketListResponse {
  recordList: {
    records: Ticket[]
    totalCount: number
    totalPages: number
  }
}

export interface CreateCommentInput {
  recordId: string
  comment: string
  module?: string
}

export interface CreateCommentResponse {
  createComment: {
    success: boolean
    message?: string
    id?: string
  }
}