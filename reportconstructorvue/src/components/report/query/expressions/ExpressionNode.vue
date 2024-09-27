<script>

    // import DropList from '/src/components/ui/dropdowns/DropList.vue';

    export default {
        props: ['parentPath', 'initExpressionNode'],
        inject: ['getSelectedNode', 'setSelectedNode', 'selectedNodeId', 'showContextMenu'],
        data() {
            return {
                model: {
                    ExpressionNode: this.initExpressionNode
                }
            };
        },
        components: {

        },
        emits: ['node-selected', 'node-unselected'],
        methods: {
            getComponentName(type) {

                let name = '';

                switch (type) {
                    case 'source-column':
                        name = 'SourceColumn';
                        break;
                    case 'constant':
                        name = 'Constant';
                        break;
                    case 'new':
                        name = 'New';
                        break;
                    case 'operator':
                        name = 'Operator';
                        break;
                    case 'container':
                        name = 'Container';
                        break;
                    case 'source':
                        name = 'Source';
                        break;
                }
                return 'ExpressionNode' + name;
            },
            isNodeSelected() {
                return this.model.ExpressionNode.Id == this.selectedNodeId;
            },
            onNodeTypeSelected(e) {
                this.$emit('node-type-changed', e.Value, this.model);
            },
            onContextMenuOpened(e) {
                if (!this.isNodeSelected()) {
                    this.setSelectedNode(this.model.ExpressionNode);
                }
            }
        },
        computed: {

        },
        created() {
            this.model.ExpressionNode.Path = this.parentPath ? (this.parentPath + '/' + this.model.ExpressionNode.Id) : this.model.ExpressionNode.Id.toString();
        },
        watch: {
            'initExpressionNode'(v) {
                v.Path = this.model.ExpressionNode.Path;
                this.model.ExpressionNode = v;
            }
        }
    }

</script>

<template>
    <div>hola!</div>
</template>

<style>

    .devider {
        padding-left: 3px;
        padding-right: 3px;
    }

    .expression-node-grid {
        grid-row-gap: 5px;
        position: relative;
        display: grid;
        grid-template-columns: min-content auto;
        padding: 3px;
        margin-bottom: 5px;
        width: 100%;
    }

    .expression-node-grid-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .expression-node-inline {
        display: inline;
    }

    .expression-node-predicate {
        display: inline;
    }

    .selector-wrapper {
        position: relative;
        width: 30px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        padding: 2px;
    }

    .expression-node-unvisible-operator {
        display: hidden;
    }

    .radio-btn:checked + .en-group-grid {
        background-color: grey;
    }

    .expression-node-new {
        border-bottom: 1px solid red;
    }

    .horizontal-en-operator {
        position: relative;
        top: -15px;
    }

    .en-group:first-child {
        /*background-color: grey;*/
    }

</style>
