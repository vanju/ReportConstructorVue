<script>

    import ExpressionNode from './ExpressionNode.vue';
    // import ContextMenu from '/src/components/ui/dropdowns/ContextMenu.vue';

    export default {
        extends: ExpressionNode,
        components: {

        },
        methods: {
            async mediatorTest(e) {

                let command = {
                    Name: 'Hola!'
                };
                let response = await this.$fetch('/expression-node/test/', { method: 'POST', body: JSON.stringify(command) });
                console.log(response);
            }
        }
    }

</script>

<template>
    <span class="expression-node-new" 
          v-bind:class="{selected: isNodeSelected()}" 
          v-on:click="setSelectedNode(model.ExpressionNode, $event)" 
          v-on:contextmenu="showContextMenu(model.ExpressionNode, $event)"
    >
        <span>New</span>
    </span>
</template>

<style>
    .expression-node-new.selected {
        background-color: grey;
    }

    .expression-node-new {
        cursor: pointer;
        user-select: none;
    }
</style>