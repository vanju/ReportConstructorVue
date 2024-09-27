<script>

    import ExpressionNode from './ExpressionNode.vue';
    import ExpressionNodePredicate from './ExpressionNodePredicate.vue';
    import ExpressionNodeNew from './ExpressionNodeNew.vue';
    import ExpressionNodeOperator from './ExpressionNodeOperator.vue';
    

    export default {
        name: 'ExpressionNodeGroup',
        extends: ExpressionNode,
        components: {
            ExpressionNodePredicate: ExpressionNodePredicate,
            ExpressionNodeNew,
            ExpressionNodeOperator
        },
        methods: {
            prepareContext() {
                return {
                    display: this.context.display
                }
            }
        },
        watch: {
            'model.ExpressionNode'(v) {
                console.log('hola!');
            }
        }
    }

</script>

<template>

    <div v-if="context.display == 'block'" class="block-group-wrapper">

        <input type="radio" class="radio-btn" v-bind:name="radioName" v-on:change="selectNode" v-on:click="unselectNode" />

        <div class="expression-node-group-grid">

            <span class="unvisible-operator"></span>

            <span v-for="(item, i) in model.ExpressionNode.Children" v-bind:key="i">
                <component v-bind:is="getComponentName(item['NodeType'])"
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


    <span v-if="context.display == 'inline'">
        <span>(</span>
        <span v-for="(item, i) in model.ExpressionNode.Children">
            <component v-bind:is="getComponentName(item['NodeType'])"
                       v-bind:init-expression-node="item"
                       v-bind:context="prepareContext()"
                       v-bind:radio-name="radioName"
                       v-on:node-type-changed="onNodeTypeChanged"
                       v-on:node-selected="onNodeSelected"
                       v-on:node-unselected="onNodeUnselected">
            </component>
        </span>
        <span>)</span>
    </span>

</template>