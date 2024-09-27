
import Utils from './utils';
import commandFactory from './command-builder.js';

export default class MenuBuilder {

    selectedNode;
    selectedParentNode;
    rootNode;
    utils;

    operatorCatalog;
    dataPrototypeCatalog;
    dataPrototypeConversionCatalog;
    sourceColumnCatalog;
    functionCatalog;

    constructor(rootNode, utils) {

        this.rootNode = rootNode;
        this.utils = utils;
    }

    setOperatorCatalog(catalog) {
        this.operatorCatalog = catalog;
    }

    setDataPrototypeCatalog(catalog) {
        this.dataPrototypeCatalog = catalog;
    }

    setDataPrototypeConversionCatalog(catalog) {
        this.dataPrototypeConversionCatalog = catalog;
    }

    setSourceColumnCatalog(catalog) {
        this.sourceColumnCatalog = catalog;
    }

    setFunctionCatalog(catalog) {
        this.functionCatalog = catalog;
    }

    getOperatorMenu() {

        let menu = [];

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

    generateUpdateOperatorMenu(rootMenu, operators, useWrapper) {
        this.generateOperatorMenu(rootMenu, operators, useWrapper, commandFactory.buildUpdateCommand);
    }

    generateCreateOperatorMenu(rootMenu, operators, useWrapper) {
        this.generateOperatorMenu(rootMenu, operators, useWrapper, commandFactory.buildCreateCommand);
    }

    generateOperatorMenu(rootMenu, operators, useWrapper, buildFunc) {

        let container = rootMenu;

        if (useWrapper) {
            rootMenu.push({ Name: 'Add operator', Children: [] });
            container = rootMenu[rootMenu.length - 1].Children;
        }

        operators.forEach(op => {

            let command = buildFunc(this.selectedNode, {
                NodeType: op.Category == "joins" ? "container" : "operator",
                Role: op.Category == "joins" ? "operator" : "",
                Value: op.Id.toString()
            });

            container.push({
                Name: op.Name,
                Category: "operator",
                Command: command
            });
        });
    }

    generateCommonUpdateOperatorMenu(rootMenu, operators, useWrapper) {
        this.generateCommonOperatorMenu(rootMenu, operators, useWrapper, commandFactory.buildUpdateCommand);
    }

    generateCommonCreateOperatorMenu(rootMenu, operators, useWrapper) {
        this.generateCommonOperatorMenu(rootMenu, operators, useWrapper, commandFactory.buildCreateCommand);
    }

    generateCommonOperatorMenu(rootMenu, operators, useWrapper, buildFunc) {

        let container = rootMenu;

        if (useWrapper) {
            rootMenu.push({ Name: 'Add operator', Children: [] });
            container = rootMenu[rootMenu.length - 1].Children;
        }

        let arithmeticOperatorMenu = {
            Name: 'Arithmetic',
            Children: []
        };

        let stringOperatorMenu = {
            Name: 'String',
            Children: []
        };

        container.push(arithmeticOperatorMenu, stringOperatorMenu);

        operators.forEach(operator => {

            let command = buildFunc(this.selectedNode, {
                NodeType: 'operator',
                Role: '',
                Value: operator.Id.toString()
            });

            let menuItem = {
                Name: operator.Name,
                Command: command
            };

            if (operator.Category == 'arithmetic') {
                arithmeticOperatorMenu.Children.push(menuItem);
            } else if (operator.Category == 'string') {
                stringOperatorMenu.Children.push(menuItem);
            }
        });
    }

    getFunctionMenu() {
        let menu = [];
        this.generateDeleteMenu(menu);
        return menu;
    }

    generateFunctionMenu(rootMenu, targetFunctions, targetProto, useWrapper) {

        let container = rootMenu;

        if (useWrapper) {
            rootMenu.push({ Name: 'Function', Children: [] });
            container = rootMenu[rootMenu.length - 1].Children;
        }

        targetFunctions.forEach(category => {

            let functionMenu = {
                Name: category.Name,
                Children: []
            };

            category.Children.forEach(func => {

                let proposedDataPrototype = this.dataPrototypeCatalog.find(e => e.Category == func.ReturnDataPrototypeSqlName && e.IsMain == true);

                let status = this.getConversionStatus(targetProto, proposedDataPrototype);

                if (status != 'x') {

                    let style = '';

                    if (status == 'i') {
                        if (func.ReturnDataPrototype.Category != targetProto.Category) {
                            style = 'yellow';
                        }
                    } else if (status == 'e' || status == 'c') {
                        style = 'red';
                    }

                    let command = commandFactory.buildCreateCommand(this.selectedNode, {
                        NodeType: 'container',
                        Role: 'function',
                        Value: func.Id.toString(),
                        AltValue: func.SqlName
                    });

                    functionMenu.Children.push({
                        Name: func.Name,
                        Style: style,
                        Command: command
                    });
                }
            });

            container.push(functionMenu);

        });
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
            this.generateFunctionMenu(menu, this.functionCatalog, targetProto, true);
        }

        this.generateOrderMenu(menu, false);
        this.generateDeleteMenu(menu);

        return menu;
    }

