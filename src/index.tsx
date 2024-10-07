import React from 'react';

interface PreloaderProps {
	placeholder: React.ReactElement;
	onFailure: React.ReactElement;
	localImages?: Array<{ [key: string]: string }> | Array<string>;
	remoteImages?: Array<string>;
	loaderCallbacks?: Array<() => Promise<void | Array<string>>>;
	cacheCallback: (images: Map<string, HTMLImageElement>) => void;
	finaliseCallback?: (success: boolean) => void;
	verbose?: boolean;
	children: React.ReactNode;
}

const Preloader: React.FC<PreloaderProps> = ({
	placeholder,
	onFailure,
	localImages,
	remoteImages,
	loaderCallbacks,
	cacheCallback,
	finaliseCallback,
	verbose,
	children
}: PreloaderProps): React.ReactElement => {
	const [status, setStatus] = React.useState<Status>({
		complete: false,
		error: false
	});

	// Load in an individual image so it's stored in the browser's cache for when the preloader completes
	const loadImage = async (file: string): Promise<ImageRecord> => {
		return new Promise<ImageRecord>(
			(
				resolve: (image: ImageRecord) => void,
				reject: (e: Error) => void
			) => {
				// Get the filename for the image (minus domain, path and filetype) - we use this as the key for the
				// image in the map that's returned to the consumer of this library.  If we have been passed a Base64
				// string then we can't extract a filename and set the key as the file extension (this will be
				// appended to consequentially).
				let key: string;
				if (file.startsWith('data:image')) {
					key = file.substring(
						file.indexOf('/') + 1,
						file.indexOf(';')
					);
					// SVG files will have a type of svg+xml
					if (key.includes('+')) {
						key = key.substring(0, key.indexOf('+'));
					}
				} else {
					key = file.substring(
						file.lastIndexOf('/') + 1,
						file.lastIndexOf('.')
					);
					if (key.indexOf('.') > -1) {
						key = key.substring(0, key.indexOf('.'));
					}
				}
				verbose && console.log('Pre-loading "' + key + '"');

				// "Load" the image
				const image = new Image();
				image.src = file;
				image.onload = () => {
					verbose && console.log('Image "' + key + '" loaded');
					const record: ImageRecord = {
						key: key,
						image: image
					};
					resolve(record);
				};
				image.onerror = () => {
					reject(new Error('Could not load image "' + key + '"'));
				};
			}
		);
	};

	const translateKey = (key: string, count: ImageCount): string => {
		// We may end up with Base64 strings off which we can't
		// get the filename - we want to return a key of the file
		// extension, and we need to keep a count of each of these
		// so each image has an individual key and not get overwritten
		if (
			key === 'gif' ||
			key === 'jpg' ||
			key === 'png' ||
			key === 'svg' ||
			key === 'webp'
		) {
			key = key + '-' + ++count[key];
		}
		return key;
	};

	React.useEffect(() => {
		const prep = async () => {
			let error: boolean = false;
			const images: Map<string, HTMLImageElement> = new Map<
				string,
				HTMLImageElement
			>();
			const count: ImageCount = {
				gif: 0,
				jpg: 0,
				png: 0,
				svg: 0,
				webp: 0
			};

			try {
				// No particular type of input is mandatory (although it would be pointless using the preloader
				// if there isn't at least one of them).  Sanity checking on each is therefore required.
				if (localImages) {
					verbose && console.log('Preloading : Local files');
					for (let i = 0; i < localImages.length; i++) {
						// Local images can be provided in one of two ways
						//   - each image is individually pulled in via "import * as myimage from filename.extension"
						//     and then passed in one array of strings (either the path or a Base64 representation)
						//   - images are loaded in bulk via "import * as myimages from *.extension" and then passed
						//     in as an array of these key/value pairs
						if (
							typeof localImages[i] === 'string' ||
							localImages[i] instanceof String
						) {
							const file: string = localImages[i] as string;
							const record: ImageRecord = await loadImage(file);
							record.key = translateKey(record.key, count);
							images.set(record.key, record.image);
						} else {
							const extension: { [key: string]: string } =
								localImages[i] as { [key: string]: string };
							const keys: Array<string> = Object.keys(extension);
							// For images supplied this way, we will have already been supplied the filenames in the
							// key/value pair, so use these keys again and ignore what the loadImage method provides
							for (let f = 0; f < keys.length; f++) {
								const record: ImageRecord = await loadImage(
									extension[keys[f]]
								);
								record.key = translateKey(record.key, count);
								if (keys[f] !== 'default') {
									images.set(keys[f], record.image);
								} else {
									images.set(record.key, record.image);
								}
							}
						}
					}
					verbose &&
						console.log(
							'Preloading: Local files all loaded (Count: ' +
								images.size +
								')'
						);
				}
				if (remoteImages) {
					verbose && console.log('Preloading : Remote URLs');
					// Remote images are much simpler - we are given a URL to pull from, so we know we're
					// getting the right key back
					for (let i = 0; i < remoteImages.length; i++) {
						const record: ImageRecord = await loadImage(
							remoteImages[i]
						);
						images.set(record.key, record.image);
					}
					verbose &&
						console.log(
							'Preloading: Remote URLs all loaded (Count: ' +
								images.size +
								')'
						);
				}
				if (loaderCallbacks) {
					verbose && console.log('Preloading: Executing callbacks');
					for (let c = 0; c < loaderCallbacks.length; c++) {
						// For any callbacks execute, they may also provide a result of an array of URLs
						// which we import the same as for explicitly provided URLs
						const result: void | Array<string> =
							await loaderCallbacks[c]();
						if (result) {
							for (let i = 0; i < result.length; i++) {
								const record: ImageRecord = await loadImage(
									result[i]
								);
								images.set(record.key, record.image);
							}
							verbose &&
								console.log(
									'Preloading: Images returned from callback ' +
										(c + 1) +
										' loaded (Count: ' +
										result.length +
										')'
								);
						}
					}
					verbose && console.log('Preloading : Callbacks completed');
				}
				if (finaliseCallback) {
					finaliseCallback(true);
				}
			} catch (e) {
				verbose && console.error('Caught error preloading : ' + e);
				if (finaliseCallback) {
					finaliseCallback(false);
				}
				error = true;
			} finally {
				cacheCallback(images);
				verbose && console.log('Preloading : Images cached');
			}
			setStatus({ complete: true, error: error });
		};
		prep();
	}, []);

	if (status.complete && !status.error) {
		return <div>{children}</div>;
	} else if (status.complete && status.error) {
		return onFailure;
	}
	return placeholder;
};

export default Preloader;
