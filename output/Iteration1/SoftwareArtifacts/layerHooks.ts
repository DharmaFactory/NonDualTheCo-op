import { useEffect, useState } from 'react';
import { Layer, Message } from '../types';
import { useLayer } from '../context/LayerContext';

/**
 * Custom hook for managing the active layer
 * @returns Object with active layer data and functions to manipulate it
 */
export const useActiveLayer = () => {
  const { state, setActiveLayer } = useLayer();
  const activeLayer = state.layers[state.activeLayerId];
  
  const changeActiveLayer = (layerId: string) => {
    setActiveLayer(layerId);
  };
  
  return {
    activeLayer,
    activeLayerId: state.activeLayerId,
    changeActiveLayer
  };
};

/**
 * Custom hook for managing layer hierarchy
 * @returns Object with layer hierarchy data and navigation functions
 */
export const useLayerHierarchy = () => {
  const { state } = useLayer();
  const [layerHierarchy, setLayerHierarchy] = useState<Layer[]>([]);
  
  useEffect(() => {
    // Build layer hierarchy
    const layers = Object.values(state.layers);
    
    // Find root layers (those with no parent)
    const rootLayers = layers.filter(layer => !layer.parentLayerId);
    
    // Sort by level
    const sortedLayers = [...layers].sort((a, b) => a.level - b.level);
    
    setLayerHierarchy(sortedLayers);
  }, [state.layers]);
  
  const getChildLayers = (layerId: string): Layer[] => {
    return Object.values(state.layers).filter(layer => 
      layer.parentLayerId === layerId
    );
  };
  
  const getParentLayer = (layerId: string): Layer | null => {
    const layer = state.layers[layerId];
    return layer && layer.parentLayerId ? state.layers[layer.parentLayerId] : null;
  };
  
  const getLayerPath = (layerId: string): Layer[] => {
    const path: Layer[] = [];
    let currentId = layerId;
    
    while (currentId) {
      const layer = state.layers[currentId];
      if (!layer) break;
      
      path.unshift(layer); // Add to beginning of array
      currentId = layer.parentLayerId || '';
    }
    
    return path;
  };
  
  return {
    layerHierarchy,
    getChildLayers,
    getParentLayer,
    getLayerPath
  };
};

/**
 * Custom hook for managing conversation in the active layer
 * @returns Object with conversation data and functions
 */
export const useConversation = () => {
  const { state, addMessage, processMessage } = useLayer();
  const { activeLayer } = useActiveLayer();
  
  const conversation = activeLayer ? activeLayer.conversationHistory : [];
  
  const sendMessage = async (content: string) => {
    if (!activeLayer) return;
    
    // Add user message
    addMessage(content, 'user', activeLayer.id);
    
    // Find the message we just added
    const userMessage = activeLayer.conversationHistory[activeLayer.conversationHistory.length - 1];
    
    // Process the message
    if (userMessage) {
      await processMessage(userMessage.id);
    }
  };
  
  const getMessageById = (messageId: string): Message | undefined => {
    for (const layer of Object.values(state.layers)) {
      const message = layer.conversationHistory.find(m => m.id === messageId);
      if (message) return message;
    }
    return undefined;
  };
  
  return {
    conversation,
    sendMessage,
    getMessageById
  };
};

/**
 * Custom hook for managing layer configuration
 * @returns Object with configuration functions
 */
export const useLayerConfig = () => {
  const { createLayer, updateLayer, deleteLayer } = useLayer();
  
  const createNewLayer = (
    name: string,
    systemPrompt: string,
    level: number,
    parentLayerId: string | null
  ) => {
    createLayer({
      name,
      systemPrompt,
      level,
      parentLayerId,
      ragContext: {
        id: '',
        name: '',
        content: '',
        metadata: {
          source: '',
          lastUpdated: Date.now(),
          tags: []
        }
      },
      childLayerIds: []
    });
  };
  
  const updateLayerConfig = (
    layerId: string,
    updates: {
      name?: string;
      systemPrompt?: string;
      ragContext?: {
        content: string;
        name?: string;
      }
    }
  ) => {
    const layerUpdates: Partial<Layer> = {};
    
    if (updates.name) {
      layerUpdates.name = updates.name;
    }
    
    if (updates.systemPrompt) {
      layerUpdates.systemPrompt = updates.systemPrompt;
    }
    
    if (updates.ragContext) {
      layerUpdates.ragContext = {
        id: '',
        name: updates.ragContext.name || 'Custom Context',
        content: updates.ragContext.content,
        metadata: {
          source: 'user',
          lastUpdated: Date.now(),
          tags: []
        }
      };
    }
    
    updateLayer(layerId, layerUpdates);
  };
  
  return {
    createNewLayer,
    updateLayerConfig,
    deleteLayer
  };
};

/**
 * Custom hook for managing user settings
 * @returns Object with settings data and update function
 */
export const useSettings = () => {
  const { state, updateUserSettings } = useLayer();
  
  return {
    settings: state.userSettings,
    updateSettings: updateUserSettings
  };
};