    generateAddGroupMenu(menu, menuItemName) {

        if (this.selectedParentNode.NodeType == 'container' && this.selectedParentNode.Role == 'set') {
            return;
        }

        let command = commandFactory.buildCreateCommand(this.selectedNode, {
            NodeType: 'container',
            Role: 'group',
            Value: ''
        });

        menu.push({ Name: menuItemName, Command: command});
    }

    generateAddPredicateMenu(menu, menuItemName) {

        let command = commandFactory.buildCreateCommand(this.selectedNode, {
            NodeType: 'container',
            Role: 'predicate',
            Value: ''
        });

        menu.push({ Name: menuItemName, Command: command });
    }

    generateOrderMenu(rootMenu, useWrapper) {
        
        if (this.selectedParentNode.NodeType == 'container' && this.selectedParentNode.Role == 'predicate') {
            let op = this.selectedParentNode.Children.find(e => e.Order == 2);
            if (op.Operator.InnerName == 'between' || op.Operator.InnerName == 'in') {
                return;
            }
        }

        let container = rootMenu;

        if (useWrapper) {
            rootMenu.push({ Name: 'Order', Children: [] });
            container = rootMenu[rootMenu.length - 1].Children;
        }

        let isBlockView = this.selectedParentNode.Role == 'operator' || this.selectedParentNode.View == 'grid' || this.selectedParentNode.View == 'list';


        if (this.selectedNode.Order < this.selectedParentNode.Children.length) {
            let commandDown = commandFactory.buildUpdateNodeOrderCommand(this.selectedNode, {
                Value: 'down'
            });

            container.push({
                Name: isBlockView ? 'Move Down' : 'Move Right',
                Command: commandDown
            });
        }

        if (this.selectedNode.Order > 1) {
            let commandUp = commandFactory.buildUpdateNodeOrderCommand(this.selectedNode, {
                Value: 'up'
            });

            container.push({
                Name: isBlockView ? 'Move Up' : 'Move Left',
                Command: commandUp
            });
        }
    }

    generateColumnMenu(rootMenu, targetSources, targetProto, useWrapper) {

        let container = rootMenu;

        if (useWrapper) {
            rootMenu.push({ Name: 'Column', Children: [] });
            container = rootMenu[rootMenu.length - 1].Children;
        }
        
        targetSources.forEach(source => {

            let sourceMenu = {
                Name: source.Table.Name + ' (' + source.Alias + ')',
                Category: 'source-column',
                Children: []
            };

            source.Table.Columns.forEach(column => {

                let status = this.getConversionStatus(targetProto, column.DataPrototype);

                if (status != 'x') {

                    let style = '';

                    if (status == 'i') {
                        if (column.DataPrototype.Category != targetProto.Category) {
                            style = 'yellow';
                        }
                    } else if (status == 'e' || status == 'c') {
                        style = 'red';
                    }

                    let command = commandFactory.buildCreateCommand(this.selectedNode, {
                        NodeType: 'source-column',
                        Role: '',
                        SourceId: source.Id,
                        Value: column.Id.toString(),
                        AltValue: column.DBName
                    });

                    sourceMenu.Children.push({
                        Name: column.Name,
                        Category: 'source-column',
                        Style: style,
                        Command: command
                    });
                }
            });

            container.push(sourceMenu);

        });
    }

