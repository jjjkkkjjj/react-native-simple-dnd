import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { DnDArea, DnDable } from 'react-native-simple-dnd';

export default function App() {
  return (
    <SafeAreaView style={{ marginTop: 20 }}>
      <View style={styles.container}>
        <DnDArea>
          <DnDable
            keyValue="1"
            x={0}
            y={0}
            item={{ keyValue: '1', a: true }}
            eventHandlers={{
              onDraggedItemHovered: (draggedItem) =>
                console.log('hovered', draggedItem),
              onDropped: (draggedItem, droppedItem) =>
                console.log('dropped', draggedItem, droppedItem),
            }}
          >
            <View style={{ width: 100, height: 100, backgroundColor: 'blue' }}>
              <DnDable
                keyValue="child1"
                parentkeyValue="1"
                x={30}
                y={10}
                styleParams={{ bgColor: 'purple' }}
                eventHandlers={{
                  onDragStartForStyleParams: () => ({ bgColor: 'yellow' }),
                  onDraggedItemHoveredForStyleParams: () => ({ bgColor: 'black' }),
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
                  onDraggedItemHoveredForStyleParams: () => ({ bgColor: 'black' }),
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
