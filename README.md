# Map Viewer 🗺


<br/>
Work in progress <br/>
<br/>
based on original project @Uzufly https://github.com/uzufly/exploratory
A custom Web Component for rendering 3D maps using the Cesium JavaScript library. The `map-viewer` component allows users to add multiple data layers with customizable clamp settings. The component is built with Lit, a modern, lightweight library for building Web Components.

## Features

- Initialize Cesium Viewer with custom settings
- Load multiple GeoJSON data layers
- Load terrain from url
- Load multiple tileset 3d
- Clamp data layers to the ground
- Easily configure data layers and clamp settings through element attributes

## Installation

Add the following command to your project to install the required dependencies:

```
npm install
```
## Usage

Import the custom element and use it in your HTML:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Map Viewer</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>

    <map-viewer
            cesium-base-url="/static/"
            data='[
            ["boundary", { "url": "/static/data/your-file", "clamp": true }],
            ["solar", { "url": "/static/data/your-file", "clamp": false }]
            ]'>
            data-terrain =  "//3d.geo.admin.ch/1.0.0/ch.swisstopo.terrain.3d/default/20200520/4326/"
            data-tileset='[
            ["buildings", { "url": "https://vectortiles0.geo.admin.ch/3d-tiles/ch.swisstopo.swisstlm3d.3d/20190313/tileset.json", "icon": "/static/icons/tileset1.svg", "description": "Buildings" }],
            ["tree", { "url": "https://vectortiles2.geo.admin.ch/3d-tiles/ch.swisstopo.vegetation.3d/20190313/tileset.json", "icon": "/static/icons/tree.svg", "description": "Tree" }]
            ]'
    </map-viewer>

<script type="module" src="../map-viewer.js"></script>
</body>
</html>

```
## License
MIT License
