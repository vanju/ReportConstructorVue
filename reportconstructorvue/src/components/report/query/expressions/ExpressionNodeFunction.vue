<script>

    import ExpressionNode from './ExpressionNode.vue';

    export default {
        extends: ExpressionNode,
        components: {

        },
        methods: {

        }
    }

</script>

<template>
    <span class="expression-node-function" 
          v-bind:class="{selected: isNodeSelected()}" 
          v-on:click="setSelectedNode(model.ExpressionNode, $event)" 
          v-on:contextmenu="showContextMenu(model.ExpressionNode, $event)"
    >
        <span>New</span>
    </span>
</template>

<style>
    .expression-node-function.selected {
        background-color: grey;
    }

    .expression-node-function {
        cursor: pointer;
        user-select: none;
    }
</style>