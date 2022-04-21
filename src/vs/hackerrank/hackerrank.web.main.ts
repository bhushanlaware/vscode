/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { ITitleService } from 'vs/workbench/services/title/common/titleService';
import { TitlebarWithTogglePreview } from 'vs/workbench/contrib/vscode-preview-toggle/browser/togglePreview.contribution';

registerSingleton(ITitleService, TitlebarWithTogglePreview);
