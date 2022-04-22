/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from 'vs/base/common/lifecycle';
import { TitlebarPart } from 'vs/workbench/browser/parts/titlebar/titlebarPart';

import 'vs/css!./styles/index';
import { commands } from 'vs/workbench/workbench.web.api';

type SwitchContainer = HTMLDivElement &
	Readonly<{ input: HTMLInputElement; label: HTMLLabelElement }>;

export class TitlebarWithTogglePreview extends TitlebarPart implements Disposable {

	switchContainer!: SwitchContainer;
	isPreviewOpen = true;

	override createContentArea(parent: HTMLElement): HTMLElement {
		parent = super.createContentArea(parent);

		const switchContainer = this.createSwitchContainer();

		switchContainer.addEventListener('change', this.handleOnChange);

		const textElement = document.createElement('p');
		textElement.innerText = 'Output';

		const contentArea = document.createElement('div');
		contentArea.classList.add('vscode-preview-toggle-container');
		contentArea.appendChild(textElement);
		contentArea.appendChild(switchContainer);

		Object.assign(contentArea, { switchContainer });

		parent.appendChild(contentArea);

		this.switchContainer = switchContainer;
		this.toggleSwitch(this.isPreviewOpen);

		return parent;
	}


	handleOnChange = () => {
		this.isPreviewOpen = !this.isPreviewOpen;
		this.toggleSwitch(this.isPreviewOpen);
		commands.executeCommand('vscode-responsive-preview.togglePreview', this.isPreviewOpen);
	};

	public override dispose(): void {
		super.dispose();
		this.switchContainer.removeEventListener('change', this.handleOnChange);
	}


	toggleSwitch = (state: boolean): void => {
		if (state) {
			this.switchContainer.label.classList.add('checked');
		} else {
			this.switchContainer.label.classList.remove('checked');
		}
		this.switchContainer.input.checked = state;
	};

	createSwitchContainer(): SwitchContainer {
		const switchContainer = document.createElement('div');
		switchContainer.classList.add('vscode-switch-container');

		const label = document.createElement('label');
		label.classList.add('switch');

		const input = document.createElement('input');
		input.classList.add('toggle-input');
		input.type = 'checkbox';
		input.setAttribute('role', 'checkbox');

		const toggle = document.createElement('div');
		toggle.classList.add('toggle');

		label.appendChild(input);
		label.appendChild(toggle);

		switchContainer.appendChild(label);

		return Object.assign(switchContainer, { input, label });
	}

}
