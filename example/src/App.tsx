import React from 'react';

import Config from './Config';

import Preloader from 'react-app-images-preloader';

import * as gif from './assets/preload-gif-local.gif';
import * as jpeg from './assets/preload-jpg-local.jpg';
import * as png from './assets/preload-png-local.png';
import { default as svg } from './assets/preload-svg-local.svg';
import * as webp from './assets/preload-webp-local.webp';

const App = () => {
	const [cached, setCached] = React.useState(new Map());
	const [status, setStatus] = React.useState('In progress');
	const [names, setNames] = React.useState([
		'preload-gif-local',
		'preload-jpg-local',
		'preload-png-local',
		'preload-svg-local',
		'preload-webp-local'
	]);

	const local = [gif, jpeg, png, svg, webp];
	const remote = Config.getRemoteFiles();
	const dynamic = Config.getDynamicFiles();
	const callback = async () => {
		return new Promise(
			(
				resolve: (urls: Array<string>) => void,
				reject: (e: Error) => void
			) => {
				const success = Config.getCallerSuccess();
				if (success) {
					resolve(dynamic);
				} else {
					reject(new Error('Something went wrong'));
				}
			}
		);
	};

	const doCache = (images: Map<string, HTMLImageElement>) => {
		for (let n = 0; n < names.length; n++) {
			if (!images.has(names[n])) {
				names[n] = names[n]
					.replace('preload-', '')
					.replace('-local', '-1');
			}
		}
		setNames(names);
		setCached(images);
	};
	const doFinalise = (success: boolean) => {
		const message: string =
			'Completed ' + (success ? 'successfully' : 'with errors');
		setStatus(message);
	};

	return (
		<div>
			<h1>React Images Pre-loader</h1>
			<Preloader
				placeholder={
					<div>
						<h1>Loading...</h1>
					</div>
				}
				onFailure={
					<div>
						<h1>Failed to load</h1>
					</div>
				}
				localImages={local}
				remoteImages={remote}
				loaderCallbacks={[callback]}
				cacheCallback={doCache}
				finaliseCallback={doFinalise}>
				<h2>Local Images</h2>
				<ImageShow cache={cached} names={names} />
				<h2>Remote Images</h2>
				<ImageShow
					cache={cached}
					names={[
						'preload-gif-remote',
						'preload-jpg-remote',
						'preload-png-remote'
					]}
				/>
				<h2>Images from callbacks</h2>
				<ImageShow
					cache={cached}
					names={['preload-svg-remote', 'preload-webp-remote']}
				/>
			</Preloader>
			<h3>Status: {status}</h3>
		</div>
	);
};

interface ImageShowProps {
	cache: Map<string, HTMLImageElement>;
	names: Array<string>;
}

const ImageShow: React.FC<ImageShowProps> = ({
	cache,
	names
}: ImageShowProps): React.ReactElement => {
	return (
		<ul>
			{names.map((name, n) => {
				if (cache.get(name)) {
					return (
						<li key={n}>
							<img
								src={cache.get(name)!.src}
								width='300'
								alt={name}
							/>
						</li>
					);
				} else {
					return <li key={n}>Not loaded: {name}</li>;
				}
			})}
		</ul>
	);
};

export default App;
