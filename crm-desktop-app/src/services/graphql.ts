import { authService } from './auth'
import type { TicketListResponse, CreateCommentInput, CreateCommentResponse } from '../types/ticket'

class GraphQLService {
  private getEndpoint(): string {
    return `${authService.getBaseUrl()}/public/graphql/index.php`
  }

  private getHeaders(): Record<string, string> {
    const token = authService.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        query,
        ...(variables && { variables })
      })
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL query failed')
    }

    return data.data as T
  }

  async getTickets(module: string = 'HelpDesk'): Promise<TicketListResponse> {
    const query = `
      query RecordListQuery($module: String!) {
        recordList(module: $module) {
          records {
            id
            fields {
              name
              rawValue
            }
          }
          totalCount
          totalPages
        }
      }
    `

    return await this.query<TicketListResponse>(query, { module })
  }

  async getModules(): Promise<{ modulesList: { modules: Array<{ name: string, label: string }> } }> {
    const query = `
      query ModulesListQuery {
        modulesList {
          modules {
            name
            label
          }
        }
      }
    `

    return await this.query(query)
  }

  async getLanguages(): Promise<{ languages: { strings: Array<{ key: string, value: string }> } }> {
    const query = `
      query LanguagesQuery {
        languages {
          strings {
            key
            value
          }
        }
      }
    `

    return await this.query(query)
  }

  async getRecordDetail(crmid: number): Promise<any> {
    const query = `
      query RecordDetailQuery($crmid: Int!) {
        recordDetail(crmid: $crmid) {
          blocks {
            name
            fields {
              name
              label
              rawValue
              type
            }
          }
        }
      }
    `

    return await this.query(query, { crmid })
  }

  async getAvailableMutations(): Promise<any> {
    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          mutationType {
            name
            fields {
              name
              description
              args {
                name
                type {
                  name
                }
              }
            }
          }
        }
      }
    `

    try {
      return await this.query(introspectionQuery)
    } catch (error) {
      console.warn('Schema introspection not available:', error.message)
      return null
    }
  }

  async createComment(input: CreateCommentInput): Promise<CreateCommentResponse> {
    const mutation = `
      mutation CommentSaveMutation($relatedId: String!, $content: String!) {
        commentSave(
          comment: {
            content: $content
            relatedId: $relatedId
          }
        ) {
          comment {
            content
            attachments {
              id
              name
              mimetype
              size
              url
            }
          }
        }
      }
    `

    try {
      const response = await this.query<any>(mutation, {
        relatedId: input.recordId,
        content: input.comment
      })

      return {
        createComment: {
          success: !!response.commentSave?.comment,
          message: response.commentSave?.comment ? 'Comment added successfully' : 'Failed to add comment',
          id: response.commentSave?.comment?.id
        }
      }
    } catch (error) {
      console.error('CommentSave mutation failed:', error)
      throw new Error(`Failed to add comment: ${error.message}`)
    }
  }
}

export const graphqlService = new GraphQLService()