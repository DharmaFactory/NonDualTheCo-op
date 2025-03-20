import React from 'react';
import styled from 'styled-components';
import { ProcessingStep, Layer } from '../types';

interface ProcessingVisualizationProps {
  originalMessage: string;
  processingSteps: ProcessingStep[];
  layers: Record<string, Layer>;
  distilledContext: string;
  onClose: () => void;
}

const ProcessingVisualization: React.FC<ProcessingVisualizationProps> = ({
  originalMessage,
  processingSteps,
  layers,
  distilledContext,
  onClose
}) => {
  return (
    <VisualizationContainer>
      <VisualizationHeader>MESSAGE PROCESSING DETAILS</VisualizationHeader>
      
      <ContentSection>
        <SectionTitle>ORIGINAL MESSAGE:</SectionTitle>
        <OriginalMessage>"{originalMessage}"</OriginalMessage>
      </ContentSection>
      
      <ContentSection>
        <SectionTitle>LAYER PROCESSING:</SectionTitle>
        {processingSteps.map((step) => (
          <ProcessingBox key={step.layerId}>
            <ProcessingBoxHeader>
              {layers[step.layerId]?.name || `LAYER ${step.layerId}`}
            </ProcessingBoxHeader>
            <ProcessingBoxContent>
              "{step.outputContent}"
            </ProcessingBoxContent>
          </ProcessingBox>
        ))}
      </ContentSection>
      
      <ContentSection>
        <SectionTitle>DISTILLED CONTEXT:</SectionTitle>
        <DistilledContent>"{distilledContext}"</DistilledContent>
      </ContentSection>
      
      <CloseButton onClick={onClose}>CLOSE</CloseButton>
    </VisualizationContainer>
  );
};

const VisualizationContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: var(--color-background);
  border: var(--border-width) solid var(--color-border);
  box-shadow: calc(var(--border-offset) + 4px) calc(var(--border-offset) + 4px) 0 0 var(--color-border);
  z-index: 1000;
  padding-bottom: 1rem;
`;

const VisualizationHeader = styled.h2`
  font-family: var(--font-heading);
  padding: 1rem;
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: var(--color-accent-primary);
  color: white;
  margin: 0;
`;

const ContentSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
`;

const SectionTitle = styled.h3`
  font-family: var(--font-heading);
  margin-bottom: 0.5rem;
`;

const OriginalMessage = styled.div`
  font-family: var(--font-body);
  padding: 0.5rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
`;

const ProcessingBox = styled.div`
  margin: 1rem 0;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
`;

const ProcessingBoxHeader = styled.div`
  font-family: var(--font-heading);
  font-weight: 700;
  padding: 0.5rem;
  background-color: var(--color-accent-secondary);
  border-bottom: var(--border-width) solid var(--color-border);
`;

const ProcessingBoxContent = styled.div`
  padding: 0.5rem;
  background-color: var(--color-background);
  white-space: pre-wrap;
`;

const DistilledContent = styled.div`
  font-family: var(--font-body);
  padding: 0.5rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  white-space: pre-wrap;
`;

const CloseButton = styled.button`
  margin: 1rem auto 0;
  display: block;
  background-color: var(--color-accent-primary);
  color: white;
  font-weight: 700;
  padding: 0.75rem 2rem;
`;

export default ProcessingVisualization;
