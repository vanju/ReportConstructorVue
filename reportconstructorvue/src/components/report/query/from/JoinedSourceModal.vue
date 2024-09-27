<script>

    import Modal from '../../../ui/modals/Modal.vue';
    import AllTableListModal from '../../../catalog/TableList.vue';
    import QueryTableListModal from '../../../catalog/TableList.vue';
    import TableFieldListModal from '../../../catalog/TableFieldList.vue';

    export default {
        props: ['sourceId', 'queryId'],
        inject: ['RCCorePlugin'],
        data() {
            return {
                model: {
                /*
                Source: {
                    Id: 0,
                    Table: {
                        Id: 0,
                        Name: '',
                        Type: ''
                    },
                    Join: {
                        Operator: {
                            Id: 0,
                            Name: 'inner',
                            FullName: 'inner join',
                        },
                        Table: {
                            Id: 0,
                            Name: '',
                            Type: ''
                        },
                        Conditions: []
                    }
                }
                */
                },
                showAllTablestDialog: false,
                showJoinedTablesDialog: false,
                showFieldsDialog: false,
                tableId: 0,
                callBack: null, // func
                isLoaded: false
            };
        },
        components: {
            Modal: Modal,
            AllTableListModal: AllTableListModal,
            QueryTableListModal: QueryTableListModal,
            TableFieldListModal: TableFieldListModal
        },
        computed: {
            isAddConDisabled() {
                return !this.model.Source.Table.Id || !this.model.Source.Join.Operator.Id || !this.model.Source.Join.Table.Id;
            }
        },
        emits: ['from-add', 'from-update', 'modal-closed'],
        methods: {
            async save() {
                let form = this.$refs.form;

                if (form.checkValidity()) {

                    if (this.model.Source.Id == 0) {
                        let response = await this.$fetch('/source/create/', { method: 'POST', body: JSON.stringify(this.model.Source) });
                        if (response.success == true) {
                            this.model = response.data.model;
                            this.$emit('from-add', this.model.Source);
                        }
                    } else {
                        let response = await this.$fetch('/source/edit/', { method: 'POST', body: JSON.stringify(this.model.Source) });
                        if (response.success == true) {
                            this.$emit('from-update', this.model.Source);
                        }
                    }
                } else {
                    form.reportValidity();
                }
            },
            close() {
                this.$emit('modal-closed');
            },
            addJoinCondition() {
                let joinCondition = structuredClone(this.$options.meta.JoinCondition);
                joinCondition['Operator'] = this.$options.catalog.Operators[0];

                this.model.Source.Join.Conditions.push(joinCondition);
            },
            deleteJoinCondition(index) {
                if (this.model.Source.Join.Conditions.length > 1) {
                    this.model.Source.Join.Conditions.splice(index, 1);
                }
            },
            openJoinedTablesDialog() {
                this.callBack = function (item) {
                    this.model.Source.Join.Table = item;
                    this.showJoinedTablesDialog = false;
                }.bind(this);

                this.showJoinedTablesDialog = true;
            },
            openAllTablesDialog() {
                this.callBack = function (item) {
                    this.model.Source.Table = item;
                    this.showAllTablestDialog = false;
                }.bind(this);

                this.showAllTablestDialog = true;
            },

            openFieldListDialog(key, parent, tableId) {
                this.callBack = function (item) {
                    parent[key] = item;
                    this.showFieldsDialog = false;
                }.bind(this);

                this.tableId = tableId;
                this.showFieldsDialog = true;
            },
            setDefaultJoinOperator() {
                this.model.Source.Join.Operator = this.$options.catalog.JoinOperators[0];
            }
        },
        watch: {
            'model.Source.Join.Operator'(v) {
                this.model.Source.Join.OperatorId = v.Id;
            },
            'model.Source.Table'(v) {
                this.model.Source.TableId = v.Id;
            },
            'model.Source.Join.Table'(v) {
                this.model.Source.Join.TableId = v.Id;
            },
            'model.Source.Join.Conditions': {
                handler(newValue, oldValue) {
                    {
                        for (let i = 0; i < newValue.length; i++) {
                            newValue[i].OperatorId = newValue[i].Operator.Id;
                            newValue[i].OperandLeftId = newValue[i].OperandLeft.Id;
                            newValue[i].OperandRightId = newValue[i].OperandRight.Id;
                        }
                    }
                },
                deep: true
            }
        },
        catalog: {},
        meta: {},
        async created() {
            let response = await this.$fetch('/source/details/?Id=' + this.sourceId + '&joined=true', { method: 'Get' });
            if (response.success == true) {

                // init options
                this.$options.meta = response.data.meta;
                this.$options.catalog = response.data.catalog;

                // init model
                this.model = response.data.model;

                if (this.model.Source.Id == 0) {
                    this.model.Source.QueryId = this.queryId;
                    this.setDefaultJoinOperator();
                    this.addJoinCondition();
                }

                this.isLoaded = true;
            } else {
                alert('Unable to load source');
            }
        }
    };

