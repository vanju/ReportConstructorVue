<script>
    import { defineAsyncComponent } from 'vue';
    import ExpressionNode from '../ExpressionNode.vue';

    export default {
        name: 'ExpressionNodeContainer',
        extends: ExpressionNode,
        components: {
            ExpressionNodeNew: defineAsyncComponent(() =>
                import('../ExpressionNodeNew.vue')
            ),
            ExpressionNodeOperator: defineAsyncComponent(() =>
                import('../ExpressionNodeOperator.vue')
            ),
            ExpressionNodeConstant: defineAsyncComponent(() =>
                import('../ExpressionNodeConstant.vue')
            ),
            ExpressionNodeSource: defineAsyncComponent(() =>
                import('../ExpressionNodeSource.vue')
            ),
            ExpressionNodeSourceColumn: defineAsyncComponent(() =>
                import('../ExpressionNodeSourceColumn.vue')
            ),


            BlockGroupView: defineAsyncComponent(() =>
                import('./ExpressionNodeBlockGroupContainer.vue')
            ),
            InlineGroupView: defineAsyncComponent(() =>
                import('./ExpressionNodeInlineGroupContainer.vue')
            ),
            PredicateView: defineAsyncComponent(() =>
                import('./ExpressionNodePredicateContainer.vue')
            ),
            OperatorView: defineAsyncComponent(() =>
                import('./ExpressionNodeOperatorContainer.vue')
            ),

            GridView: defineAsyncComponent(() =>
                import('./ExpressionNode/GridView.vue')
            ),
            BetweenSetView: defineAsyncComponent(() =>
                import('./ExpressionNode/BetweenSetView.vue')
            ),
            SequenceSetView: defineAsyncComponent(() =>
                import('./ExpressionNode/SequenceSetView.vue')
            ),
            FunctionView: defineAsyncComponent(() =>
                import('./ExpressionNode/FunctionView.vue')
            )
        },
        data() {
            return {
                childContextDataPrototype: null,
                childCalculatedDataPrototype: null
            }
        },
        methods: {
            getViewName(role, view) {
                let name = '';
                let key = view == null ? role : (role + '-' + view);

                switch (key) {
                    case 'group-grid':
                        name = 'BlockGroupView';
                        break;
                    case 'group-inline':
                        name = 'InlineGroupView';
                        break;
                    case 'predicate':
                        name = 'PredicateView';
                        break;
                    case 'operator':
                        name = 'OperatorView';
                        break;
                    case 'from-list':
                    case 'select-list':
                        name = 'ListView';
                        break;
                    case 'where-grid':
                        name = 'GridView';
                        break;
                    case 'set-between':
                        name = 'BetweenSetView';
                        break;
                    case 'set-sequence':
                        name = 'SequenceSetView';
                        break;
                    case 'function':
                        name = 'FunctionView';
                        break;
                }
                return name;
            },
            getModel() {
                return (key) => this.model.ExpressionNode[key];
            },
            selectNodeCallback() {
                return (e) => this.setSelectedNode(this.model.ExpressionNode, e);
            },
            showContextMenuCallback() {
                return (e) => this.showContextMenu(this.model.ExpressionNode, e);
            },
            getSortedChildren() {

                return this.model.ExpressionNode.Children.sort((a, b) => {
                    if (a.Order < b.Order) {
                        return -1;
                    } else if (a.Order > b.Order) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
    }

</script>

<template>
    <component
        v-bind:is="getViewName(model.ExpressionNode.Role, model.ExpressionNode.View)"
        v-bind:class="{selected: isNodeSelected()}"
        v-bind:getModel="getModel()"
        v-bind:selector-activated-callback="selectNodeCallback()"
        v-bind:context-menu-activated-callback="showContextMenuCallback()"
    >
        <template v-slot:content>

            <span v-for="(item, i) in getSortedChildren()" v-bind:key="item.Id" class="container-item">
                <component v-bind:is="getComponentName(item['NodeType'])"
                           v-bind:init-expression-node="item"
                           v-bind:parent-path="model.ExpressionNode.Path"
                >
                </component>
            </span>

        </template>
    </component>
</template>