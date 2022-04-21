/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
// import { Event } from 'vs/base/common/event';

export const ITogglePreviewService = createDecorator<ITogglePreviewService>('togglePreviewService');

export interface ITogglePreviewService {

	readonly _serviceBrand: undefined;

	// /**
	//  * An event when the menubar visibility changes.
	//  */
	// readonly onMenubarVisibilityChange: Event<boolean>;

	/**
	 * Update some environmental title properties.
	 */

}
