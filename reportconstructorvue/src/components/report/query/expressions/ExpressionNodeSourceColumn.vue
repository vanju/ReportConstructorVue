<script>

    import ExpressionNode from './ExpressionNode.vue';

    export default {
        extends: ExpressionNode,
        inject: ['getSourceAliasById'],
        methods: {

        },
        computed: {
            sourceAlias() {
                // return this.getSourceAliasById(this.model.ExpressionNode.SourceColumn.SourceId) + '.' + this.model.ExpressionNode.SourceColumn.Column.Name;
            },
            sourceColumnFullName() {
                return this.getSourceAliasById(this.model.ExpressionNode.SourceColumn.SourceId) + '.' + this.model.ExpressionNode.SourceColumn.Column.Name;
            }
        },
        created() {
            // this.model.SourceAlias = this.model.ExpressionNode.SourceColumn.Source.Alias;
            // this.model.ExpressionNode.SourceColumn.Source.Alias = null;
        }
    }

</script>

<template>

    <span class="expression-node-source-column"
          v-bind:class="{selected: isNodeSelected()}"
          v-on:click="setSelectedNode(model.ExpressionNode, $event)"
          v-on:contextmenu="showContextMenu(model.ExpressionNode, $event)">

        {{ sourceColumnFullName }}
    </span>

</template>

<style>
    .expression-node-source-column.selected {
        background-color: grey;
    }

    .expression-node-source-column {
        /*
        padding-left: 10px;
        padding-right: 10px;
        */
        cursor: pointer;
        white-space: nowrap;
    }
</style>