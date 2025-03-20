import { 
  Message, 
  ProcessedMessage, 
  DistilledMessage, 
  IntegratedMessage,
  Layer,
  ProcessingStep,
  Response
} from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Propagates a message up through the layer hierarchy
 * @param message The original user message
 * @param layers All available layers
 * @param startLayerId The ID of the layer where the message originated
 * @returns Array of processed messages from each layer
 */
export const propagateMessageUp = (
  message: Message,
  layers: Record<string, Layer>,
  startLayerId: string
): ProcessedMessage[] => {
  const processedMessages: ProcessedMessage[] = [];
  const startLayer = layers[startLayerId];
  
  if (!startLayer) return processedMessages;
  
  // Get all layers above the current layer
  const layerHierarchy: Layer[] = [];
  
  let parentId = startLayer.parentLayerId;
  while (parentId) {
    const parentLayer = layers[parentId];
    if (parentLayer) {
      layerHierarchy.push(parentLayer);
      parentId = parentLayer.parentLayerId;
    } else {
      break;
    }
  }
  
  // Process message through each layer in the hierarchy
  for (const layer of layerHierarchy) {
    // In a real implementation, this would use the layer's system prompt
    // to process the message, potentially with an LLM API call
    const processedContent = processWithSystemPrompt(message.content, layer.systemPrompt);
    
    processedMessages.push({
      originalMessage: message,
      layerId: layer.id,
      processedContent
    });
  }
  
  return processedMessages;
};

/**
 * Distills processed messages into more compact form
 * @param processedMessages Array of processed messages from different layers
 * @param distillationLevel How much to compress the content
 * @returns Array of distilled messages
 */
export const distillMessages = (
  processedMessages: ProcessedMessage[],
  distillationLevel: 'minimal' | 'moderate' | 'detailed' = 'moderate'
): DistilledMessage[] => {
  return processedMessages.map(pm => {
    // In a real implementation, this would use more sophisticated
    // techniques to distill the content based on the distillation level
    let distilledContent = '';
    
    switch (distillationLevel) {
      case 'minimal':
        // Extract just the key points
        distilledContent = `Key insight from ${layers[pm.layerId]?.name || 'higher layer'}: ${extractKeyPoints(pm.processedContent)}`;
        break;
      case 'moderate':
        // Moderate compression
        distilledContent = `Context from ${layers[pm.layerId]?.name || 'higher layer'}: ${summarizeContent(pm.processedContent)}`;
        break;
      case 'detailed':
        // Light compression
        distilledContent = `Detailed analysis from ${layers[pm.layerId]?.name || 'higher layer'}: ${pm.processedContent}`;
        break;
    }
    
    return {
      originalMessageId: pm.originalMessage.id,
      layerId: pm.layerId,
      distilledContent
    };
  });
};

/**
 * Integrates the original message with distilled context from higher layers
 * @param originalMessage The user's original message
 * @param distilledMessages Distilled context from higher layers
 * @returns Integrated message ready for final processing
 */
export const integrateMessages = (
  originalMessage: Message,
  distilledMessages: DistilledMessage[]
): IntegratedMessage => {
  return {
    originalMessage,
    distilledContexts: distilledMessages
  };
};

/**
 * Generates a final response based on the integrated message and current layer
 * @param integratedMessage Message with context from higher layers
 * @param currentLayer The layer where the response will be generated
 * @returns Generated response
 */
export const generateResponse = (
  integratedMessage: IntegratedMessage,
  currentLayer: Layer
): Response => {
  // In a real implementation, this would use the layer's system prompt
  // and the integrated message to generate a response, potentially with an LLM API call
  
  const { originalMessage, distilledContexts } = integratedMessage;
  
  // Create processing steps record
  const processingSteps: ProcessingStep[] = distilledContexts.map(dc => ({
    layerId: dc.layerId,
    inputContent: originalMessage.content,
    outputContent: `Processed by layer ${dc.layerId}`,
    distilledContent: dc.distilledContent,
    timestamp: Date.now(),
    processingMetadata: {}
  }));
  
  // Generate response content
  const responseContent = `Response based on analysis from multiple layers:
  
  Original query: "${originalMessage.content}"
  
  ${distilledContexts.map(dc => dc.distilledContent).join('\n\n')}
  
  Based on the above context and the system prompt at layer ${currentLayer.name}, here is the response...`;
  
  return {
    id: uuidv4(),
    content: responseContent,
    timestamp: Date.now(),
    relatedMessageId: originalMessage.id,
    processingDetails: processingSteps
  };
};

/**
 * Process a message with a system prompt
 * @param messageContent The content to process
 * @param systemPrompt The system prompt to use
 * @returns Processed content
 */
const processWithSystemPrompt = (messageContent: string, systemPrompt: string): string => {
  // In a real implementation, this would call an LLM API
  // For now, we'll simulate processing
  return `Processed with system prompt "${systemPrompt.substring(0, 20)}...": ${messageContent}`;
};

/**
 * Extract key points from content (simplified implementation)
 * @param content The content to extract from
 * @returns Extracted key points
 */
const extractKeyPoints = (content: string): string => {
  // Simplified implementation
  return content.length > 100 ? content.substring(0, 100) + '...' : content;
};

/**
 * Summarize content (simplified implementation)
 * @param content The content to summarize
 * @returns Summarized content
 */
const summarizeContent = (content: string): string => {
  // Simplified implementation
  return content.length > 200 ? content.substring(0, 200) + '...' : content;
};

// Mock layers for the standalone utility functions
const layers: Record<string, Layer> = {};