    generateConstantMenu(rootMenu, protos, targetProto, useWrapper) {

        let container = rootMenu;

        if (useWrapper) {
            rootMenu.push({ Name: 'Constant', Children: [] });
            container = rootMenu[rootMenu.length - 1].Children;
        }

        protos.forEach(proto => {

            if (proto.IsStandard == false) {
                return;
            }
            
            let status = this.getConversionStatus(targetProto, proto);

            if (status != 'x') {

                let style = '';

                if (status == 'i') {
                    if (proto.Category != targetProto.Category) {
                        style = 'yellow';
                    }
                    
                } else if (status == 'e' || status == 'c') {
                    style = 'red';
                }

                let command = commandFactory.buildCreateCommand(this.selectedNode, {
                    NodeType: 'constant',
                    Role: '',
                    DataPrototype: null,
                    Value: proto.Id.toString(),
                    SourceId: null
                });

                container.push({
                    Name: proto.Name,
                    Category: 'constant',
                    Style: style,
                    Command: command
                });
            }
        });
    }

    getConversionStatus(proto1, proto2) {

        if (proto1.SqlName == proto2.SqlName) {
            return 'w';
        }

        if (proto1.SqlName == 'convertible' || proto1.SqlName == 'undefined') {
            //return 'w';
        }

        if (proto2.SqlName == 'convertible' || proto2.SqlName == 'undefined') {
            //return 'w';
        }

        let protoFrom = proto1.Precedence < proto2.Precedence ? proto2 : proto1;
        let protoTo = proto1.Precedence < proto2.Precedence ? proto1 : proto2;
        let conversionOptions = this.dataPrototypeConversionCatalog.find(e => e.DataPrototypeSqlName == protoFrom.SqlName);

        return conversionOptions[protoTo.SqlName + '_t'];
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

    generateDeleteMenu(rootMenu) {

        let hasDeleteMenuItem = false;
        let hasClearMenuItem = this.selectedNode.NodeType != 'new';


        if (this.selectedParentNode.NodeType == 'container') {

            if (this.selectedParentNode.Role == 'predicate') {

            } else if (this.selectedParentNode.Role == 'set') {
                if (this.selectedParentNode.View == 'sequence' && this.selectedParentNode.Children.length > 1) {
                    hasDeleteMenuItem = true;
                }
            } else if (this.selectedParentNode.Role == 'from') {
                hasDeleteMenuItem = true;
            } else if (this.selectedParentNode.Role == 'where') {
                hasDeleteMenuItem = true;
            } else if (this.selectedParentNode.Role == 'select') {
                hasDeleteMenuItem = true;
            } else if (this.selectedParentNode.Role == 'groupby') {
                hasDeleteMenuItem = true;
                hasClearMenuItem = false;
            } else {
                if (this.selectedParentNode.Children.length > 1) {
                    hasDeleteMenuItem = true;
                }
            }
        } 

        if (hasClearMenuItem) {
            rootMenu.push({
                Name: 'Clear',
                Command: commandFactory.buildClearCommand(this.selectedNode)
            });
        }

        if (hasDeleteMenuItem) {
            rootMenu.push({
                Name: 'Delete',
                Command: commandFactory.buildDeleteCommand(this.selectedNode)
            });
        }
    }

    getMenu(selectedNode) {

        this.selectedNode = selectedNode;
        this.selectedParentNode = this.utils.findParent(this.rootNode, this.selectedNode.Path);

        if (selectedNode.NodeType == 'container') {

            if (selectedNode.Role == 'predicate') {
                return this.getPredicateMenu();
            } else if (selectedNode.Role == 'group') {
                return this.getGroupMenu();
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