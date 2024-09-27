<script>
    import ExpressionEditor from './ExpressionEditor.vue';
    import MenuBuilderProvider from '/src/libs/select-menu-builder.js';
    import ExpressionNodeListContainer from './ExpressionNodeListContainer.vue';

    export default {
        name: 'SelectExpressionEditor',
        extends: ExpressionEditor,
        components: {
            ExpressionEditor: ExpressionEditor,
            ExpressionNodeListContainer: ExpressionNodeListContainer
        },
        props: {
            queryId: {
                type: Number,
                default: 10
            },
            rootId: {
                type: Number,
                default: 4503
            }
        },
        methods: {

        },

        async created() {
            let response = await this.$fetch('/expression-node/tree/?id=' + this.rootId + '&clause=select', { method: 'GET', mock: false });

            if (response.Success == true) {

                this.model.ExpressionNode = response.Data.ExpressionNode;
                this.model.SourceCatalog = response.Data.SourceColumnCatalog.map(e => { return { Id: e.Id, Alias: e.Alias }; });

                this.$options.menuBuilder = MenuBuilderProvider.getBuilder(this.model.ExpressionNode);
                this.model.Menu = this.$options.menuBuilder.generateStaticMenu();

                this.$options.menuBuilder.setOperatorCatalog(response.Data.OperatorCatalog);
                this.$options.menuBuilder.setDataPrototypeCatalog(response.Data.DataPrototypeCatalog);
                this.$options.menuBuilder.setDataPrototypeConversionCatalog(response.Data.DataPrototypeConversionCatalog);
                this.$options.menuBuilder.setSourceColumnCatalog(response.Data.SourceColumnCatalog);
                this.$options.menuBuilder.setFunctionCatalog(response.Data.FunctionCatalog);

                console.log(this.$options.menuBuilder.functionCatalog);

                this.isLoaded = true;

            } else {
                alert('Unable to load expression node tree');
            }
        }
    }
</script>

<template>
    <div v-if="isLoaded" class="context-menu-wrapper" ref="editor">
        <slot name="header"></slot>
        <div class="fl-row">
            <div class="expression-node-tree">
                <expression-node-list-container v-if="true" v-bind:init-expression-node="model.ExpressionNode"
                                           v-bind:key="treeVersion"
                                           v-bind:parent-id="model.ExpressionNode.ParentId"
                                           >
                </expression-node-list-container>
            </div>
            <div class="fl-col predicate-controls">
                <button type="button" v-for="(item, i) in model.Menu" v-bind:data-action="item.Command.Action" v-on:click="onStaticMenuCommandSelected(item.Command)">{{item.Name}}</button>
            </div>
        </div>

        <context-menu v-bind:key="contextMenuVersion"
                      v-bind:init-list="getContextMenuItems()"
                      v-bind:left="left"
                      v-bind:top="top"
                      v-bind:bottom="bottom"
                      v-bind:aval-y="avalY"
                      v-on:drop-list-item-selected="onCommandSelected">
        </context-menu>

    </div>

</template>

<style>
    .context-menu-wrapper {
        position: relative;
        overflow: visible;
    }

    .expression-node-tree {
        flex-grow: 5;
        overflow: visible;
    }

    .predicate-controls {
        flex-grow: 1;
        border: 1px solid green;
        padding: 5px 10px;
    }

    .predicate-controls button {
        margin-bottom: 5px;
    }
</style>