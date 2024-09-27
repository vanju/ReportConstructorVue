<script>

    import ExpressionNode from './ExpressionNode.vue';
    import ExpressionNodeGroup from './ExpressionNodeGroup.vue';
    import ExpressionNodePredicate from './ExpressionNodePredicate.vue';
    import ExpressionNodeNew from './ExpressionNodeNew.vue';
    import ExpressionNodeOperator from './ExpressionNodeOperator.vue';

    export default {
        extends: ExpressionNode,
        components: {
            ExpressionNodeGroup,
            ExpressionNodePredicate,
            ExpressionNodeNew,
            ExpressionNodeOperator
        },
        methods: {
            prepareContext() {
                return {
                    type: this.model.ExpressionNode.NodeType,
                    display: 'block'
                };
            }
        }
    }

</script>

<template>

    <div v-if="model.ExpressionNode.NodeType == 'root'" class="block-group-wrapper">

        <div class="expression-node-root-grid">
            <span class="unvisible-operator"></span>

            <span v-for="(item, i) in model.ExpressionNode.Children" v-bind:key="i">

                <component :is="getComponentName(item['NodeType'])"
                    v-bind:init-expression-node="item"
                    v-bind:context="prepareContext()"
                    v-bind:radio-name="radioName"
                    v-on:node-type-changed="onNodeTypeChanged"
                    v-on:node-selected="onNodeSelected"
                    v-on:node-unselected="onNodeUnselected">
                </component>

            </span>
        </div>
    </div>

</template>