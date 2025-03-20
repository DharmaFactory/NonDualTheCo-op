import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  SystemState, 
  Layer, 
  Message, 
  ProcessedMessage, 
  DistilledMessage, 
  IntegratedMessage,
  Response,
  ProcessingStep
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// Initial state for the system
const initialState: SystemState = {
  layers: {},
  activeLayerId: '',
  processingStatus: 'idle',
  userSettings: {
    theme: 'light',
    distillationLevel: 'moderate',
    showProcessingDetails: false,
    autoSaveInterval: 30000, // 30 seconds
  }
};

// Action types for the reducer
type ActionType = 
  | { type: 'CREATE_LAYER'; payload: Omit<Layer, 'id' | 'conversationHistory' | 'isActive'> }
  | { type: 'DELETE_LAYER'; payload: { layerId: string } }
  | { type: 'SET_ACTIVE_LAYER'; payload: { layerId: string } }
  | { type: 'UPDATE_LAYER'; payload: { layerId: string; updates: Partial<Layer> } }
  | { type: 'ADD_MESSAGE'; payload: { content: string; sender: 'user' | 'system'; layerId: string } }
  | { type: 'PROCESS_MESSAGE'; payload: { messageId: string } }
  | { type: 'UPDATE_USER_SETTINGS'; payload: Partial<SystemState['userSettings']> }
  | { type: 'SET_PROCESSING_STATUS'; payload: 'idle' | 'processing' }
  | { type: 'LOAD_STATE'; payload: SystemState };

