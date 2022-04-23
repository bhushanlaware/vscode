import * as React from 'react';
import { BUNDLER_URL } from './constants';
import { Resize } from './preview-resize';

export default function app() {
	return (
		<Resize isResponsiveEnabled>
			<iframe src={BUNDLER_URL} height="100%" width="100%"></iframe>
		</Resize>
	);
}
