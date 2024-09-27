<script>

    import ExpressionNode from './ExpressionNode.vue';

    export default {
        extends: ExpressionNode,
        methods: {

        }
    }

</script>

<template>

    <span class="expression-node-operator" 
          v-bind:class="{selected: isNodeSelected()}" 
          v-on:click="setSelectedNode(model.ExpressionNode, $event)" 
          v-on:contextmenu="showContextMenu(model.ExpressionNode, $event)">

        {{ model.ExpressionNode.Operator.Sign }}
    </span>

</template>

<style>
    .expression-node-operator.selected {
        background-color: grey;
    }

    .expression-node-operator {
        padding-left: 10px;
        padding-right: 10px;
        cursor: pointer;
        white-space: nowrap;
    }
</style>