import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Svg, G, Circle, Rect } from 'react-native-svg';
import { DragAndDropArea, Draggable, Droppable } from 'react-native-simple-dnd';

export default function App() {
  const size = 40;
  return (
    <View style={styles.container}>
      <DragAndDropArea>
        <View style={{ flex: 1 }}>
          <Draggable keyValue={'draggable-1'} x={0} y={30}>
            <Svg width={size} height={size}>
              <G>
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={size / 2}
                  fill={'#ff0000'}
                />
              </G>
            </Svg>
          </Draggable>

          <Draggable
            keyValue={'draggable-2'}
            x={0} 
            y={80}
            item={{ a: 1 }}
            insideParams={{ fill: '#ff0000' }}
            eventHandlers={{
              onCoverDroppableComponent: (draggedItem, droppeedItem) =>
                console.log(draggedItem, droppeedItem),
              onDropOverDroppableComponent: () => console.log('dropped'),
              onCoverDroppableComponentForInsideParams: (insideParams) => ({
                ...insideParams,
                fill: '#00ff00',
              }),
              onUncoverDroppableComponentForInsideParams: (insideParams) => ({
                ...insideParams,
                fill: '#ff0000',
              }),
            }}
          >
            {(insideParams) => (
              <Svg width={size} height={size}>
                <G>
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size / 2}
                    fill={insideParams?.fill}
                  />
                </G>
              </Svg>
            )}
          </Draggable>

          <Droppable
            keyValue="test-area"
            x={0} 
            y={200}
            item={'droppablearea'}
            insideParams={{ fill: '#0000ff' }}
            eventHandlers={{
              onCoveredByDraggableComponent: () => console.log('hovered!!'),
              onDroppedDraggableComponent: (draggedItem, droppeedItem) =>
                console.log('Dropped!!!', draggedItem, droppeedItem),
              onCoveredByDraggableComponentForInsideParams: (insideParams) => ({
                ...insideParams,
                fill: '#00ff00',
              }),
              onUncoveredByDraggableComponentForInsideParams: (
                insideParams,
              ) => ({ ...insideParams, fill: '#0000ff' }),
            }}
          >
            {(insideParams) => (
              <Svg width={400} height={size}>
                <G>
                  <Rect
                    width={400}
                    height={size}
                    fill={insideParams?.fill}
                  />
                </G>
              </Svg>
            )}
          </Droppable>
        </View>
      </DragAndDropArea>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
