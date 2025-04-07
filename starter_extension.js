const vscode = require("vscode");

const ERROR_THEME = "Red";
const OKAY_THEME = "Monokai";

class ErrorCountProvider {
  constructor(context) {
    this._view = null;
    this._errorCount = 0;
    this._context = context;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    this._updateWebview();
  }

  setErrorCount(count) {
    this._errorCount = count;
    this._updateWebview();
  }

  _updateWebview() {
    if (!this._view) return;

    // TODO: Update the webview content with correct error count
  }
}

function activate(context) {
  console.log("Error extension is now active.");
  const errorCountProvider = new ErrorCountProvider();
  vscode.window.registerWebviewViewProvider(
    "errorcounter.errorCount",
    errorCountProvider
  );

  const disposable = vscode.commands.registerCommand(
    "errorcounter.openSidebar",
    () => {
      vscode.commands.executeCommand("workbench.view.extension.errorcounter");
    }
  );
  context.subscriptions.push(disposable);

  // TODO: Register listeners for changes to the active editor
}

async function updateThemeBasedOnErrors(errorCountProvider, force = false) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const uri = editor.document.uri;
  const diagnostics = vscode.languages.getDiagnostics(uri);
  const errorCount = diagnostics.filter(
    (d) => d.severity === vscode.DiagnosticSeverity.Error
  ).length;

  errorCountProvider.setErrorCount(errorCount);

  const newTheme = errorCount > 0 ? ERROR_THEME : OKAY_THEME;
  const config = vscode.workspace.getConfiguration();
  const currentTheme = config.get("workbench.colorTheme");

  if (currentTheme !== newTheme || force) {
    await config.update(
      "workbench.colorTheme",
      newTheme,
      vscode.ConfigurationTarget.Global
    );
    console.log(
      `Switched theme to "${newTheme}" based on error count: ${errorCount}`
    );
  } else {
    console.log(
      `Theme "${currentTheme}" is already correct for error count: ${errorCount}`
    );
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
