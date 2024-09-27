<script>
    import { defineAsyncComponent } from 'vue';
    import ExpressionNodeContainer from './ExpressionNodeContainer.vue';

    export default {
        extends: ExpressionNodeContainer,
        data() {
            return {
                tempValue: null
            }
        },
        components: {
            ExpressionNodeContainer: defineAsyncComponent(() =>
                import('./ExpressionNodeContainer.vue')
            )
        },
        inject: ['updateExpressionNodeSelectAlias'],
        methods: {
            onFocusIn(e, item) {
                this.tempValue = item.Alias;
            },
            onFocusOut(e, item) {

                if (this.tempValue != item.Alias) {
                    this.updateExpressionNodeSelectAlias(item);
                }
            }
        }
    };
</script>

<template>
    <div class="expression-node-list-view">

        <table class="select-clause">
            <colgroup>
                <col />
                <col class="column-alias"/>
                <col />
            </colgroup>

            <thead>
                <tr>
                    <th></th>
                    <th>Alias</th>
                    <th>Column</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in getSortedChildren()" v-bind:key="item.Id" class="container-item">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <input type="text" v-model="item.Alias" class="select-item-alias"
                            v-on:focusout="onFocusOut($event, item)" 
                            v-on:focusin="onFocusIn($event, item)"
                        />
                    </td>
                    <td>
                        <component v-bind:is="getComponentName(item['NodeType'])"
                                   v-bind:init-expression-node="item"
                                   v-bind:parent-path="model.ExpressionNode.Path">
                        </component>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>

    .select-item-alias {
        width: 100%;
    }

    .column-alias {
        width: 20%;
    }

    table.select-clause, table.select-clause th, table.select-clause td {
        border-collapse: collapse;
        border: 1px solid black;
    }

    .expression-node-list-view {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 3px;
        margin-bottom: 5px;
        width: 100%;
    }
</style>