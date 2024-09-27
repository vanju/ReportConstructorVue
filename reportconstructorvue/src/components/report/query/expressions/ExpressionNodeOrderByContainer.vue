<script>
    import { defineAsyncComponent } from 'vue';
    import ExpressionNodeContainer from './ExpressionNodeContainer.vue';

    export default {
        extends: ExpressionNodeContainer,
        inject: ['addExpressionNodeWrapper', 'deleteExpressionNodeWrapper', 'updateExpressionNodeOrderDirection'],
        data() {
            return {
                //tempValue: null
            }
        },
        components: {
            ExpressionNodeWrapper: defineAsyncComponent(() =>
                import('./ExpressionNodeWrapper.vue')
            )
        },
        methods: {
            onWrapperNodeSelected(event, node) {

                event.preventDefault();
                this.setSelectedNode(node);

                if (event.target.checked == true) {
                    this.addExpressionNodeWrapper(node);
                } else {
                    this.deleteExpressionNodeWrapper(node);
                }
            }
        }
    };
</script>

<template>
    <div class="expression-node-orderby">

        <table class="expression-node-orderby-table">
            <colgroup>
                <col class="index" />
                <col class="select" />
                <col class="dir" />
                <col class="alias" />
                <col />
            </colgroup>

            <thead>
                <tr>
                    <th></th>
                    <th class="text-center">Active</th>
                    <th>Order(desc)</th>
                    <th class="text-center">Alias</th>
                    <th class="text-center">Column</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in getSortedChildren()" v-bind:key="item.Id" class="container-item">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <input type="checkbox" v-on:click="onWrapperNodeSelected($event, item)" v-bind:checked="item.Id > 0" />
                    </td>
                    <td><input type="checkbox" v-bind:disabled="item.Id < 0" v-model="item.Dir" /></td>
                    <td>{{ item.Origin.Alias }}</td>
                    <td>
                        <expression-node-wrapper v-bind:init-expression-node="item" v-bind:parentPath="model.ExpressionNode.Path">
                            <template v-slot:content>
                                <component v-bind:is="getComponentName(item.Origin['NodeType'])"
                                           v-bind:init-expression-node="item.Origin"
                                           v-bind:parent-path="model.ExpressionNode.Path">
                                </component>
                            </template>
                        </expression-node-wrapper>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
    table.expression-node-orderby-table, table.expression-node-orderby-table th, table.expression-node-orderby-table td {
        border-collapse: collapse;
        border: 1px solid black;
    }

    .expression-node-orderby-table .index {
        width: 5%;
    }

    .expression-node-orderby-table .select {
        width: 5%;
    }

    .expression-node-orderby-table .alias {
        width: 15%;
    }

    .expression-node-orderby-table .dir {
        width: 5%;
        min-width: 20px;
    }

    .expression-node-orderby {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 3px;
        margin-bottom: 5px;
        width: 100%;
    }
</style>