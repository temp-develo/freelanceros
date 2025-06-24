'use client'

import OpenAI from 'openai'

// OpenAI client configuration
export class OpenAIClient {
  private client: OpenAI | null = null
  private isConfigured = false

  constructor() {
    this.initializeClient()
  }

  private initializeClient() {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
      console.warn('OpenAI API key not found. AI features will use fallback content.')
      return
    }

    try {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      })
      this.isConfigured = true
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error)
    }
  }

  public isAvailable(): boolean {
    return this.isConfigured && this.client !== null
  }

  public async generateCompletion(
    prompt: string,
    options: {
      model?: string
      maxTokens?: number
      temperature?: number
      systemPrompt?: string
    } = {}
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not available')
    }

    const {
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.7,
      systemPrompt = 'You are a professional freelance consultant helping to create high-quality project proposals.'
    } = options

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature,
        stream: false
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content generated from OpenAI')
      }

      return content.trim()
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }

  public async generateStreamCompletion(
    prompt: string,
    options: {
      model?: string
      maxTokens?: number
      temperature?: number
      systemPrompt?: string
      onChunk?: (chunk: string) => void
    } = {}
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not available')
    }

    const {
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.7,
      systemPrompt = 'You are a professional freelance consultant helping to create high-quality project proposals.',
      onChunk
    } = options

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature,
        stream: true
      })

      let fullContent = ''

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          fullContent += content
          onChunk?.(content)
        }
      }

      return fullContent.trim()
    } catch (error) {
      console.error('OpenAI streaming error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const openaiClient = new OpenAIClient()