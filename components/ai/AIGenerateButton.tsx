'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AIGenerationModal, AIGenerationRequest } from './AIGenerationModal'
import { cn } from '@/lib/utils'
import { Sparkles, Wand2, Brain, Zap } from 'lucide-react'

interface AIGenerateButtonProps {
  type: 'description' | 'requirements' | 'timeline' | 'budget' | 'complete'
  context: AIGenerationRequest['context']
  onGenerated: (content: string) => void
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  disabled?: boolean
  showBeta?: boolean
}

export function AIGenerateButton({
  type,
  context,
  onGenerated,
  className,
  variant = 'outline',
  size = 'sm',
  disabled = false,
  showBeta = true
}: AIGenerateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getButtonText = () => {
    switch (type) {
      case 'description': return 'Generate Description'
      case 'requirements': return 'Generate Requirements'
      case 'timeline': return 'Generate Timeline'
      case 'budget': return 'Generate Budget'
      case 'complete': return 'Generate Complete Proposal'
      default: return 'Generate with AI'
    }
  }

  const getTooltipText = () => {
    switch (type) {
      case 'description': return 'AI will create a compelling project description based on your project details'
      case 'requirements': return 'AI will generate comprehensive technical and business requirements'
      case 'timeline': return 'AI will create a detailed project timeline with phases and milestones'
      case 'budget': return 'AI will provide a professional budget breakdown with cost estimates'
      case 'complete': return 'AI will generate a complete proposal with all sections'
      default: return 'Use AI to generate content for this field'
    }
  }

  const request: AIGenerationRequest = {
    type,
    context,
    tone: 'professional',
    length: 'detailed'
  }

  const handleRegenerate = (newRequest: AIGenerationRequest) => {
    // The modal will handle regeneration internally
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={() => setIsModalOpen(true)}
              disabled={disabled}
              className={cn(
                "relative group transition-all duration-200",
                "hover:shadow-md hover:scale-105",
                "bg-gradient-to-r from-purple-light/10 to-blue-light/10",
                "hover:from-purple-light/20 hover:to-blue-light/20",
                "border-purple-light/30 hover:border-purple-light/50",
                className
              )}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-purple-light" />
                  <div className="absolute inset-0 w-4 h-4 text-purple-light animate-pulse opacity-50">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <span className="font-medium">
                  {size === 'sm' ? 'AI Generate' : getButtonText()}
                </span>
                {showBeta && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-xs bg-gradient-to-r from-purple-light to-blue-light text-white border-0"
                  >
                    BETA
                  </Badge>
                )}
              </div>
              
              {/* Animated background effect */}
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-light/0 via-purple-light/5 to-blue-light/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-light" />
                <span className="font-medium">AI Content Generation</span>
              </div>
              <p className="text-sm">{getTooltipText()}</p>
              {showBeta && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Powered by advanced AI models</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AIGenerationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        request={request}
        onAccept={onGenerated}
        onRegenerate={handleRegenerate}
      />
    </>
  )
}