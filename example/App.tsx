import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { DnDArea, DnDable, DnDItemType } from 'react-native-simple-dnd';

interface ParentItem {
  type: 'parent';
  bgColor: string;
  position: { x: number; y: number };
}

interface ParentItemType extends DnDItemType<ParentItem> {}

export default function App() {
  const [parentItems, setParentItems] = React.useState<{
    [key: string]: ParentItem;
  }>({
    '1': { type: 'parent', bgColor: 'blue', position: { x: 0, y: 0 } },
    '2': { type: 'parent', bgColor: 'red', position: { x: 50, y: 200 } },
  });
  console.log(parentItems);

  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.container}>
        <DnDArea>
          {Object.keys(parentItems).map((keyValue, index) => {
            const item = parentItems[keyValue];
            return (
              <DnDable
                key={`parent-${index}`}
                keyValue={keyValue}
                x={item.position.x}
                y={item.position.y}
                item={item}
                eventHandlers={{
                  // onDraggedItemHovered: (draggedItem) =>
                  //   console.log('hovered', draggedItem),
                  onDropped: (
                    draggedItem?: ParentItemType,
                    droppedItem?: ParentItemType,
                  ) => {
                    if (!(draggedItem && droppedItem)) {
                      return;
                    }
                    if (
                      !(
                        draggedItem.item?.type === 'parent' &&
                        droppedItem.item?.type === 'parent'
                      )
                    ) {
                      return;
                    }
                    console.log('dropped', draggedItem, droppedItem);
                    setParentItems((prev) => ({
                      ...prev,
                      [draggedItem.keyValue]: {
                        ...droppedItem.item!,
                        position: { ...draggedItem.item!.position },
                      },
                      [droppedItem.keyValue]: {
                        ...draggedItem.item!,
                        position: { ...droppedItem.item!.position },
                      },
                    }));
                  },
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: item.bgColor,
                  }}
                >
                  <DnDable
                    keyValue="child1"
                    parentkeyValue="1"
                    x={30}
                    y={10}
                    zIndex={100}
                    styleParams={{ bgColor: 'purple' }}
                    eventHandlers={{
                      onDragStart: () => console.log('dragstart'),
                      onDragStartForStyleParams: () => ({ bgColor: 'yellow' }),
                      onDraggedItemHoveredForStyleParams: () => ({
                        bgColor: 'black',
                      }),
                    }}
                  >
                    {(styleParams) => (
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: styleParams?.bgColor,
                        }}
                      ></View>
                    )}
                  </DnDable>
                </View>
              </DnDable>
            );
          })}
        </DnDArea>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const Test = (_props: any) => {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.container}>
        <DnDArea>
          <DnDable
            keyValue={'1'}
            x={0}
            y={0}
            item={{ keyValue: '1', a: false }}
            eventHandlers={{
              onDraggedItemHovered: (draggedItem) =>
                console.log('hovered', draggedItem),
              onDropped: (draggedItem, droppedItem) =>
                console.log('dropped', draggedItem, droppedItem),
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: 'blue',
              }}
            >
              <DnDable
                keyValue="child1"
                parentkeyValue="1"
                x={30}
                y={10}
                styleParams={{ bgColor: 'purple' }}
                eventHandlers={{
                  onDragStart: () => console.log('dragstart'),
                  onDragStartForStyleParams: () => ({ bgColor: 'yellow' }),
                  onDraggedItemHoveredForStyleParams: () => ({
                    bgColor: 'black',
                  }),
                }}
              >
                {(styleParams) => (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: styleParams?.bgColor,
                    }}
                  ></View>
                )}
              </DnDable>
            </View>
          </DnDable>
          <DnDable keyValue="2" x={50} y={200}>
            <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
              <DnDable
                keyValue="child2"
                parentkeyValue="2"
                x={10}
                y={10}
                item={{ keyValue: 'child2', a: false }}
                eventHandlers={{
                  onDraggedItemHoveredForStyleParams: () => ({
                    bgColor: 'black',
                  }),
                }}
              >
                <View
                  style={{ width: 50, height: 50, backgroundColor: 'purple' }}
                ></View>
              </DnDable>
            </View>
          </DnDable>
        </DnDArea>
      </View>
    </View>
  );
};
