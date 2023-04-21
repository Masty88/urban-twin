# Map Viewer

Based on Uzufly cesium-viewer https://github.com/uzufly/exploratory<br/>
<br/>
Work in progress <br/>
<br/>
A custom Web Component for rendering 3D maps using the Cesium JavaScript library. The `map-viewer` component allows users to add multiple data layers with customizable clamp settings. The component is built with Lit, a modern, lightweight library for building Web Components.

## Features

- Initialize Cesium Viewer with custom settings
- Load multiple GeoJSON data layers
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
    </map-viewer>

<script type="module" src="../map-viewer.js"></script>
</body>
</html>

```
## License
MIT License
