// Types for the Layered Prompt Stacking System

// Layer type definition
export interface Layer {
  id: string;
  level: number;
  name: string;
  systemPrompt: string;
  ragContext: RagContext;
  conversationHistory: Message[];
  parentLayerId: string | null;
  childLayerIds: string[];
  isActive: boolean;
}

// Message type definition
export interface Message {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'system';
  layerId: string;
  processingPath: ProcessingStep[];
}

// Processing step for tracking message flow through layers
export interface ProcessingStep {
  layerId: string;
  inputContent: string;
  outputContent: string;
  distilledContent: string;
  timestamp: number;
  processingMetadata: any;
}

// RAG context for layer-specific knowledge
export interface RagContext {
  id: string;
  name: string;
  content: string;
  metadata: {
    source: string;
    lastUpdated: number;
    tags: string[];
  };
}

// Global system state
export interface SystemState {
  layers: Record<string, Layer>;
  activeLayerId: string;
  processingStatus: 'idle' | 'processing';
  userSettings: UserSettings;
}

// User settings
export interface UserSettings {
  theme: 'light' | 'dark';
  distillationLevel: 'minimal' | 'moderate' | 'detailed';
  showProcessingDetails: boolean;
  autoSaveInterval: number;
}

// Processed message after going through layers
export interface ProcessedMessage {
  originalMessage: Message;
  layerId: string;
  processedContent: string;
}

// Distilled message for passing between layers
export interface DistilledMessage {
  originalMessageId: string;
  layerId: string;
  distilledContent: string;
}

// Integrated message combining original with distilled context
export interface IntegratedMessage {
  originalMessage: Message;
  distilledContexts: DistilledMessage[];
}

// Response from the system
export interface Response {
  id: string;
  content: string;
  timestamp: number;
  relatedMessageId: string;
  processingDetails: ProcessingStep[];
}
