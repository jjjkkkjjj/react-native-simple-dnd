# react-native-simple-dnd

The very simple Drag and Drop library in React Native.

![demo](./assets/demo.gif?raw=true)

## Installation

```bash
npm install react-native-simple-dnd
```

## Example

All you have to do is enclose `<DnDArea>`, `<DnDable>`!

```typescript
<DnDArea>
  <DnDable x={10} y={10}>
    // Put the component you want to drag and drop here
  </DnDable>
</DnDArea>
```

For more details, see [example codes](./example/README.md).

## Props

### `DnDArea`

This component is needed above the `DnDable`. `DnDArea` manages all the child `DnDable`s.

`*` is required.

| props        | type              | description                          |
| :----------- | :---------------- | :----------------------------------- |
| \*`children` | `React.ReactNode` | Any components including `<DnDable>` |

Note: This component manages the global state by recoil package. DON'T use the below atom's key in your app.

- `DroppableInformationAtom`
  - To store the information including a layout for droppable component
- `DraggableInformationAtom`
  - To store the information including a flag that indicates whether this component is dragging now or not
- `DnDAreaAtom`
  - Not used now
- `ReloadLayoutAtom`
  - To store the state and function for refreshing the `DnDable` component manually

### `DnDable`

When you enclose `DnDable` with the components, you can drag and drop them!

| props            | type                                                                  | description                                                                                                                     |
| :--------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| \*`keyValue`     | `string`                                                              | The unique key to manage the component                                                                                          |
| `parentkeyValue` | `string`                                                              | The parent unique key to manage the component (This is needed to avoid overlapping during dragging the child DnDable component) |
| `item`           | `T`                                                                   | The custom item                                                                                                                 |
| `styleParams`    | `U extends object`                                                    | The custom parameters for style                                                                                                 |
| `eventHandlers`  | `DnDEventHandlers<T, U>`                                              | The event handlers (See [below](#event-handlers) for more details)                                                              |
| `x`              | `number`                                                              | The x coordinates relative to parent                                                                                            |
| `y`              | `number`                                                              | The y coordinates relative to parent                                                                                            |
| `reverseX`       | `boolean`                                                             | Whether the opposite x direction (left) is positive or not                                                                      |
| `reverseY`       | `boolean`                                                             | Whether the opposite y direction (up) is positive or not                                                                        |
| `zIndex`         | `number`                                                              | The z index                                                                                                                     |
| `containerStyle` | `StyleProp<ViewStyle>`                                                | The container style                                                                                                             |
| \*`children`     | `((\_styleParams?: U) => React.ReactElement)` or `React.ReactElement` | The child component or functional component                                                                                     |

#### Event Handlers

| function                                | args                                                                                                                                                                         | description                                                                                           |
| :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `onDragStart`                           |                                                                                                                                                                              | The function to be called when the dragging starts                                                    |
| `onDragStartForStyleParams`             | `styleParams: U` The current style parameters                                                                                                                                | The function for style parameters to be called when the dragging starts                               |
| `onDragEnd`                             |                                                                                                                                                                              | The function to be called when the dragging ends                                                      |
| `onDragEndForStyleParams`               | `styleParams: U` The current style parameters                                                                                                                                | The function for style parameters to be called when the dragging ends                                 |
| `onDraggedItemHovered`                  | `draggedItem: DnDItemType<any>` The hovered (dragged) item on this component                                                                                                 | The function to be called when a dragged component hovers this component                              |
| `onDraggedItemHoveredForStyleParams`    | `styleParams?: U` The current style parameters<br>`draggedItem: DnDItemType<any>` The dragged item<br>`droppedItem: DnDItemType<T>` The dropped item (This component's item) | The function for style parameters to be called when a dragged component hovers this component         |
| `onDraggedItemNotHoveredForStyleParams` | `styleParams?: U` The current style parameters<br>`draggedItem: DnDItemType<any>` The dragged item                                                                           | The function for style parameters to be called when a dragged component DOESN'T hovers this component |
| `onDropped`                             | `draggedItem: DnDItemType<any>` The dragged item<br>`droppedItem: DnDItemType<T>` The dropped item (This component's item)                                                   | The function to be called when the dragging component is dropped into droppable component             |

Note: The `styleParams` is managed inside the `DnDable`. That's why you can pass the functional component like this;


```typescript
<DnDable
  keyValue={'1'}
  x={10}
  y={20}
  styleParams={{ bgColor: childItem.bgColor }} // This parameters will be managed inside <DnDable>
  eventHandlers={{
    onDragStartForStyleParams: () => ({ bgColor: 'yellow' }), // You can change the above parameters by event handlers (postfixed by `ForStyleParams`)
    onDraggedItemHoveredForStyleParams: () => ({
      bgColor: 'black',
    })
  })
>
  {/* You can pass the functional component style like this */}
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
```

## Development

```bash
npm install -g yalc
yalc publish react-native-simple-dnd
cd example
yalc add
npm install -S
npx expo start
```

- When the codes are updated,

```bash
npm run build
yalc push
```

Referece: [Stackoverflow](https://stackoverflow.com/questions/44061155/react-native-npm-link-local-dependency-unable-to-resolve-module)
