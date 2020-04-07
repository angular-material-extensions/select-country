'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">select-country documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/MatSelectCountryModule.html" data-type="entity-link">MatSelectCountryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MatSelectCountryModule-5546b92529e431848a8584b94d5d4faf"' : 'data-target="#xs-components-links-module-MatSelectCountryModule-5546b92529e431848a8584b94d5d4faf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MatSelectCountryModule-5546b92529e431848a8584b94d5d4faf"' :
                                            'id="xs-components-links-module-MatSelectCountryModule-5546b92529e431848a8584b94d5d4faf"' }>
                                            <li class="link">
                                                <a href="components/MatSelectCountryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatSelectCountryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/InsertChange.html" data-type="entity-link">InsertChange</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoopChange.html" data-type="entity-link">NoopChange</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveChange.html" data-type="entity-link">RemoveChange</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReplaceChange.html" data-type="entity-link">ReplaceChange</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppShellBuilderOptions.html" data-type="entity-link">AppShellBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BrowserBuilderBaseOptions.html" data-type="entity-link">BrowserBuilderBaseOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BrowserBuilderOptions.html" data-type="entity-link">BrowserBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BuilderTarget.html" data-type="entity-link">BuilderTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Change.html" data-type="entity-link">Change</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Country.html" data-type="entity-link">Country</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/E2EOptions.html" data-type="entity-link">E2EOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtractI18nOptions.html" data-type="entity-link">ExtractI18nOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileReplacements.html" data-type="entity-link">FileReplacements</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Host.html" data-type="entity-link">Host</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LibraryBuilderOptions.html" data-type="entity-link">LibraryBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LintBuilderOptions.html" data-type="entity-link">LintBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Location.html" data-type="entity-link">Location</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModuleOptions.html" data-type="entity-link">ModuleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NodeDependency.html" data-type="entity-link">NodeDependency</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Schema.html" data-type="entity-link">Schema</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServeBuilderOptions.html" data-type="entity-link">ServeBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServerBuilderOptions.html" data-type="entity-link">ServerBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TestBuilderOptions.html" data-type="entity-link">TestBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WorkspaceProject.html" data-type="entity-link">WorkspaceProject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WorkspaceSchema.html" data-type="entity-link">WorkspaceSchema</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WorkspaceTargets.html" data-type="entity-link">WorkspaceTargets</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});