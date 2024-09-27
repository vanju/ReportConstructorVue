<script>

    import SourceModal from './SourceModal.vue';
    import JoinedSourceModal from './JoinedSourceModal.vue';

    export default {
        props: ['queryId'],
        data() {
            return {
                model: {
                    // FromClause: []
                },
                showSourceDialog: false,
                showJoinedSourceDialog: false,
                selectedSource: -1,
                isLoaded: false
            };
        },
        computed: {

        },
        emits: ['from-list-update'],
        components: {
            SourceModal: SourceModal,
            JoinedSourceModal: JoinedSourceModal
        },
        methods: {
            getSourceId() {
                return this.selectedSource == -1 ? 0 : this.model.FromClause[this.selectedSource]['Id'];
            },
            onSourceAdd(item) {
                this.model.FromClause.push(item);
                this.showSourceDialog = false;
                this.showJoinedSourceDialog = false;
            },
            onSourceUpdate(item) {
                this.model.FromClause[this.selectedSource] = item;
                this.showSourceDialog = false;
                this.showJoinedSourceDialog = false;
            },
            async deleteSource(index) {

                let source = this.model.FromClause[index];

                let response = await this.$fetch('/source/delete/?Id=' + source.Id);
                if (response.success == true) {
                    this.model.FromClause.splice(index, 1);
                } else {
                    alert('Unable to delete source');
                }
            },
            addSource() {
                this.selectedSource = -1;

                if (this.model.FromClause.length > 0) {
                    this.showJoinedSourceDialog = true;
                } else {
                    this.showSourceDialog = true;
                }
            },
            editSource(index) {
                this.selectedSource = index;

                if (index > 0) {
                    this.showJoinedSourceDialog = true;
                } else {
                    this.showSourceDialog = true;
                }
            }
        },
        async created() {
            let response = await this.$fetch('/source/list/?QueryId=' + this.queryId, { method: 'GET' });
            if (response.success == true) {
                this.model = response.data.model;
                this.isLoaded = true;
            } else {
                alert('Unable to load source list');
            }
        }
    };

</script>

<template>
    <div class="g-center">
        <p>Sources:</p>
    </div>
    <div v-if="isLoaded" class="step-block">
        <slot name="header"></slot>
        <div class="fl-row fl-row-center">

            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Alias</th>
                        <th>Join</th>
                        <th>Condition</th>
                        <th></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in model.FromClause">
                        <td>{{ item.Id }}</td>
                        <td>{{ item.Table.Name }}</td>
                        <td></td>
                        <td><span v-if="item.Join !== null">{{ item.Join.Operator.Name }}</span></td>
                        <td>
                            <table v-if="item.Join !== null">
                                <tbody>
                                    <tr v-for="(c, i) in item.Join.Conditions">
                                        <td>{{ c.OperandLeft.Name }}</td>
                                        <td>{{ c.Operator.Sign }}</td>
                                        <td>{{ c.OperandRight.Name }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td><button v-on:click="editSource(index)" type="button">Edit</button></td>
                        <td><button v-on:click="deleteSource(index)" type="button">Delete</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colspan="2"><button v-on:click="addSource" type="button">Add source</button></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <source-modal v-if="showSourceDialog" v-bind:source-id="getSourceId()" v-bind:query-id="queryId" v-on:from-add="onSourceAdd" v-on:from-update="onSourceUpdate" v-on:modal-closed="(e) => showSourceDialog = false">
        </source-modal>

        <joined-source-modal v-if="showJoinedSourceDialog" v-bind:source-id="getSourceId()" v-bind:query-id="queryId" v-on:from-add="onSourceAdd" v-on:from-update="onSourceUpdate" v-on:modal-closed="(e) => showJoinedSourceDialog = false">
        </joined-source-modal>
    </div>
</template>
<style>
    form.modal-form {
        display: flex;
        flex: 2 0 auto;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: auto;
    }
    table.join-conditions {
        min-width: 400px;
    }

    table.join-conditions, table.join-conditions td, table.join-conditions th {
        border-collapse: collapse;
    }

    table.join-conditions {
        border: 1px solid grey;
    }
    table.join-conditions td {
        border-bottom: 1px solid grey;
        padding: 5px;
        text-align: center;
    }
    table.join-conditions th {
        border-bottom: 1px solid grey;
    }

</style>