<script>
    import { defineAsyncComponent } from 'vue';
    import ExpressionNodeContainer from './ExpressionNodeContainer.vue';

    export default {
        extends: ExpressionNodeContainer,
        inject: ['addExpressionNodeWrapper', 'deleteExpressionNodeWrapper', 'isWrapperExists'],
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
    <div class="expression-node-groupby">

        <table class="expression-node-groupby-table">
            <colgroup>
                <col class="index"/>
                <col class="select"/>
                <col class="alias"/>
                <col />
            </colgroup>

            <thead>
                <tr>
                    <th></th>
                    <th class="text-center">Use</th>
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


    table.expression-node-groupby-table, table.expression-node-groupby-table th, table.expression-node-groupby-table td {
        border-collapse: collapse;
        border: 1px solid black;
    }

    .expression-node-groupby-table .index {
        width: 5%;
    }

    .expression-node-groupby-table .select {
        width: 5%;
    }

    .expression-node-groupby-table .alias {
        width: 15%;
    }

    .expression-node-groupby {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 3px;
        margin-bottom: 5px;
        width: 100%;
    }
</style>