/**
 * This typing prevents TypeScript from complaining about our imported SVG
 * files. When we import an SVG file, react-native-svg transforms the SVG into
 * a React component.
 */
declare module '*.svg' {
  import React from 'react'

  class Svg extends React.Component<any> {}

  export default Svg
}
