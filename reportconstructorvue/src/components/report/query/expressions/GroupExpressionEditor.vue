<script>
    import ExpressionEditor from './ExpressionEditor.vue';
    import MenuBuilderProvider from '/src/libs/group-menu-builder.js';
    import ExpressionNodeGroupByContainer from './ExpressionNodeGroupByContainer.vue';

    export default {
        name: 'GroupExpressionEditor',
        extends: ExpressionEditor,
        components: {
            ExpressionEditor: ExpressionEditor,
            ExpressionNodeGroupByContainer: ExpressionNodeGroupByContainer
        },
        props: {
            queryId: {
                type: Number,
                default: 10
            },
            rootId: {
                type: Number,
                default: 4586
            }
        },
        methods: {

        },
        async created() {
            let response = await this.$fetch('/expression-node/tree/?id=' + this.rootId + '&clause=groupby', { method: 'GET', mock: false });

            if (response.Success == true) {

                this.model.ExpressionNode = response.Data.ExpressionNode;
                // this.model.ExpressionNodeCandidate = response.Data.ExpressionNodeCandidate;
                this.model.SourceCatalog = response.Data.SourceColumnCatalog.map(e => { return { Id: e.Id, Alias: e.Alias }; });

                this.$options.menuBuilder = MenuBuilderProvider.getBuilder(this.model.ExpressionNode);
                this.model.Menu = this.$options.menuBuilder.generateStaticMenu();

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
                <expression-node-group-by-container v-bind:init-expression-node="model.ExpressionNode"
                                                    v-bind:key="treeVersion"
                                                    v-bind:parent-id="model.ExpressionNode.ParentId"
                                                    >
                </expression-node-group-by-container>
                <!--
                <expression-node-group-by-container v-bind:init-expression-node="model.ExpressionNodeCandidate"
                                                    v-bind:key="treeVersion"
                                                    v-bind:parent-id="model.ExpressionNode.ParentId"
                                                    v-bind:show-table-header="false">
                </expression-node-group-by-container>
                -->
            </div>
            <div class="fl-col predicate-controls">
                <button type="button" v-for="(item, i) in model.Menu" v-bind:data-action="item.Command.Action" v-on:click="onStaticMenuCommandSelected(item.Command)">{{item.Name}}</button>
            </div>
        </div>

        <context-menu 
            v-bind:key="contextMenuVersion" 
            v-bind:init-list="getContextMenuItems()" 
            v-bind:left="left"
            v-bind:top="top"
            v-bind:bottom="bottom"
            v-bind:aval-y="avalY"
            v-on:drop-list-item-selected="onCommandSelected"
        >
        </context-menu>

    </div>
    
</template>

<style>
    .source-expression-editor {
        width: 100%;
    }

    .source-button {
        display: block;
        width: 100%;
    }

    .max-width {
        width: 100%;
    }

    .context-menu-wrapper {
        position: relative;
    }

    .expression-node-tree {
        flex-grow: 5;
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