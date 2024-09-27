<script>

    import ExpressionNode from './ExpressionNode.vue';

    export default {
        extends: ExpressionNode,
        inject: ['updateExpressionNodeOrderDirection'],
        components: {

        },
        methods: {

        },
        watch: {
            'model.ExpressionNode.Dir'(e) {
                this.updateExpressionNodeOrderDirection(this.model.ExpressionNode);
            }
        }
    }

</script>

<template>
    <div class="expression-node-wrapper"
         v-bind:class="{selected: isNodeSelected()}"
         v-on:click="setSelectedNode(model.ExpressionNode, $event)"
         v-on:contextmenu="showContextMenu(model.ExpressionNode, $event)">

        <div class="wrapper-content">
            <slot name="content">

            </slot>
        </div>
    </div>
</template>

<style>
    .expression-node-wrapper.selected {
        background-color: grey;
    }

    .expression-node-wrapper {
        cursor: pointer;
        user-select: none;
    }

    .expression-node-wrapper .wrapper-content{
        pointer-events: none;
    }

</style>