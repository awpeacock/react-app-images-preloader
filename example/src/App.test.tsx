import React from 'react';

import Config from './Config';
import App from './App';

import { render, screen, act, waitFor, cleanup } from '@testing-library/react';

import * as gif from './assets/preload-gif-local.gif';
import * as jpeg from './assets/preload-jpg-local.jpg';
import * as png from './assets/preload-png-local.png';
import { default as svg } from './assets/preload-svg-local.svg';
import * as webp from './assets/preload-webp-local.webp';

// Mock all the image imports for the local images as they're not getting
// compiled anywhere during a Jest test.  (Note: js-dom also doesn't like
// webp files yet, so just fudge that as a jpeg)
jest.mock('./assets/preload-gif-local.gif', () => {
	return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
});
jest.mock('./assets/preload-jpg-local.jpg', () => {
	return 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wgARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAX8P/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABAf/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPxB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPxB//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxB//9k=';
});
jest.mock('./assets/preload-png-local.png', () => {
	return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';
});
jest.mock('./assets/preload-svg-local.svg', () => {
	return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB3aWR0aD0iMTAwIgogICBoZWlnaHQ9IjEwMCI+CiAgICA8cmVjdAogICAgICAgd2lkdGg9IjEwMCIKICAgICAgIGhlaWdodD0iMTAwIgogICAgICAgc3R5bGU9ImZpbGw6IzY2NjsiIC8+Cjwvc3ZnPgo=';
});
jest.mock('./assets/preload-webp-local.webp', () => {
	// return 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAAFZQOCAaAAAAMAEAnQEqAQABAACADiWkAANwAP7/YBgAAAA=';
	return 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wgARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAX8P/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABAf/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPxB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPxB//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxB//9k=';
});

describe('Example app', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		cleanup();
		// Remove the webp from the list of images as we can't use webp with js-dom yet
		const mockStaticFiles = jest
			.fn()
			.mockReturnValue([
				'https://images.ctfassets.net/5u9bdkiurmat/LK1oUtgrb0X0w8Kx4aUuo/6656c80360b15d01236d0c595af236c8/preload-svg-remote.svg'
			]);
		Config.getDynamicFiles = mockStaticFiles;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	afterAll((done) => {
		cleanup();
		done();
	});

	it('renders without crashing', (done) => {
		const spyEffect = jest.spyOn(React, 'useEffect');
		spyEffect.mockImplementationOnce(jest.fn());

		act(() => {
			render(<App />);
		});
		waitFor(() => {
			expect(screen.getByText('Status: In progress')).toBeInTheDocument();
			expect(screen.getByText('Loading...')).toBeInTheDocument();
			done();
		});
	});

	it('renders all local, remote and dynamic images', (done) => {
		if (gif && jpeg && png && svg && webp) {
			waitFor(() => {
				act(() => {
					render(<App />);
				});
			});
			waitFor(() => {
				expect(screen.getByAltText('gif-1')).toBeInTheDocument();
				expect(screen.getByAltText('jpg-1')).toBeInTheDocument();
				expect(screen.getByAltText('png-1')).toBeInTheDocument();
				expect(screen.getByAltText('svg-1')).toBeInTheDocument();
				// Can't test for this at the moment, as had to convert it to JPEG
				// to not have Jest throw errors
				// expect(screen.getByAltText('webp-1')).toBeInTheDocument();
				expect(
					screen.getByText('Not loaded: webp-1')
				).toBeInTheDocument();

				expect(
					screen.getByAltText('preload-gif-remote')
				).toBeInTheDocument();
				expect(
					screen.getByAltText('preload-jpg-remote')
				).toBeInTheDocument();
				expect(
					screen.getByAltText('preload-png-remote')
				).toBeInTheDocument();
				expect(
					screen.getByAltText('preload-svg-remote')
				).toBeInTheDocument();
				// Can't test for this at the moment as js-dom can't handle webp files
				// expect(screen.getByAltText('preload-webp-remote')).toBeInTheDocument();
				expect(
					screen.getByText('Not loaded: preload-webp-remote')
				).toBeInTheDocument();
			});

			waitFor(() => {
				expect(
					screen.getByText('Status: Completed successfully')
				).toBeInTheDocument();
				done();
			});
		} else {
			fail('Unable to read in images');
		}
	});

	it('handles and renders errors', (done) => {
		const mockStaticCallback = jest.fn().mockReturnValue(false);
		Config.getCallerSuccess = mockStaticCallback;
		act(() => {
			render(<App />);
		});
		waitFor(() => {
			expect(screen.getByText('Failed to load')).toBeInTheDocument();
			expect(
				screen.getByText('Status: Completed with errors')
			).toBeInTheDocument();
			done();
		});
	});
});
