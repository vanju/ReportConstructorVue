<script>

    import ExpressionNode from './ExpressionNode.vue';
    import ExpressionNodeNew from './ExpressionNodeNew.vue';
    import ExpressionNodeOperator from './ExpressionNodeOperator.vue';
    

    export default {
        name: 'ExpressionNodeGroupi',
        extends: ExpressionNode,
        components: {
            ExpressionNodeNew,
            ExpressionNodeOperator
        },
        methods: {

        }
    }

</script>

<template>

    <div class="block-group-wrapper">

        <input type="radio" class="radio-btn" v-bind:name="radioName" v-on:change="selectNode" v-on:click="unselectNode" />

        <div class="expression-node-group-grid">

            <span class="unvisible-operator"></span>

            <span v-for="(item, i) in model.ExpressionNode.Children">
                <component 
                           v-bind:is="getComponentName(item['NodeType'])"
                           v-bind:init-expression-node="item"
                           v-bind:context="context"
                           v-bind:radio-name="radioName"
                           v-on:node-type-changed="onNodeTypeChanged"
                           v-bind:key="item.Id"
                           v-on:node-selected="onNodeSelected"
                           v-on:node-unselected="onNodeUnselected">
                </component>
            </span>
        </div>
    </div>

</template>