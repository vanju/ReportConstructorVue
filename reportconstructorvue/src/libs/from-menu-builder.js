import Utils from './utils.js';
import MenuBuilder from './menu-builder.js';
import commandFactory from './command-builder.js';

export default class FromMenuBuilderProvider {

    static getBuilder(rootNode) {
        return new FromMenuBuilder(rootNode, Utils);
    }
}

class FromMenuBuilder extends MenuBuilder {

    tableCatalog;

    constructor(rootNode, utils) {
        super(rootNode, utils);
    }

    setTableCatalog(catalog) {
        this.tableCatalog = catalog;
    }

    getStaticAddSourceMenu() {
        let menu = [];
        this.selectedNode = this.rootNode;
        this.generateCreateSourceMenu(menu, false);
        return menu;
    }

    getSourceMenu() {
        let menu = [];
        this.generateUpdateSourceMenu(menu, false);
        this.generateDeleteMenu(menu);
        return menu;
    }

    getSourceColumnMenu() {
        let menu = [];
        this.generateDeleteMenu(menu);
        return menu;
    }

    getConstantMenu() {
        let menu = [];
        this.generateDeleteMenu(menu);
        return menu;
    }

    generateCreateSourceMenu(rootMenu, useWrapper) {
        this.generateSourceMenu(rootMenu, useWrapper, commandFactory.buildCreateCommand);
    }

    generateUpdateSourceMenu(rootMenu, useWrapper) {
        this.generateSourceMenu(rootMenu, useWrapper, commandFactory.buildUpdateCommand);
    }

    generateSourceMenu(rootMenu, useWrapper, buildFunc) {
        
        let container = rootMenu;

        if (useWrapper) {
            rootMenu.push({ Name: 'Add source', Children: [] });
            container = rootMenu[rootMenu.length - 1].Children;
        }

        this.tableCatalog.forEach(table => {

            let command = buildFunc(this.selectedNode, {
                NodeType: 'source',
                Role: '',
                Value: table.Id.toString(),
                AltValue: ''
            });

            container.push({
                Name: table.Name,
                Command: command
            });

        });
    }

    generateStaticMenu() {
        let menu = [
            {
                Name: "Add condition",
                Command: {
                    ActionHint: "create",
                    NodeType: "container",
                    Role: "predicate"
                }
            },
            {
                Name: "Delete",
                Command: {
                    ActionHint: "delete"
                }
            }
        ];

        return menu;
    }

    getJoinMenu() {

        let menu = [];
        let targetOperators = this.operatorCatalog.filter(e => e.ReturnDataPrototypeSqlName == 'data_source' && e.OperandDataPrototypeSqlName == 'data_source');
        this.generateUpdateOperatorMenu(menu, targetOperators, true);
        this.generateAddPredicateMenu(menu, 'Add condition');
        return menu;
    }

    getOperatorMenu() {

        let menu = [];

        let targetOperators = this.operatorCatalog.filter(e => e.InnerName == 'equal');
        this.generateUpdateOperatorMenu(menu, targetOperators, false);
        return menu;
    }

    getNewMenu() {
        let menu = [];

        let targetProto = this.dataPrototypeCatalog.find(e => e.SqlName == this.selectedNode.OperandDataPrototypeHint);
        let protos = this.dataPrototypeCatalog.filter(e => e.IsMain == true);

        this.generateConstantMenu(menu, protos, targetProto, true);
        this.generateColumnMenu(menu, targetProto, true);

        return menu;
    }

    generateColumnMenu(rootMenu, targetProto, useWrapper) {

        let join = this.utils.findNodeByPath(this.rootNode, this.utils.getSubPath(this.selectedNode.Path, -2));
        let joinParent = this.utils.findNodeByPath(this.rootNode, this.utils.getSubPath(this.selectedNode.Path, -3));
        let sourceIds = [];

        if (this.selectedNode.Order == 1) {

            let leftSource = joinParent.Children.filter(e => e.Order < join.Order);
            sourceIds = this.getSourceIds(leftSource);
        } else if (this.selectedNode.Order == 3) {

            let rightSource = joinParent.Children.find(e => e.Order == (join.Order + 1));
            sourceIds = this.getSourceIds([rightSource]);
        }

        let sources = this.sourceColumnCatalog.filter(e => sourceIds.indexOf(e.Id) != -1);

        super.generateColumnMenu(rootMenu, sources, targetProto, useWrapper);
    }

    getSourceIds(nodeArr) {
        return this.getSourceIdInner(nodeArr, []);
    }

    getSourceIdInner(nodeArr, result) {

        for (let i = 0; i < nodeArr.length; i++) {
            if (nodeArr[i].Source) {
                result.push(nodeArr[i].Source.Id);
            } else if (nodeArr[i].NodeType == 'container') {
                this.getSourceIdInner(nodeArr[i], result);
            }
        }

        return result;
    }

    getMenu(selectedNode) {

        this.selectedNode = selectedNode;
        this.selectedParentNode = this.utils.findParent(this.rootNode, this.selectedNode.Path);

        if (selectedNode.NodeType == 'container') {
            if (selectedNode.Role == 'operator') {
                return this.getJoinMenu();
            } else if (selectedNode.Role == 'predicate') {
                return this.getPredicateMenu();
            }
        } else if (selectedNode.NodeType == 'source') {
            return this.getSourceMenu();
        } else if (selectedNode.NodeType == 'operator') {
            return [];
        } else if (selectedNode.NodeType == 'new') {
            return this.getNewMenu();
        } else if (selectedNode.NodeType == 'source-column') {
            return this.getSourceColumnMenu();
        } else if (selectedNode.NodeType == 'constant') {
            return this.getConstantMenu();
        }
    }
}