import React from 'react';
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { render, screen, act, waitFor, cleanup } from '@testing-library/react';

import Preloader from '.';

describe('Preloader', () => {
	const setState = jest.fn();

	const text = {
		placeholder: 'Testing Preloader',
		failure: 'Testing Failure',
		success: 'Testing Success',
		response: ''
	};
	const images = {
		local: [
			'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
			'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB3aWR0aD0iMTAwIgogICBoZWlnaHQ9IjEwMCI+CiAgICA8cmVjdAogICAgICAgd2lkdGg9IjEwMCIKICAgICAgIGhlaWdodD0iMTAwIgogICAgICAgc3R5bGU9ImZpbGw6IzY2NjsiIC8+Cjwvc3ZnPgo='
		],
		map: [
			{
				'local-gif':
					'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
				default:
					'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wgARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAX8P/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABAf/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPxB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPxB//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxB//9k='
			}
		],
		remote: [
			'https://images.ctfassets.net/5u9bdkiurmat/28twoItRtbLYuRL8Oa4l7u/024e828f0f094f611fe7be525ff07941/preload-jpg-remote.jpg'
		],
		failure: [
			'https://images.ctfassets.net/5u9bdkiurmat/HT0sV5rfT25BKu9h30sTD/26143aa33887e0ee7f456c310aa53ee0/preload.404.jpg'
		]
	};
	const components = {
		placeholder: <div>{text.placeholder}</div>,
		failure: <div>{text.failure}</div>,
		success: <div>{text.success}</div>,
		local: (
			<div>
				{text.success}
				<img src={images.local[0]} alt='Local GIF' />
				<img src={images.local[1]} alt='Local SVG' />
			</div>
		),
		remote: (
			<div>
				{text.success}
				<img src={images.remote[0]} alt='Remote Image' />
			</div>
		),
		combined: (
			<div>
				{text.success}
				<img src={images.local[0]} alt='Local GIF' />
				<img src={images.remote[0]} alt='Remote Image' />
			</div>
		),
		map: (
			<div>
				{text.success}
				<img src={images.map[0]['local-gif']} alt='Local GIF' />
				<img src={images.map[0].default} alt='Local JPEG' />
				<img src={images.remote[0]} alt='Remote Image' />
			</div>
		)
	};
	const callbacks = {
		mock: jest.fn(),
		loader: async () => {
			return images.remote;
		},
		finalise: async (success: boolean) => {
			text.response = success ? 'Success' : 'Failure';
		}
	};
	const status = {
		processing: { complete: false, error: false },
		failure: { complete: true, error: true },
		success: { complete: true, error: false }
	};
	const preloader = {
		empty: (
			<Preloader
				placeholder={components.placeholder}
				onFailure={components.failure}
				cacheCallback={callbacks.mock}
				finaliseCallback={callbacks.finalise}>
				{components.success}
			</Preloader>
		),
		failure: (
			<Preloader
				placeholder={components.placeholder}
				onFailure={components.failure}
				cacheCallback={callbacks.mock}
				remoteImages={images.failure}
				finaliseCallback={callbacks.finalise}>
				{components.success}
			</Preloader>
		),
		local: (
			<Preloader
				placeholder={components.placeholder}
				onFailure={components.failure}
				cacheCallback={callbacks.mock}
				localImages={images.local}>
				{components.local}
			</Preloader>
		),
		remote: (
			<Preloader
				placeholder={components.placeholder}
				onFailure={components.failure}
				cacheCallback={callbacks.mock}
				remoteImages={images.remote}>
				{components.remote}
			</Preloader>
		),
		combined: (
			<Preloader
				placeholder={components.placeholder}
				onFailure={components.failure}
				cacheCallback={callbacks.mock}
				localImages={images.local}
				remoteImages={images.remote}>
				{components.combined}
			</Preloader>
		),
		map: (
			<Preloader
				placeholder={components.placeholder}
				onFailure={components.failure}
				cacheCallback={callbacks.mock}
				localImages={images.map}>
				{components.map}
			</Preloader>
		),
		dynamic: (
			<Preloader
				placeholder={components.placeholder}
				onFailure={components.failure}
				cacheCallback={callbacks.mock}
				loaderCallbacks={[callbacks.loader]}>
				{components.remote}
			</Preloader>
		)
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	afterAll((done) => {
		cleanup();
		done();
	});

	it('is truthy', () => {
		expect(Preloader).toBeTruthy();
	});

	it('renders the placeholder correctly', (done) => {
		// On an empty Preloader component, the status state is likely
		// to be updated before we can test it, so mock that instead
		// to produce the state we need to test the rendering of placeholder
		const spyState = jest.spyOn(React, 'useState');
		spyState.mockReturnValueOnce([status.processing, setState]);

		act(() => {
			render(preloader.empty);
		});

		waitFor(() => {
			expect(screen.getByText(text.placeholder)).toBeInTheDocument();
			done();
		});
	});

	it('renders the final content correctly', (done) => {
		// Again, force the status of the component so we can test
		// the rendering of the component we expect - this time
		// we can use the setState mock for an additional test that
		// the useEffect() process is calling what we expect for
		// an empty, successful load
		const spyState = jest.spyOn(React, 'useState');
		spyState.mockReturnValueOnce([status.success, setState]);

		act(() => {
			render(preloader.empty);
		});

		expect(setState).toHaveBeenCalledWith(status.success);

		waitFor(() => {
			expect(screen.getByText(text.success)).toBeInTheDocument();
			done();
		});
	});

	it('renders the failure content correctly', (done) => {
		const spyState = jest.spyOn(React, 'useState');
		spyState.mockReturnValueOnce([status.failure, setState]);

		act(() => {
			render(preloader.empty);
		});

		waitFor(() => {
			expect(screen.getByText(text.failure)).toBeInTheDocument();
			done();
		});
	});

	it('handles an error loading an image correctly', (done) => {
		const setState = jest.fn();
		const spyState = jest.spyOn(React, 'useState');
		spyState.mockReturnValueOnce([status.processing, setState]);

		// We have a test later that a missing image throws an error, but
		// this is solely to test that an error is handled
		const spyImage = jest.spyOn(global, 'Image');
		spyImage.mockImplementationOnce(() => {
			throw new Error();
		});

		act(() => {
			render(preloader.local);
		});

		waitFor(() => {
			expect(setState).toHaveBeenCalledWith(status.failure);
			done();
		});
	});

	it('loads local images correctly', (done) => {
		act(() => {
			render(preloader.local);
		});

		waitFor(() => {
			const map: Map<string, HTMLImageElement> = new Map();
			const gif = new Image();
			gif.src = images.local[0];
			map.set('gif-1', gif);
			const svg = new Image();
			svg.src = images.local[1];
			map.set('svg-1', svg);
			expect(callbacks.mock).lastCalledWith(map);
			expect(screen.getByText(text.success)).toBeInTheDocument();
			expect(screen.getByAltText('Local GIF')).toBeInTheDocument();
			expect(screen.getByAltText('Local GIF')).toHaveAttribute(
				'src',
				images.local[0]
			);
			expect(screen.getByAltText('Local SVG')).toBeInTheDocument();
			expect(screen.getByAltText('Local SVG')).toHaveAttribute(
				'src',
				images.local[1]
			);
			done();
		});
	});

	it('loads a remote image correctly', (done) => {
		act(() => {
			render(preloader.remote);
		});

		waitFor(() => {
			const map: Map<string, HTMLImageElement> = new Map();
			const img = new Image();
			img.src = images.remote[0];
			map.set('preload-jpg-remote', img);
			expect(callbacks.mock).lastCalledWith(map);
			expect(screen.getByText(text.success)).toBeInTheDocument();
			expect(screen.getByAltText('Remote Image')).toBeInTheDocument();
			expect(screen.getByAltText('Remote Image')).toHaveAttribute(
				'src',
				images.remote[0]
			);
			done();
		});
	});

	it('loads both a local and remote image correctly', (done) => {
		act(() => {
			render(preloader.combined);
		});

		waitFor(() => {
			expect(screen.getByText(text.success)).toBeInTheDocument();
			expect(screen.getByAltText('Local GIF')).toBeInTheDocument();
			expect(screen.getByAltText('Local GIF')).toHaveAttribute(
				'src',
				images.local[0]
			);
			expect(screen.getByAltText('Remote Image')).toBeInTheDocument();
			expect(screen.getByAltText('Remote Image')).toHaveAttribute(
				'src',
				images.remote[0]
			);
			done();
		});
	});

	it('loads a map of images from a bulk import via Parcel correctly', (done) => {
		act(() => {
			render(preloader.map);
		});

		waitFor(() => {
			const map: Map<string, HTMLImageElement> = new Map();
			const gif = new Image();
			gif.src = images.map[0]['local-gif'];
			map.set('local-gif', gif);
			const jpeg = new Image();
			jpeg.src = images.map[0].default;
			map.set('jpg-1', jpeg);
			expect(callbacks.mock).lastCalledWith(map);
			expect(screen.getByText(text.success)).toBeInTheDocument();
			expect(screen.getByAltText('Local GIF')).toBeInTheDocument();
			expect(screen.getByAltText('Local GIF')).toHaveAttribute(
				'src',
				images.map[0]['local-gif']
			);
			expect(screen.getByAltText('Local JPEG')).toBeInTheDocument();
			expect(screen.getByAltText('Local JPEG')).toHaveAttribute(
				'src',
				images.map[0].default
			);
			expect(screen.getByAltText('Remote Image')).toBeInTheDocument();
			expect(screen.getByAltText('Remote Image')).toHaveAttribute(
				'src',
				images.remote[0]
			);
			done();
		});
	});

	it('loads an image dynamically via callback correctly', (done) => {
		act(() => {
			render(preloader.dynamic);
		});

		waitFor(() => {
			const map: Map<string, HTMLImageElement> = new Map();
			const img = new Image();
			img.src = images.remote[0];
			map.set('preload-jpg-remote', img);
			expect(callbacks.mock).lastCalledWith(map);
			expect(screen.getByText(text.success)).toBeInTheDocument();
			expect(screen.getByAltText('Remote Image')).toBeInTheDocument();
			expect(screen.getByAltText('Remote Image')).toHaveAttribute(
				'src',
				images.remote[0]
			);
			done();
		});
	});

	it('fails correctly if an error occurs during an image load', (done) => {
		const error = jest.spyOn(console, 'error');
		error.mockImplementation(() => null);

		act(() => {
			render(preloader.failure);
		});

		waitFor(() => {
			expect(screen.getByText(text.failure)).toBeInTheDocument();
			done();
		});
	});

	it('fires the finalise callback correctly', (done) => {
		const spyState = jest.spyOn(React, 'useState');
		spyState.mockReturnValueOnce([status.success, setState]);

		act(() => {
			render(preloader.empty);
		});

		waitFor(() => {
			expect(screen.getByText(text.success)).toBeInTheDocument();
			expect(text.response).toEqual('Success');
			cleanup();
		});

		spyState.mockReturnValueOnce([status.failure, setState]);
		const spyImage = jest.spyOn(global, 'Image');
		spyImage.mockImplementationOnce(() => {
			throw new Error();
		});

		act(() => {
			render(preloader.failure);
		});

		waitFor(() => {
			expect(screen.getByText(text.failure)).toBeInTheDocument();
			expect(text.response).toEqual('Failure');
			done();
		});
	});
});
