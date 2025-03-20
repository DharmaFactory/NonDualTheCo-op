import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/theme';
import { LayerProvider, useLayer } from './context/LayerContext';
import { useActiveLayer, useConversation, useLayerConfig, useLayerHierarchy } from './hooks/layerHooks';
import LayerNavigation from './components/LayerNavigation';
import ConversationInterface from './components/ConversationInterface';
import LayerConfigPanel from './components/LayerConfigPanel';
import ProcessingVisualization from './components/ProcessingVisualization';
import { Message, ProcessingStep } from './types';

const AppContent = () => {
  const { state } = useLayer();
  const { activeLayer, changeActiveLayer } = useActiveLayer();
  const { layerHierarchy } = useLayerHierarchy();
  const { conversation, sendMessage, getMessageById } = useConversation();
  const { createNewLayer, updateLayerConfig, deleteLayer } = useLayerConfig();
  
  const [showConfig, setShowConfig] = useState(false);
  const [showProcessingDetails, setShowProcessingDetails] = useState<{
    messageId: string;
    visible: boolean;
  }>({ messageId: '', visible: false });
  
  const handleAddLayer = () => {
    const newLayerLevel = activeLayer ? activeLayer.level + 1 : 0;
    const parentId = activeLayer ? activeLayer.id : null;
    
    createNewLayer(
      `Layer ${newLayerLevel + 1}`,
      `You are a helpful assistant at layer ${newLayerLevel + 1}.`,
      newLayerLevel,
      parentId
    );
    
    setShowConfig(true);
  };
  
  const handleSaveConfig = (updates: any) => {
    if (activeLayer) {
      updateLayerConfig(activeLayer.id, updates);
    }
    setShowConfig(false);
  };
  
  const handleShowProcessingDetails = (messageId: string) => {
    setShowProcessingDetails({
      messageId,
      visible: true
    });
  };
  
  const handleCloseProcessingDetails = () => {
    setShowProcessingDetails({
      messageId: '',
      visible: false
    });
  };
  
  // Get message and processing details for visualization
  const selectedMessage = showProcessingDetails.messageId 
    ? getMessageById(showProcessingDetails.messageId)
    : undefined;
  
  const processingSteps = selectedMessage?.processingPath || [];
  
  // Combine all distilled content for display
  const distilledContext = processingSteps
    .map(step => step.distilledContent)
    .join('\n\n');
  
  return (
    <AppLayout>
      <NavPanel>
        <LayerNavigation
          layers={Object.values(state.layers)}
          activeLayerId={state.activeLayerId}
          onLayerSelect={changeActiveLayer}
          onAddLayer={handleAddLayer}
        />
      </NavPanel>
      
      <MainPanel>
        <ConversationInterface
          messages={conversation}
          onSendMessage={sendMessage}
          onShowProcessingDetails={handleShowProcessingDetails}
        />
      </MainPanel>
      
      {showConfig && (
        <ConfigPanel>
          <LayerConfigPanel
            layer={activeLayer}
            onSave={handleSaveConfig}
            onCancel={() => setShowConfig(false)}
          />
        </ConfigPanel>
      )}
      
      {!showConfig && (
        <ConfigToggle onClick={() => setShowConfig(true)}>
          CONFIGURE LAYER
        </ConfigToggle>
      )}
      
      {showProcessingDetails.visible && selectedMessage && (
        <ProcessingVisualization
          originalMessage={selectedMessage.content}
          processingSteps={processingSteps}
          layers={state.layers}
          distilledContext={distilledContext}
          onClose={handleCloseProcessingDetails}
        />
      )}
    </AppLayout>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LayerProvider>
        <AppContainer>
          <AppHeader>
            <AppTitle>LAYERED PROMPT STACKING SYSTEM</AppTitle>
          </AppHeader>
          <AppContent />
        </AppContainer>
      </LayerProvider>
    </ThemeProvider>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const AppHeader = styled.header`
  background-color: var(--color-accent-primary);
  padding: 1rem;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
  margin-bottom: 1rem;
`;

const AppTitle = styled.h1`
  font-family: var(--font-heading);
  color: white;
  margin: 0;
  text-align: center;
`;

const AppLayout = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;
  height: calc(100vh - 100px);
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const NavPanel = styled.div`
  width: 20%;
  min-width: 200px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    height: auto;
  }
`;

const MainPanel = styled.div`
  flex: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 60%;
  }
`;

const ConfigPanel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  z-index: 10;
`;

const ConfigToggle = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: var(--color-accent-tertiary);
  font-weight: 700;
  z-index: 5;
`;

export default App;
