<script>

    import ExpressionNode from './ExpressionNode.vue';

    export default {
        extends: ExpressionNode,
        inject: ['updateExpressionNodeSourceAlias'],
        data() {
            return {
                tempValue: null
            }
        },
        methods: {
            onFocusIn(e) {
                this.tempValue = this.model.ExpressionNode.Source.Alias;
            },
            onFocusOut(e) {
                if (this.tempValue != this.model.ExpressionNode.Source.Alias) {
                    this.updateExpressionNodeSourceAlias(this.model.ExpressionNode);
                }
            }
        }
    }

</script>

<template>
    <span class="expression-node-source">
        <span class="source-table" 
            v-bind:class="{selected: isNodeSelected()}"
            v-on:click="setSelectedNode(model.ExpressionNode, $event)"
            v-on:contextmenu="showContextMenu(model.ExpressionNode, $event)">
            {{ model.ExpressionNode.Source.Table.Name }}
        </span>
        <span v-if="false" class="divider">|</span>
        <span class="alias-wrapper">
            Alias:<input class="alias" type="text" v-on:focusout="onFocusOut" v-on:focusin="onFocusIn" v-model="model.ExpressionNode.Source.Alias" />
        </span>
    </span>
</template>

<style>
    .source-table.selected {
        background-color: grey;
    }

    .expression-node-source {
        cursor: pointer;
        user-select: none;
    }

    .expression-node-source .alias {
        min-width: 15px;
        width: 50px;
        border-width: 0 0 1px 0;
    }

    .expression-node-source .divider {
        margin: 0 15px 0 15px;
    }
</style>
