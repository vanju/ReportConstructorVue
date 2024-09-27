<script>
    import Modal from '../../../ui/modals/Modal.vue';
    import DropList from '../../../ui/dropdowns/DropList.vue';
    import GroupExpression from '../expressions/GroupExpressionModal.vue';
    import ColumnExpression from '../expressions/ColumnExpressionModal.vue';
    import ConstantExpression from '../expressions/ConstantExpressionModal.vue';

    export default {
        props: {
            predicateId: {
                type: Number,
                default: 0
            },
            parentPredicateId: {
                type: Number,
                default: 0
            },
            queryId: {
                type: Number,
                default: 0
            },
            order: {
                type: Number,
                default: 1
            },
            path: {
                type: String,
                default: '/'
            },
            hasSiblings: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                model: {
                    /*  
                        Predicate: {
                            Query: {},
                            Parent: {},
                            ExpressionLeft: {},
                            ExpressionRight: {},
                            Operator: {},
                            Order: '',
                            IsGroup: 0,
                            Path: ''
                        }
                    */
                },
                expressionUpdateParams: {

                },
                isLoaded: false,
                expressionTypes: [
                    {
                        Name: 'Constant'
                    },
                    {
                        Name: 'Column'
                    },
                    {
                        Name: 'Group'
                    },
                    {
                        Name: 'Function'
                    }
                ],
                activeExpression: null,
                expressionView: 'display',
                showGroupExpressionModal: false,
                showColumnExpressionModal: false,
                showScalarExpressionModal: false
            };
        },
        components: {
            Modal: Modal,
            DropList: DropList,
            GroupExpression: GroupExpression,
            ColumnExpression: ColumnExpression,
            ConstantExpression: ConstantExpression
        },
        emits: ['modal-closed'],
        computed: {
            isNew() {
                return this.predicateId == 0;
            }
        },
        methods: {
            save() {
                alert('hola!');
            },
            close() {
                this.$emit('modal-closed');
            },
            editExpression(e) {
                alert('hola!');
            },
            onExpressionTypeSelected(expression, item) {

                this.activeExpression = expression;

                this.expressionUpdateParams = {
                    expressionId: 0,
                    view: ''
                };

                switch (item.Name) {
                    case 'Group':
                        this.showGroupExpressionModal = true;
                        break;
                    case 'Constant':
                        this.showScalarExpressionModal = true;
                        break;
                    case 'Column':
                        this.showColumnExpressionModal = true;
                        break;
                }
            },
            getDefaultExpressionOperator() {
                return this.$options.catalog.ExpressionOperators.find((e) => e.Name == 'equal');
            },
            onExpressionAdd(e) {
                console.log(e);
            },
            modelLoaded() {
                if (this.isNew) {
                    this.model.Predicate.ParentId = this.parentPredicateId;
                    this.model.Predicate.QueryId = this.queryId;
                    this.model.Predicate.Order = this.order;
                    this.model.Predicate.Path = this.path;

                    this.model.Predicate.ExpressionOperator = this.getDefaultExpressionOperator();
                }
            }
        },
        async created() {
            
            let response = await this.$fetch('/predicate/details/?id=' + this.predicateId, { method: 'Get' });
            console.log(response);

            if (response.success == true) {
                // catalog first
                this.$options.catalog = response.data.catalog;
                // model next
                this.model = response.data.model;
                this.modelLoaded();                
                this.isLoaded = true;
            }
            
            this.isLoaded = true;
        }
    };

</script>

<template>
    <modal v-if="isLoaded">

        <template v-slot:header>
            New predicate
        </template>
        <template v-slot:body>
            <form>
                <div v-if="hasSiblings">
                    <table class="predicate-operator">
                        <tbody>
                            <tr>
                                <td><label>Operator</label></td>
                                <td>
                                    <select v-model="model.Predicate.Operator" required class="w90">
                                        <option v-for="(item, i) in $options.catalog.Operators" v-bind:value="item" class="text-center">
                                            {{ item.Sign }}
                                        </option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <p class="text-center">Body</p>
                    <table class="predicate-body">
                        <tbody>
                            <tr>
                                <td><label>Expression</label></td>
                                <td><input type="text" class="w90" /></td>
                                <td>
                                    <drop-list v-bind:initList="expressionTypes" v-on:list-item-selected="onExpressionTypeSelected('ExpressionLeft', $event);"></drop-list>
                                </td>
                                <td><button type="button">Delete</button></td>
                            </tr>
                            <tr>
                                <td><label>Operator</label></td>
                                <td>
                                    <select v-model="model.Predicate.ExpressionOperator" required class="w90">
                                        <option v-for="(item, i) in $options.catalog.ExpressionOperators" v-bind:value="item" class="text-center">
                                            {{ item.Sign }}
                                        </option>
                                    </select>
                                </td>
                                <td><button type="button">Add</button></td>
                                <td><button type="button">Delete</button></td>
                            </tr>
                            <tr>
                                <td><label>Expression</label></td>
                                <td><input type="text" class="w90" /></td>
                                <td>
                                    <drop-list v-bind:initList="expressionTypes" v-on:list-item-selected="onExpressionTypeSelected('ExpressionRight', $event);"></drop-list>
                                </td>
                                <td><button type="button">Delete</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>
        </template>

        <template v-slot:footer>
            <button type="button" v-on:click="save">Save</button>
            <button type="button" v-on:click="close">Close</button>
        </template>
    </modal>

    <group-expression v-if="showGroupExpressionModal" v-on:modal-closed="showGroupExpressionModal = false">
    </group-expression>
    <column-expression v-if="showColumnExpressionModal" v-on:modal-closed="showColumnExpressionModal = false">
    </column-expression>
    <constant-expression v-if="showScalarExpressionModal" v-bind="expressionUpdateParams" v-on:modal-closed="showScalarExpressionModal = false" v-on:expression-add="onExpressionAdd($event); showScalarExpressionModal = false;">
    </constant-expression>
</template>

<style>
    .predicate-operator {
        min-width: 400px;
        padding: 10px;
        border: 1px solid green;
    }
    .predicate-body {
        min-width: 400px;
        padding: 10px;
        border: 1px solid green;
    }
    
</style>