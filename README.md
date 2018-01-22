# Nivo Line Chart with Brush example.

[Nivo](http://nivo.rocks/) is a great library to build beautiful charts with ease, but lacks some functionalities. For one of my projects, I wanted to add a brush under the chart, to allow the user to select a specific portion of the chart to view. I have tried on other occassions to build this kind of component from scratch, and I have not been very successful, so instead, I tried to incorporate it into Nivo.

## Explanation

After studying a littel bit how the components are designed in Nivo, I realized that there was not a way to draw a "brush" over the chart. The line component doesn't accept children components.

To solve this, I created a new component, using the current `Line` component as base, and added a `Brush` component as one of its children. Then I modified the `props` that the component consumes, to pass it down to the `Brush` components. These are:

* `onBrush`: a callback function that returns the `min` and `max` edges coordinates of the brush.
* `initialMinEdge`: initial min edge of the brush.
* `initialMaxEdge`: initial max edge of the brush.

The `Brush` component I designed is very simple. It only works on one axis, and it represents the selected area with a gray square. You can grow or shrink the selection, drag it, or create a new one. Every time the edges of the `Brush` are updated, it will call the `onBrush` callback, with those values.

On my example, I manipulated the data sent through the `Line` component with the chart, to eliminate most of the points. The data I am using has more than 9000 points, which makes the page a little slow when trying to draw them all. I am also manipulating the ticks on the main `Line` chart, so that they don't overlap.

One of the main issues I had while designing the `Brush`, was how to convert mouse coordinates to `svg` coordinates. For this, I ussually use [this StackOverflow solution](https://stackoverflow.com/questions/10298658/mouse-position-inside-autoscaled-svg) which needs a reference to the `svg` component. Once again, `nivo` does not provides access to it by default. So, just with the `Line` component, I cloned the `SvgWrapper` component, and made two big modifications to it.

1. I converted it into a `class` component to take advantage of the `ref` api.
2. I added a new handler called `getSvgRef`, which returns the `svg` reference dynamically. This handler is provided as a prop inside each of the `SvgWrapper` component children.

The other issue I had to solve, was how to convert from the `Brush` edge coordinates to index values on the data arrays. Line charts on `nivo` use point scales to go from the data to coordinates. Point scales on `d3` don't have an `invert` method by design. So, I hade to construct a new quantize scale from `d3` to convert from edges to index values. Then I just slice the main data using those calculated indexes.

## Running the project

This project was instantiated with `create-react-app`, so running it is as simple as cloning it and running `yarn install` and the `yarn start`.

![Example](./images/example.gif)

## Licence

MIT
