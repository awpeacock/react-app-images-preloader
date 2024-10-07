# react-app-images-preloader

> Image preloader for React web apps.

[![NPM](https://img.shields.io/npm/v/react-app-images-preloader.svg)](https://www.npmjs.com/package/react-app-images-preloader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

-   Pre-load local and remote images
-   Retrieve images dynamically
-   Show placeholder content of your choice
-   Make any number of asynchronous callbacks
-   Execute method on completion

## Install

```bash
npm install --save react-app-images-preloader
```

## Usage

| **Prop**           | **Description**                                                                       | **Type**           | **Optional/Mandatory** |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------ | ---------------------- |
| `placeholder`      | Content to be displayed while images are loaded in the background.                    | React.ReactElement | Mandatory              |
| `onFailure`        | Content to be displayed should an error occur trying to load images.                  | React.ReactElement | Mandatory              |
| `localImages`      | An array of images imported locally within the source code.                           | array              | Optional               |
| `remoteImages`     | An array of image URLs.                                                               | array              | Optional               |
| `loaderCallbacks`  | An array of async methods to be called before displaying the app.                     | array              | Optional               |
| `cacheCallback`    | Method called with a map of all the images that have been loaded.                     | function           | Mandatory              |
| `finaliseCallback` | Method called with a boolean representing the success or otherwise of the preloading. | function           | Optional               |
| `verbose`          | Whether to output debug comments to the console.                                      | boolean            | Optional               |

### Preloading local images

There are multiple ways to pre-load local images.

You can load in each image individually, and then add them to an array. Using this method, it is likely they will be passed in as Base64 encoded strings, thus when returned in the images callback they will be identified sequentially by their extension (ie jpg-1, jpg-2, etc.):

```tsx
import * as gif from './image.gif';
import { default as svg } from './image.svg';
const images = [gif, svg];
```

If you want them to have specific keys in the returned map, then add them as an array of key/value pairs:

```tsx
import * as png from './image.png';
import * as webp from './image.webp';
const images = [{ 'my-png-key': png }, { 'my-svg-key': svg }];
```

If your application uses [**Parcel**](https://parceljs.org/) you can import files in bulk and they will be returned in the image callback with their filename as their key:

```tsx
import jpegs from './images/*.jpg';
import svgs from './icons/*.svg';
const images = [jpegs, svgs];
```

For this, you will need to configure `.parcelrc` as such:

```json
{
	"extends": "@parcel/config-default",
	"resolvers": ["@parcel/resolver-glob", "..."]
}
```

_Note: This has not yet been tested with a [**Webpack**](https://webpack.js.org/) setup._

## Example

```tsx
import React from 'react';

import Preloader from 'react-app-images-preloader';

import * as gif from './example-1.gif';

const Example = () => {
	const [images, setImages] = React.useState(new Map());
	const [message, setMessage] = React.useState('');
	const jpg = 'https://www.example-2.jpg';

	const load = async () => {
		return new Promise((resolve) => void) => {
			resolve(['https://www.example-3.svg']);
		});
	};

	const cache = (response) => {
		setImages(response);
	};

	const finalise = (success) => {
		setMessage(success ? 'Success' : 'Failure');
	};

	return (
		<Preloader
			placeholder={<h1>Loading</h1>}
			onFailure={<h1>Failed</h1>}
			localImages={[gif]}
			remoteImages={[svg]}
			loaderCallbacks={[load]}
			cacheCallback={cache}
			finaliseCallback={finalise}>
			<div>
				<h1>{message}</h1>
				{images.get('gif-1') && <img src={images.get('gif-1').src} />}
				{images.get('example-2') && (
					<img src={images.get('example-2').src} />
				)}
				{images.get('example-3') && (
					<img src={images.get('example-3').src} />
				)}
			</div>
		</Preloader>
	);
};
```

## License

GPL © [awpeacock](https://github.com/awpeacock)
