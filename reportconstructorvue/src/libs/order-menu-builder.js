
import Utils from './utils';
import MenuBuilder from './menu-builder.js';

export default class OrderMenuBuilderProvider {

    static getBuilder(rootNode) {
        return new OrderMenuBuilder(rootNode, Utils);
    }
}

class OrderMenuBuilder extends MenuBuilder {

    constructor(rootNode, utils) {
        super(rootNode, utils);
    }

    getWrapperMenu() {

        let menu = [];

        if (this.selectedNode.Id < 0) {
            return menu;
        }

        this.generateOrderMenu(menu, false);
        this.generateDeleteMenu(menu);
        return menu;
    }

    getStaticGroupMenu() {
        return this.generateStaticMenu();
    }

    generateStaticMenu() {
        let menu = [
            {
                Name: "Order up",
                Command: {
                    ActionHint: "order",
                    Value: "up"
                }
            },
            {
                Name: "Order down",
                Command: {
                    ActionHint: "order",
                    Value: "down"
                }
            }
        ];

        return menu;
    }

    getMenu(selectedNode) {
        this.selectedNode = selectedNode;
        this.selectedParentNode = this.utils.findParent(this.rootNode, this.selectedNode.Path);

        if (selectedNode.NodeType == 'wrapper') {
            return this.getWrapperMenu();
        }
    }
}
