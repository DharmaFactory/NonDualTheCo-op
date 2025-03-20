import React, { useState } from 'react';
import styled from 'styled-components';
import { Layer, RagContext } from '../types';

interface LayerConfigPanelProps {
  layer: Layer | null;
  onSave: (updates: {
    name?: string;
    systemPrompt?: string;
    ragContext?: {
      content: string;
      name?: string;
    }
  }) => void;
  onCancel: () => void;
}

const LayerConfigPanel: React.FC<LayerConfigPanelProps> = ({
  layer,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(layer?.name || '');
  const [systemPrompt, setSystemPrompt] = useState(layer?.systemPrompt || '');
  const [ragContent, setRagContent] = useState(layer?.ragContext.content || '');
  const [ragName, setRagName] = useState(layer?.ragContext.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      systemPrompt,
      ragContext: {
        content: ragContent,
        name: ragName
      }
    });
  };

  if (!layer) return null;

  return (
    <ConfigContainer>
      <ConfigHeader>CONFIGURE LAYER</ConfigHeader>
      <ConfigForm onSubmit={handleSubmit}>
        <FormSection>
          <SectionLabel>LAYER NAME:</SectionLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter layer name"
          />
        </FormSection>

        <FormSection>
          <SectionLabel>SYSTEM PROMPT:</SectionLabel>
          <TextArea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter system prompt for this layer"
            rows={5}
          />
        </FormSection>

        <FormSection>
          <SectionLabel>RAG CONTEXT:</SectionLabel>
          <Input
            value={ragName}
            onChange={(e) => setRagName(e.target.value)}
            placeholder="Context name"
            style={{ marginBottom: '0.5rem' }}
          />
          <TextArea
            value={ragContent}
            onChange={(e) => setRagContent(e.target.value)}
            placeholder="Enter context information for this layer"
            rows={5}
          />
          <ContextButtons>
            <ContextButton type="button">UPLOAD FILE</ContextButton>
            <ContextButton type="button">ENTER TEXT</ContextButton>
          </ContextButtons>
        </FormSection>

        <ButtonGroup>
          <SaveButton type="submit">SAVE CHANGES</SaveButton>
          <CancelButton type="button" onClick={onCancel}>CANCEL</CancelButton>
        </ButtonGroup>
      </ConfigForm>
    </ConfigContainer>
  );
};

const ConfigContainer = styled.div`
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
  background-color: var(--color-background);
  width: 100%;
`;

const ConfigHeader = styled.h2`
  font-family: var(--font-heading);
  padding: 1rem;
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: var(--color-accent-tertiary);
  margin: 0;
`;

const ConfigForm = styled.form`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionLabel = styled.label`
  font-weight: 700;
  font-family: var(--font-heading);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
  font-size: 1rem;
  background-color: var(--color-background);
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
  font-size: 1rem;
  font-family: var(--font-body);
  resize: vertical;
  background-color: var(--color-background);
`;

const ContextButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ContextButton = styled.button`
  background-color: var(--color-background-secondary);
  padding: 0.5rem;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background-color: var(--color-accent-secondary);
  color: var(--color-text-primary);
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  flex: 1;
`;

const CancelButton = styled.button`
  background-color: var(--color-background-secondary);
  color: var(--color-text-primary);
  padding: 0.75rem 1.5rem;
`;

export default LayerConfigPanel;
