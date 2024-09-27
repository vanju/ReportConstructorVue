
import Utils from './utils';
import MenuBuilder from './menu-builder.js';
import commandFactory from './command-builder.js';

export default class WhereMenuBuilderProvider {

    static getBuilder(rootNode) {
        return new WhereMenuBuilder(rootNode, Utils);
    }
}

class WhereMenuBuilder extends MenuBuilder {

    constructor(rootNode, utils) {
        super(rootNode, utils);
    }

    getJoinMenu() {
        let menu = this.operatorMenu.Children.filter(e => e.Command.AltValue.indexOf('join') != -1);
        return menu;
    }

    getSourceMenu() {
        return [this.sourceMenu, this.deleteMenu];
    }

    getOperatorMenu() {

        let menu = [];

        //let isCreate = this.selectedParentNode.NodeType == 'operator' || (this.selectedParentNode.NodeType == 'container' && this.selectedParentNode.Role == 'operator');

        if (this.selectedParentNode.ActualDataPrototype == 'bool') {
            if (this.selectedParentNode.NodeType == 'container' && this.selectedParentNode.Role == 'predicate') {

                let targetOperators = this.operatorCatalog.filter(e => e.ReturnDataPrototypeSqlName == 'boolean' && e.OperandDataPrototypeSqlName != 'boolean');
                this.generateUpdateOperatorMenu(menu, targetOperators, false);

            } else {
                let targetOperators = this.operatorCatalog.filter(e => e.ReturnDataPrototypeSqlName == 'boolean' && e.OperandDataPrototypeSqlName == 'boolean');
                this.generateUpdateOperatorMenu(menu, targetOperators, false);
            }
        } else {
            let targetOperators = this.operatorCatalog.filter(e => e.Category == 'arithmetic' || e.Category == 'string');
            this.generateCommonUpdateOperatorMenu(menu, targetOperators, false);
        }

        return menu;
    }

    getPredicateMenu() {

        let menu = [];
        this.generateOrderMenu(menu, false);
        this.generateDeleteMenu(menu);
        return menu;
    }

    getNewMenu() {

        let menu = [];

        this.generateAddGroupMenu(menu, 'Group');

        if (this.selectedParentNode.NodeType == 'container' && this.selectedParentNode.Role == 'group' && this.selectedParentNode.ActualDataPrototype == 'bool') {
            this.generateAddPredicateMenu(menu, 'Predicate');
        } else {
            let targetProto = this.dataPrototypeCatalog.find(e => e.SqlName == this.selectedNode.OperandDataPrototypeHint);
            let protos = this.dataPrototypeCatalog.filter(e => e.IsMain == true);

            this.generateConstantMenu(menu, protos, targetProto, true);
            this.generateColumnMenu(menu, this.sourceColumnCatalog, targetProto, true);
        }

        this.generateOrderMenu(menu, false);
        this.generateDeleteMenu(menu);

        return menu;
    }

    getSourceColumnMenu() {
        let menu = [];
        this.generateOrderMenu(menu, false);
        this.generateDeleteMenu(menu);
        return menu;
    }

    getConstantMenu() {

        let menu = [];
        this.generateOrderMenu(menu, false);
        this.generateDeleteMenu(menu);
        return menu;
    }

    getGroupMenu() {

        let menu = [];

        if (this.selectedNode.ActualDataPrototype == 'bool') {

            let targetOperators = this.operatorCatalog.filter(e => e.ReturnDataPrototypeSqlName == 'boolean' && e.OperandDataPrototypeSqlName == 'boolean');
            this.generateCreateOperatorMenu(menu, targetOperators, true);
            this.generateAddPredicateMenu(menu, 'Add predicate');
        } else {
            let operators = this.operatorCatalog.filter(e => e.Category == 'arithmetic' || e.Category == 'string');
            this.generateCommonCreateOperatorMenu(menu, operators, true, true);
        }

        this.generateAddGroupMenu(menu, 'Add group');
        this.generateOrderMenu(menu);
        this.generateDeleteMenu(menu);

        return menu;
    }

    getSetMenu() {
        let menu = [];

        if (this.selectedNode.View == 'between' && this.selectedNode.Children.length == 2) {
            return menu;
        }

        let targetProto = this.dataPrototypeCatalog.find(e => e.SqlName == this.selectedNode.OperandDataPrototypeHint);
        let protos = this.dataPrototypeCatalog.filter(e => e.IsMain == true);

        this.generateConstantMenu(menu, protos, targetProto, true);
        this.generateColumnMenu(menu, this.sourceColumnCatalog, targetProto, true);

        return menu;
    }

    generateNewMenu() {

    }

    generateStaticMenu() {
        let menu = [
            {
                Name: "Add predicate",
                Command: {
                    ActionHint: "create",
                    NodeType: "container",
                    Role: "predicate"
                }
            },
            {
                Name: "Add group",
                Command: {
                    ActionHint: "create",
                    NodeType: "container",
                    Role: "group"
                }
            },
            {
                Name: "Delete",
                Command: {
                    ActionHint: "delete"
                }
            },
            {
                Name: "Order up",
                Command: {
                    ActionHint: "order"
                }
            },
            {
                Name: "Order down",
                Command: {
                    ActionHint: "order"
                }
            }
        ];

        return menu;
    }

    getMenu(selectedNode) {

        this.selectedNode = selectedNode;
        this.selectedParentNode = this.utils.findParent(this.rootNode, this.selectedNode.Path);

        if (selectedNode.NodeType == 'container') {

            if (selectedNode.Role == 'predicate') {
                return this.getPredicateMenu();
            } else if (selectedNode.Role == 'group') {
                return this.getGroupMenu();
            } else if (selectedNode.Role == 'set') {
                return this.getSetMenu();
            }

        } else if (selectedNode.NodeType == 'operator') {
            return this.getOperatorMenu();
        } else if (selectedNode.NodeType == 'new') {
            return this.getNewMenu();
        } else if (selectedNode.NodeType == 'source-column') {
            return this.getSourceColumnMenu();
        } else if (selectedNode.NodeType == 'constant') {
            return this.getConstantMenu();
        }
    }
}