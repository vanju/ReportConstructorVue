<script>
    import ExpressionNodeContainer from './ExpressionNodeContainer.vue';
    import ContextMenu from '/src/components/ui/dropdowns/ContextMenu.vue';
    import DropList from '/src/components/ui/dropdowns/DropList.vue';

    import { computed } from 'vue';
    import commandFactory from '/src/libs/command-builder.js';

    import Utils from '/src/libs/utils.js';

    export default {
        props: {
            queryId: {
                type: Number,
                default: 10
            },
            rootId: {
                type: Number,
                default: 994
            }
        },
        data() {
            return {
                model: {

                    ExpressionNode: {
                    /*
                        Id: '1',
                        Order: 1,
                        Type: 'container',
                        Role: 'root',
                        Path: '/1/',
                        Children: []
                    */
                    },
                    ExpressionNodeCandidate: {

                    }
                },
                entity: {

                },
                treeVersion: 0,
                selectedNodeInner: null,
                contextMenuVersion: 0,
                isContextMenuOpened: false,
                left: 0,
                top: 0,
                bottom: 0,
                avalY: 0,
                isLoaded: false
            };
        },
        computed: {
            selectedNode() {
                return this.selectedNodeInner == null ? this.model.ExpressionNode : this.selectedNodeInner;
            }
        },
        provide() {
            return {
                selectedNodeId: computed(() => this.selectedNode.Id),
                getSelectedNode: () => this.selectedNode,
                setSelectedNode: (node, event) => {

                    node.Id = node.Id;
                    console.log(node);

                    if (event != null)
                        event.stopPropagation();

                    this.selectedNodeInner = this.selectedNode.Id == node.Id ? null : node;
                },
                showContextMenu: (node, event) => {

                    event.stopPropagation();
                    event.preventDefault();

                    this.selectedNodeInner = node;

                    let rect = this.$refs.editor.getBoundingClientRect();
                    this.left = event.clientX - rect.left;
                    this.top = event.clientY - rect.top;
                    this.bottom = rect.bottom - event.clientY;
                    this.avalY = window.innerHeight - event.clientY;

                    this.isContextMenuOpened = true;
                    this.contextMenuVersion++;
                },
                updateExpressionNodeConstant: async (node) => {
                    let command = commandFactory.buildUpdateConstantCommand(node);
                    await this.execCommand(command);
                },
                updateExpressionNodeSourceAlias: async (node) => {
                    let command = commandFactory.buildUpdateSourceAliasCommand(node);
                    await this.execCommand(command);
                },
                updateExpressionNodeSelectAlias: async (node) => {
                    let command = commandFactory.buildUpdateSelectAliasCommand(node);
                    await this.execCommand(command);
                },
                getSourceAliasById: (id) => {
                    let source = this.model.SourceCatalog.find(e => e.Id == id);
                    return source.Alias;
                },
                addExpressionNodeWrapper: async (targetNode) => {
                    let command = commandFactory.buildCreateWrapperCommand(targetNode);

                    command.callback = (sourceNode) => {
                        Object.assign(targetNode, sourceNode);
                    };
                    await this.execCommand(command);
                },
                deleteExpressionNodeWrapper: async (node) => {
                    let command = commandFactory.buildDeleteCommand(node);
                    await this.execCommand(command);
                },
                updateExpressionNodeOrderDirection: async (targetNode) => {

                    let command = commandFactory.buildUpdateOrderDirectionCommand(targetNode);

                    command.callback = (sourceNode) => {
                        targetNode.Dir = sourceNode.Dir;
                    };
                    await this.execCommand(command);
                }
            }
        },
        components: {
            ExpressionNodeContainer,
            ContextMenu,
            DropList
        },
        methods: {

            async execCommand(command) {

                let response = await this.$fetch(command.getUrl(), { method: 'POST', body: JSON.stringify(command) });
                
                if (response.Success == true) {

                    if (response.Data.SourceColumnCatalog != null) {
                        this.$options.menuBuilder.setSourceColumnCatalog(response.Data.SourceColumnCatalog);
                        this.model.SourceCatalog = response.Data.SourceColumnCatalog.map(e => { return { Id: e.Id, Alias: e.Alias }; });
                    }

                    let updateMode = response.Data.TreeUpdateStrategy;

                    if (updateMode == 'error') {
                        alert('Node tree is not updated. Please reload page to see last changes');
                        return;
                    }

                    if (response.Data.ExpressionNodes.length > 0) {

                        if (updateMode == 'branch_update') {
                            let updatedBranch = response.Data.ExpressionNodes.pop();
                            let targetBranch = Utils.findNodeById(this.model.ExpressionNode, updatedBranch.Id);

                            Object.assign(targetBranch, updatedBranch);
                        } else if (updateMode == 'children_append') {

                            for (let i = 0; i < response.Data.ExpressionNodes.length; i++) {
                                this.selectedNode.Children.push(response.Data.ExpressionNodes[i]);
                            }

                        } else if (updateMode == 'self_update') {

                            let updatedNode = response.Data.ExpressionNodes.pop();

                            if (this.selectedNode.Id != updatedNode.Id) {

                                let targetNode = Utils.findNodeById(this.model.ExpressionNode, updatedNode.Id);
                                Object.assign(targetNode, updatedNode);
                            } else {
                                Object.assign(this.selectedNode, updatedNode);
                            }

                        } else if (updateMode == 'children_order_update') {

                            if (response.Data.ExpressionNodes.length == 2) {

                                let node0 = Utils.findNodeById(this.model.ExpressionNode, response.Data.ExpressionNodes[0]['Id']);
                                let node1 = Utils.findNodeById(this.model.ExpressionNode, response.Data.ExpressionNodes[1]['Id']);

                                node0.Order = response.Data.ExpressionNodes[0].Order;
                                node1.Order = response.Data.ExpressionNodes[1].Order;
                            }
                        } else if (updateMode == 'parent_update') {

                            let selectedParentNode = Utils.findNodeById(this.model.ExpressionNode, this.selectedNode.ParentId);
                            Object.assign(selectedParentNode, response.Data.ExpressionNodes.pop());

                        } else if (updateMode == 'root_update') {
                            Object.assign(this.model.ExpressionNode, response.Data.ExpressionNodes.pop());
                            this.treeVersion++;
                        } else if (updateMode == 'callback') {
                            let sourceNode = response.Data.ExpressionNodes.pop();
                            command.callback(sourceNode);
                        } else if (updateMode == 'self_alias_update') {

                        } else if (updateMode == 'default_update') {
                            let sourceNode = response.Data.ExpressionNodes.pop();
                            this.selectedNode.Alias = sourceNode.Alias;
                        } else {
                            alert('NodeTreeUpdateStrategy "' + updateMode + '" is not implemented yet');
                        }
                    }

                    if (response.Data.ResetSelectedNode == true) {
                        this.selectedNodeInner = this.model.ExpressionNode;
                    }

                } else {
                    alert('Unable to execute command');
                }
            },

            async onCommandSelected(menuCommand) {
                if (menuCommand) {
                    this.execCommand(menuCommand);
                }
            },
            async onStaticMenuCommandSelected(staticMenuCommand) {
                let command = commandFactory.build(this.selectedNode, staticMenuCommand);
                this.execCommand(command);
            },
            getContextMenuItems() {
                if (this.isContextMenuOpened) {
                    this.isContextMenuOpened = false;
                    return this.$options.menuBuilder.getMenu(this.selectedNode);
                }
            }
        }
    }
</script>
