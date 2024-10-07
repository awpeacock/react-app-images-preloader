process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';
require('react-scripts/config/env');

const path = require('path');
const createJestConfig = require('react-scripts/scripts/utils/createJestConfig');

const cjc = createJestConfig(
	(relativePath) => require.resolve(path.join('react-scripts', relativePath)),
	__dirname, // given that Jest config is in project root
	false
);

cjc.collectCoverage = true;
cjc.coveragePathIgnorePatterns = ['index.tsx', 'Config.ts'];
cjc.testEnvironmentOptions = { resources: 'usable' };

module.exports = cjc;
