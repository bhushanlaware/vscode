/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'vs/css!./styles/index';
// import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { TitlebarPart } from 'vs/workbench/browser/parts/titlebar/titlebarPart';
// import { ITitleService } from 'vs/workbench/services/title/common/titleService';
type SwitchContainer = HTMLDivElement &
	Readonly<{ input: HTMLInputElement; label: HTMLLabelElement }>;

export class TitlebarWithTogglePreview extends TitlebarPart implements Disposable {

	switchContainer!: SwitchContainer;

	override createContentArea(parent: HTMLElement): HTMLElement {
		parent = super.createContentArea(parent);

		const switchContainer = this.createSwitchContainer();

		const textElement = document.createElement('p');
		textElement.innerText = 'Output';

		const contentArea = document.createElement('div');
		contentArea.classList.add('vscode-preview-toggle-container');
		contentArea.appendChild(textElement);
		contentArea.appendChild(switchContainer);

		Object.assign(contentArea, { switchContainer });

		parent.appendChild(contentArea);

		return parent;
	}

	handleOnChange = async () => {
		// this.refresh();
		// const widget = await this.getWidget();
		// if (widget?.isVisible) {
		// 	this.shell.rightPanelHandler.tabBar.currentTitle = null;
		// } else {
		// 	try {
		// 		// TODO: import command from projects-run
		// 		// await this.commands.executeCommand('vscode-realtime-preview:command');
		// 		// await this.commands.executeCommand('mini-browser.openUrl', 'https://www.lola.com');
		// 		console.log('in handleOnChange');
		// 	} catch (err) {s
		// 		// this.messageService.error(
		// 		//   "Couldn't open preview. Please try again later.",
		// 		//   {
		// 		//     timeout: 5000,
		// 		//   }
		// 		// );
		// 	}
		// }
	};

	// refresh = async () => {
	// 	const widget = await this.getWidget();
	// 	if (widget?.isVisible) {
	// 		this.toggleSwitch(true);
	// 	} else {
	// 		this.toggleSwitch(false);
	// 	}
	// };

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
console.log('out TitlebarWithTogglePreview');
