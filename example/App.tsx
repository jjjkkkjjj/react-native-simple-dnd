import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { DnDArea, DnDable, DnDItemType } from 'react-native-simple-dnd';

interface ChildItem {
  type: 'child';
  bgColor: string;
  title: string;
  position: { x: number; y: number };
}

interface ParentItem {
  type: 'parent';
  bgColor: string;
  position: { x: number; y: number };
  child: ChildItem;
}

interface ChildItemType extends DnDItemType<ChildItem> {}
interface ParentItemType extends DnDItemType<ParentItem> {}

export default function App() {
  const [parentItems, setParentItems] = React.useState<{
    [key: string]: ParentItem;
  }>({
    '1': {
      type: 'parent',
      bgColor: 'blue',
      position: { x: 0, y: 0 },
      child: {
        type: 'child',
        bgColor: 'purple',
        title: '1',
        position: { x: 0, y: 0 },
      },
    },
    '2': {
      type: 'parent',
      bgColor: 'red',
      position: { x: 50, y: 200 },
      child: {
        type: 'child',
        bgColor: 'purple',
        title: '2',
        position: { x: 10, y: 10 },
      },
    },
  });
  console.log(parentItems);

  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.container}>
        <DnDArea>
          {Object.keys(parentItems).map((keyValue, index) => {
            const parentItem = parentItems[keyValue];
            const childItem = parentItem.child;
            return (
              <DnDable
                key={`parent-${index}`}
                keyValue={keyValue}
                x={parentItem.position.x}
                y={parentItem.position.y}
                item={parentItem}
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
                    backgroundColor: parentItem.bgColor,
                  }}
                >
                  <DnDable
                    keyValue={`child-${keyValue}`}
                    parentkeyValue={keyValue}
                    x={childItem.position.x}
                    y={childItem.position.y}
                    zIndex={100}
                    item={{ ...childItem, parentKey: keyValue }}
                    styleParams={{ bgColor: childItem.bgColor }}
                    eventHandlers={{
                      onDragStart: () => console.log('dragstart'),
                      onDragStartForStyleParams: () => ({ bgColor: 'yellow' }),
                      onDraggedItemHoveredForStyleParams: () => ({
                        bgColor: 'black',
                      }),
                      onDropped: (
                        draggedItem?: DnDItemType<
                          ChildItem & { parentKey: string }
                        >,
                        droppedItem?: DnDItemType<
                          ChildItem & { parentKey: string }
                        >,
                      ) => {
                        if (!(draggedItem && droppedItem)) {
                          return;
                        }
                        if (
                          !(
                            draggedItem.item?.type === 'child' &&
                            droppedItem.item?.type === 'child'
                          )
                        ) {
                          return;
                        }
                        console.log('dropped', draggedItem, droppedItem);
                        const {
                          item: {
                            parentKey: draggedKeyValue,
                            ...draggedChildItem
                          },
                        } = draggedItem;
                        const {
                          item: {
                            parentKey: droppedKeyValue,
                            ...droppedChildItem
                          },
                        } = droppedItem;
                        const draggedParentItem = parentItems[draggedKeyValue];
                        const droppedParentItem = parentItems[droppedKeyValue];
                        setParentItems((prev) => ({
                          ...prev,
                          [draggedKeyValue]: {
                            ...draggedParentItem,
                            child: { ...droppedChildItem },
                          },
                          [droppedKeyValue]: {
                            ...droppedParentItem,
                            child: { ...draggedChildItem },
                          },
                        }));
                      },
                    }}
                  >
                    {(styleParams) => (
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: styleParams?.bgColor,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>{childItem.title}</Text>
                      </View>
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
