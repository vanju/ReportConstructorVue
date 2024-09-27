<script>

    import ExpressionNode from './ExpressionNode.vue';
    // import ExpressionNodeGroup from './ExpressionNodeGroup.vue';
    import ExpressionNodeNew from './ExpressionNodeNew.vue';
    import ExpressionNodeOperator from './ExpressionNodeOperator.vue';
    import { defineAsyncComponent } from 'vue';

    export default {
        extends: ExpressionNode,
        components: {
            ExpressionNodeGroup: defineAsyncComponent(() => import('./ExpressionNodeGroup.vue')),
            ExpressionNodeNew,
            ExpressionNodeOperator
        },
        methods: {
            prepareContext() {
                return {
                    display: 'inline'
                }
            }
        }
    }

</script>

<template>
    <span class="en-predicate">
        <span v-for="(item, i) in model.ExpressionNode.Children" >

            <component :is="getComponentName(item['NodeType'])"
                       v-bind:init-expression-node="item"
                       v-bind:context="prepareContext()"
                       v-bind:radio-name="radioName"
                       v-on:node-type-changed="onNodeTypeChanged"
                       v-bind:key="item.Id"
                       v-on:node-selected="onNodeSelected"
                       v-on:node-unselected="onNodeUnselected">
            </component>
        </span>
    </span>
</template>
