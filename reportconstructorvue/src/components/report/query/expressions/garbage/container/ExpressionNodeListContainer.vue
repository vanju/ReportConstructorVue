<script>
    import ExpressionNodeContainer from './ExpressionNodeContainer.vue';

    export default {
        props: ['getModel', 'selectorActivatedCallback', 'contextMenuActivatedCallback'],
        extends: ExpressionNodeContainer
    };
</script>

<template v-slot:content>
    <div class="expression-node-root-list-view">
        <span v-for="(item, i) in getSortedChildren()" v-bind:key="item.Id" class="container-item">
            <component v-bind:is="getComponentName(item['NodeType'])"
                       v-bind:init-expression-node="item"
                       v-bind:parent-path="model.ExpressionNode.Path">
            </component>
        </span>
    </div>
</template>

<style>
    .expression-node-root-list-view {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 3px;
        margin-bottom: 5px;
        width: 100%;
    }
</style>