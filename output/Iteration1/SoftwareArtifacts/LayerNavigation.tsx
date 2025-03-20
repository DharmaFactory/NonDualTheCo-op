import React from 'react';
import styled from 'styled-components';
import { Layer } from '../types';

interface LayerNavigationProps {
  layers: Layer[];
  activeLayerId: string;
  onLayerSelect: (layerId: string) => void;
  onAddLayer: () => void;
}

const LayerNavigation: React.FC<LayerNavigationProps> = ({
  layers,
  activeLayerId,
  onLayerSelect,
  onAddLayer
}) => {
  // Sort layers by level
  const sortedLayers = [...layers].sort((a, b) => a.level - b.level);

  return (
    <NavContainer>
      <NavHeader>LAYERS</NavHeader>
      <LayerList>
        {sortedLayers.map(layer => (
          <LayerButton 
            key={layer.id}
            isActive={layer.id === activeLayerId}
            onClick={() => onLayerSelect(layer.id)}
          >
            {layer.id === activeLayerId && <ActiveIndicator>▶</ActiveIndicator>}
            {layer.name}
          </LayerButton>
        ))}
        <AddLayerButton 
          isActive={false}
          onClick={onAddLayer}
        >
          + ADD NEW LAYER
        </AddLayerButton>
      </LayerList>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  background-color: var(--color-background-secondary);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const NavHeader = styled.h2`
  font-family: var(--font-heading);
  padding: 1rem;
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: var(--color-accent-primary);
  color: white;
  margin: 0;
`;

const LayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
`;

const LayerButton = styled.button<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? 'var(--color-accent-secondary)' : 'var(--color-background)'};
  border: var(--border-width) solid var(--color-border);
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  position: relative;
  transform: ${props => props.isActive ? 'translate(-2px, -2px)' : 'none'};
  box-shadow: ${props => props.isActive 
    ? 'calc(var(--border-offset) + 2px) calc(var(--border-offset) + 2px) 0 0 var(--color-border)'
    : 'var(--shadow-default)'};
  transition: var(--transition-default);

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: calc(var(--border-offset) + 2px) calc(var(--border-offset) + 2px) 0 0 var(--color-border);
  }
`;

const ActiveIndicator = styled.span`
  margin-right: 0.5rem;
`;

const AddLayerButton = styled(LayerButton)`
  background-color: var(--color-accent-tertiary);
  color: var(--color-text-primary);
  text-align: center;
  margin-top: 1rem;
  font-weight: 700;
`;

export default LayerNavigation;