</script>

<template>
    <modal v-if="isLoaded">
        <template v-slot:header>
            Join table
        </template>

        <template v-slot:body>
            <form ref="form">
                <table class="layout-table">
                    <thead>
                        <tr>
                            <th>Table_1</th>
                            <th>Join operator</th>
                            <th>Table_2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input type="text" required v-bind:value="model.Source.Join.Table.Name" size="10" onkeydown="event.preventDefault()" />
                                <button v-on:click="openJoinedTablesDialog" type="button">Select</button>
                            </td>
                            <td>
                                <select v-model="model.Source.Join.Operator" required>
                                    <!--<option class="hide-option">Join type</option>-->
                                    <option v-for="(item, index) in $options.catalog.JoinOperators" v-bind:value="item">
                                        {{ item.Name }}
                                    </option>
                                </select>
                            </td>
                            <td>
                                <input type="text" required v-bind:value="model.Source.Table.Name" size="10" onkeydown="event.preventDefault()" />
                                <button v-on:click="openAllTablesDialog" type="button">Select</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="g-center"><p>Join condition:</p></div>
                <table class="join-conditions">
                    <thead>
                        <tr>
                            <th>Field_1</th>
                            <th>Operator</th>
                            <th>Field_2</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in model.Source.Join.Conditions">
                            <td>
                                <input required v-bind:value="item.OperandLeft.Name" v-bind:disabled="isAddConDisabled" type="text" size="8" onkeydown="event.preventDefault()" />
                                <button v-on:click="openFieldListDialog('OperandLeft', item, model.Source.Join.Table.Id)" v-bind:disabled="isAddConDisabled" type="button">Select</button>
                            </td>
                            <td>
                                <select v-model="item.Operator" v-bind:disabled="isAddConDisabled" required>
                                    <option selected v-for="(operator, i) in $options.catalog.Operators" v-bind:value="operator">
                                        {{ operator.Sign }}
                                    </option>
                                </select>
                            </td>
                            <td>
                                <input required v-bind:value="item.OperandRight.Name" v-bind:disabled="isAddConDisabled" type="text" size="8" onkeydown="event.preventDefault()" />
                                <button v-on:click="openFieldListDialog('OperandRight', item, model.Source.Table.Id)" v-bind:disabled="isAddConDisabled" type="button">Select</button>
                            </td>
                            <td><button type="button" v-on:click="deleteJoinCondition(index)" v-bind:disabled="isAddConDisabled">Delete</button></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <button type="button" v-bind:disabled="isAddConDisabled" v-on:click="addJoinCondition">
                                    Add
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </template>

        <template v-slot:footer>
            <button v-on:click="save" type="button">Save</button>
            <button v-on:click="close" type="button">Close</button>
        </template>
    </modal>
    <all-table-list-modal v-if="showAllTablestDialog" v-bind:query-id="0" v-on:modal-closed="showAllTablestDialog = false" v-on:table-selected="callBack">
    </all-table-list-modal>

    <query-table-list-modal v-if="showJoinedTablesDialog" v-bind:query-id="queryId" v-on:modal-closed="showJoinedTablesDialog = false" v-on:table-selected="callBack">
    </query-table-list-modal>

    <table-field-list-modal v-if="showFieldsDialog" v-bind:table-id="tableId" v-on:modal-closed="showFieldsDialog = false" v-on:table-field-selected="callBack">
    </table-field-list-modal>
</template>

<style>

</style>