// Reducer function to handle state updates
const layerReducer = (state: SystemState, action: ActionType): SystemState => {
  switch (action.type) {
    case 'CREATE_LAYER': {
      const id = uuidv4();
      const newLayer: Layer = {
        id,
        level: action.payload.level,
        name: action.payload.name,
        systemPrompt: action.payload.systemPrompt,
        ragContext: action.payload.ragContext,
        conversationHistory: [],
        parentLayerId: action.payload.parentLayerId,
        childLayerIds: [],
        isActive: false
      };

      // Update parent layer's childLayerIds if parent exists
      const updatedLayers = { ...state.layers, [id]: newLayer };
      if (newLayer.parentLayerId && updatedLayers[newLayer.parentLayerId]) {
        updatedLayers[newLayer.parentLayerId] = {
          ...updatedLayers[newLayer.parentLayerId],
          childLayerIds: [
            ...updatedLayers[newLayer.parentLayerId].childLayerIds,
            id
          ]
        };
      }

      return {
        ...state,
        layers: updatedLayers,
        // If this is the first layer, make it active
        activeLayerId: state.activeLayerId || id
      };
    }

    case 'DELETE_LAYER': {
      const { layerId } = action.payload;
      const layerToDelete = state.layers[layerId];
      
      if (!layerToDelete) return state;

      // Create new layers object without the deleted layer
      const { [layerId]: _, ...remainingLayers } = state.layers;

      // Update parent's childLayerIds if parent exists
      if (layerToDelete.parentLayerId && remainingLayers[layerToDelete.parentLayerId]) {
        remainingLayers[layerToDelete.parentLayerId] = {
          ...remainingLayers[layerToDelete.parentLayerId],
          childLayerIds: remainingLayers[layerToDelete.parentLayerId].childLayerIds
            .filter(id => id !== layerId)
        };
      }

      // Reassign children to parent if they exist
      layerToDelete.childLayerIds.forEach(childId => {
        if (remainingLayers[childId]) {
          remainingLayers[childId] = {
            ...remainingLayers[childId],
            parentLayerId: layerToDelete.parentLayerId
          };

          // Add child to new parent's childLayerIds
          if (layerToDelete.parentLayerId && remainingLayers[layerToDelete.parentLayerId]) {
            remainingLayers[layerToDelete.parentLayerId] = {
              ...remainingLayers[layerToDelete.parentLayerId],
              childLayerIds: [
                ...remainingLayers[layerToDelete.parentLayerId].childLayerIds,
                childId
              ]
            };
          }
        }
      });

      // Determine new active layer if the deleted layer was active
      let newActiveLayerId = state.activeLayerId;
      if (state.activeLayerId === layerId) {
        // Try to use parent, first child, or first available layer
        newActiveLayerId = layerToDelete.parentLayerId || 
                          layerToDelete.childLayerIds[0] || 
                          Object.keys(remainingLayers)[0] || 
                          '';
      }

      return {
        ...state,
        layers: remainingLayers,
        activeLayerId: newActiveLayerId
      };
    }

    case 'SET_ACTIVE_LAYER': {
      const { layerId } = action.payload;
      
      // Ensure the layer exists
      if (!state.layers[layerId]) return state;

      // Update all layers' isActive status
      const updatedLayers = Object.entries(state.layers).reduce(
        (acc, [id, layer]) => ({
          ...acc,
          [id]: {
            ...layer,
            isActive: id === layerId
          }
        }),
        {}
      );

      return {
        ...state,
        layers: updatedLayers,
        activeLayerId: layerId
      };
    }

    case 'UPDATE_LAYER': {
      const { layerId, updates } = action.payload;
      
      // Ensure the layer exists
      if (!state.layers[layerId]) return state;

      return {
        ...state,
        layers: {
          ...state.layers,
          [layerId]: {
            ...state.layers[layerId],
            ...updates
          }
        }
      };
    }

    case 'ADD_MESSAGE': {
      const { content, sender, layerId } = action.payload;
      
      // Ensure the layer exists
      if (!state.layers[layerId]) return state;

      const newMessage: Message = {
        id: uuidv4(),
        content,
        timestamp: Date.now(),
        sender,
        layerId,
        processingPath: []
      };

      return {
        ...state,
        layers: {
          ...state.layers,
          [layerId]: {
            ...state.layers[layerId],
            conversationHistory: [
              ...state.layers[layerId].conversationHistory,
              newMessage
            ]
          }
        }
      };
    }

    case 'PROCESS_MESSAGE': {
      // This would trigger the message processing flow
      // For now, we'll just set the processing status
      return {
        ...state,
        processingStatus: 'processing'
      };
    }

    case 'UPDATE_USER_SETTINGS': {
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload
        }
      };
    }

    case 'SET_PROCESSING_STATUS': {
      return {
        ...state,
        processingStatus: action.payload
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
};

// Create context
interface LayerContextType {
  state: SystemState;
  dispatch: React.Dispatch<ActionType>;
  createLayer: (layer: Omit<Layer, 'id' | 'conversationHistory' | 'isActive'>) => void;
  deleteLayer: (layerId: string) => void;
  setActiveLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  addMessage: (content: string, sender: 'user' | 'system', layerId: string) => void;
  processMessage: (messageId: string) => Promise<Response>;
  updateUserSettings: (settings: Partial<SystemState['userSettings']>) => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

// Provider component
export const LayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(layerReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('layeredPromptSystem');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem('layeredPromptSystem', JSON.stringify(state));
    }
  }, [state]);

  // Helper functions
  const createLayer = (layer: Omit<Layer, 'id' | 'conversationHistory' | 'isActive'>) => {
    dispatch({ type: 'CREATE_LAYER', payload: layer });
  };

  const deleteLayer = (layerId: string) => {
    dispatch({ type: 'DELETE_LAYER', payload: { layerId } });
  };

  const setActiveLayer = (layerId: string) => {
    dispatch({ type: 'SET_ACTIVE_LAYER', payload: { layerId } });
  };

  const updateLayer = (layerId: string, updates: Partial<Layer>) => {
    dispatch({ type: 'UPDATE_LAYER', payload: { layerId, updates } });
  };

  const addMessage = (content: string, sender: 'user' | 'system', layerId: string) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { content, sender, layerId } });
  };

  // This would be a more complex function in a real implementation
  const processMessage = async (messageId: string): Promise<Response> => {
    dispatch({ type: 'PROCESS_MESSAGE', payload: { messageId } });
    
    // Find the message
    let message: Message | undefined;
    let layerId: string = '';
    
    for (const layer of Object.values(state.layers)) {
      const found = layer.conversationHistory.find(m => m.id === messageId);
      if (found) {
        message = found;
        layerId = layer.id;
        break;
      }
    }
    
    if (!message || !layerId) {
      throw new Error('Message not found');
    }

    // Simulate message processing through layers
    // In a real implementation, this would involve:
    // 1. Propagating the message up through layers
    // 2. Processing at each layer
    // 3. Distilling outputs
    // 4. Integrating and generating a response

    // For demo purposes, we'll create a simple mock implementation
    const processedMessages: ProcessedMessage[] = [];
    const distilledMessages: DistilledMessage[] = [];
    
    // Get all layers above the current layer
    const currentLayer = state.layers[layerId];
    const layerHierarchy: Layer[] = [];
    
    let parentId = currentLayer.parentLayerId;
    while (parentId) {
      const parentLayer = state.layers[parentId];
      if (parentLayer) {
        layerHierarchy.push(parentLayer);
        parentId = parentLayer.parentLayerId;
      } else {
        break;
      }
    }
    
    // Process message through each layer in the hierarchy
    for (const layer of layerHierarchy) {
      // Simulate processing with the layer's system prompt
      const processedContent = `Processed by ${layer.name}: ${message.content}`;
      
      processedMessages.push({
        originalMessage: message,
        layerId: layer.id,
        processedContent
      });
      
      // Simulate distillation
      distilledMessages.push({
        originalMessageId: message.id,
        layerId: layer.id,
        distilledContent: `Distilled from ${layer.name}: Key insights from "${message.content}"`
      });
    }
    
    // Simulate integration and response generation
    const integratedMessage: IntegratedMessage = {
      originalMessage: message,
      distilledContexts: distilledMessages
    };
    
    // Create processing steps for the message
    const processingSteps: ProcessingStep[] = layerHierarchy.map(layer => ({
      layerId: layer.id,
      inputContent: message ? message.content : "",
      outputContent: `Processed by ${layer.name}: ${message ? message.content : ""}`,
      distilledContent: `Distilled from ${layer.name}: Key insights from "${message ? message.content : ""}"`,
      timestamp: Date.now(),
      processingMetadata: {}
    }));
    
    // Update the message's processing path
    const updatedLayers = { ...state.layers };
    const updatedHistory = updatedLayers[layerId].conversationHistory.map(m => 
      message && m.id === message.id 
        ? { ...m, processingPath: processingSteps } 
        : m
    );
    
    updatedLayers[layerId] = {
      ...updatedLayers[layerId],
      conversationHistory: updatedHistory
    };
    
    dispatch({ 
      type: 'UPDATE_LAYER', 
      payload: { 
        layerId, 
        updates: { conversationHistory: updatedHistory } 
      } 
    });
    
    // Generate response
    const responseContent = `Response based on analysis from multiple layers:
    
    Original query: "${message.content}"
    
    ${distilledMessages.map(dm => dm.distilledContent).join('\n\n')}
    
    Based on the above context and the system prompt at layer ${currentLayer.name}, here is the response...`;
    
    // Add the response to the conversation
    const responseId = uuidv4();
    addMessage(responseContent, 'system', layerId);
    
    // Set processing status back to idle
    dispatch({ type: 'SET_PROCESSING_STATUS', payload: 'idle' });
    
    return {
      id: responseId,
      content: responseContent,
      timestamp: Date.now(),
      relatedMessageId: message.id,
      processingDetails: processingSteps
    };
  };

  const updateUserSettings = (settings: Partial<SystemState['userSettings']>) => {
    dispatch({ type: 'UPDATE_USER_SETTINGS', payload: settings });
  };

  return (
    <LayerContext.Provider
      value={{
        state,
        dispatch,
        createLayer,
        deleteLayer,
        setActiveLayer,
        updateLayer,
        addMessage,
        processMessage,
        updateUserSettings
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};

// Custom hook to use the context
export const useLayer = () => {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error('useLayer must be used within a LayerProvider');
  }
  return context;
};
