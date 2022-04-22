import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const resizePreviewWebViewProvider = new ResizePreviewWebViewProvider(
		context.extensionUri
	);

	const externalResourcesWebViewPanel =
		vscode.window.registerWebviewViewProvider(
			"hackerrank.resize-preview",
			resizePreviewWebViewProvider,
			{
				webviewOptions: {
					retainContextWhenHidden: true,
				},
			}
		);

	context.subscriptions.push(externalResourcesWebViewPanel);
}

// this method is called when your extension is deactivated
export function deactivate() {}

class ResizePreviewWebViewProvider implements vscode.WebviewViewProvider {
	private _view?: vscode.WebviewView;

	private watchFileURI?: vscode.Uri;

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		token: vscode.CancellationToken
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [this._extensionUri],
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage((data) => {
			switch (data.type) {
				case "onMount": {
					// this.init();
					break;
				}
				case "updateIndexHTMLContent":
					// this.writeToIndexHTMLFile(data.payload);
					break;
			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
		);

		const styleMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
		);

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">

        <!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; connect-src https: wss:">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleMainUri}" rel="stylesheet">

				<title>External Resources</title>
			</head>
			<body>
				<div id='root'></div>

				<script nonce="${nonce}" src="${scriptUri}"></script>

			</body>
		</html>
	`;
	}
}

function getNonce() {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
