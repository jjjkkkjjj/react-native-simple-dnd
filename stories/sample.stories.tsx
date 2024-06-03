import React from 'react';

import type { Meta, StoryFn } from '@storybook/react';
import { View } from 'react-native';
import { Svg, G, Circle, Rect } from 'react-native-svg';

import { DragAndDropArea, Draggable, Droppable } from '../src';



const Area = (_props) => {
  const size = 50;
  return (
    <>
      <DragAndDropArea>
        <View>
          <Draggable keyValue={'draggable-1'} x={0} y={0}>
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
            x={0} y={50}
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
              <Svg width={'100%'} height={size}>
                <G>
                  <Rect
                    width={'100%'}
                    height={size}
                    fill={insideParams?.fill}
                  />
                </G>
              </Svg>
            )}
          </Droppable>
        </View>
      </DragAndDropArea>
    </>
  );
};


const meta = {
  title: 'libs/DragAndDrop',
  component: Area,
} satisfies Meta<typeof Area>;

//👇 We create a “template” of how args map to rendering
export default meta;

const Story: StoryFn<typeof Area> = (args) => {
  return <Area {...args} />
}

export const FirstStory = Story.bind({});

FirstStory.args = {
  /*👇 The args you need here will depend on your component */
};
