"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const schematics_utilities_1 = require("schematics-utilities");
/** Loads the full version from the given Angular package gracefully. */
function loadPackageVersionGracefully() {
    try {
        console.log('@angular-material-extensions/select-country version = ', require(`../../package.json`).version);
        return require(`../../package.json`).version;
    }
    catch (_a) {
        return null;
    }
}
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function addPackageJsonDependencies() {
    return (host, context) => {
        const dependencies = [
            {
                type: schematics_utilities_1.NodeDependencyType.Default, version: loadPackageVersionGracefully()
                    || '1.0.0', name: '@angular-material-extensions/select-country'
            },
        ];
        dependencies.forEach(dependency => {
            schematics_utilities_1.addPackageJsonDependency(host, dependency);
            context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}
exports.addPackageJsonDependencies = addPackageJsonDependencies;
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.log('info', `🔍 Installing packages...`);
        return host;
    };
}
exports.installPackageJsonDependencies = installPackageJsonDependencies;
function addModuleToImports(options) {
    return (host, context) => {
        const workspace = schematics_utilities_1.getWorkspace(host);
        const project = schematics_utilities_1.getProjectFromWorkspace(workspace, 
        // Takes the first project in case it's not provided by CLI
        options.project ? options.project : Object.keys(workspace.projects)[0]);
        const moduleName = `MatSelectCountryModule`;
        schematics_utilities_1.addModuleImportToRootModule(host, moduleName, '@angular-material-extensions/select-country', project);
        context.logger.log('info', `✅️ "${moduleName}" is imported`);
        return host;
    };
}
exports.addModuleToImports = addModuleToImports;
/** Gets the version of the specified package by looking at the package.json in the given tree. */
function getPackageVersionFromPackageJson(tree, name) {
    if (!tree.exists('package.json')) {
        return null;
    }
    // tslint:disable-next-line:no-non-null-assertion
    const packageJson = JSON.parse(tree.read('package.json').toString('utf8'));
    if (packageJson.dependencies && packageJson.dependencies[name]) {
        return packageJson.dependencies[name];
    }
    return null;
}
exports.getPackageVersionFromPackageJson = getPackageVersionFromPackageJson;
function addLibAssetsToAssets(options) {
    return (host, context) => {
        const lib = '@angular-material-extensions/select-country';
        const assetPath = 'node_modules/@angular-material-extensions/select-country/assets/';
        try {
            const angularJsonFile = host.read('angular.json');
            if (angularJsonFile) {
                const angularJsonFileObject = JSON.parse(angularJsonFile.toString('utf-8'));
                const project = options.project ? options.project : Object.keys(angularJsonFileObject.projects)[0];
                const projectObject = angularJsonFileObject.projects[project];
                const assets = projectObject.architect.build.options.assets;
                context.logger.log('info', `"${assets}`);
                assets.push({
                    glob: '**/*',
                    input: assetPath,
                    output: './assets/'
                });
                host.overwrite('angular.json', JSON.stringify(angularJsonFileObject, null, 2));
                context.logger.log('info', `✅️ Added "${lib}" icons to assets`);
            }
        }
        catch (e) {
            context.logger.log('error', `🚫 Failed to add the icons "${lib}" to assets`);
            context.logger.log('error', e);
        }
        return host;
    };
}
function default_1(options) {
    return schematics_1.chain([
        options && options.skipPackageJson ? schematics_1.noop() : addPackageJsonDependencies(),
        options && options.skipPackageJson ? schematics_1.noop() : installPackageJsonDependencies(),
        options && options.skipModuleImport ? schematics_1.noop() : addModuleToImports(options),
        options && options.skipPolyfill ? schematics_1.noop() : addLibAssetsToAssets(options)
    ]);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map