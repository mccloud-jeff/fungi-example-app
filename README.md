This is just a little example app I'm using as a playground as I create
`fungi-js`.  Fungi aims to provide a new, modern approach to creating
geographically aware applications and maps using JavaScript, React
components, and techniques and patterns from Functional Programming.

**Don't use this yet. It's not nearly good enough. I'm still porting code over from
a previous incarnation of these ideas.** But if you're curious...

The fungi-js stuff is hiding in `src/lib`. Will eventually be moved to own repo
and npm lib.

`/src/lib/fungi` contains the data fetchers. These are Higher Order
Components that fetch data based on the wrapped components
props (like geomerty, layer URL, etc) and re-renders the components
with the fetched results with a new props.features. `fungi-graphql` requires a
back-end (`fungi-server`) that isn't posted yet. These HOCs are intended to be
isomorphic/universal and hopefully usable in both React and React Native.

`/src/lib/fungi-ol3` contains components and functions to support rendering
maps using OpenLayers 3 (OL3). Additional support for Leaflet, Google Maps,
and React Native is planned.

`/src/lib/fungi-mui` will contain a common set of map UI components (Legend,
Basemap Selector, etc), built with material-ui. A generic, more easily styled set
of components is planned.

## More here soon...
