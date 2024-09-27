<script>
    import { computed } from 'vue';

    import Modal from '../ui/modals/Modal.vue';
    import QueryUpdateModal from './query/QueryUpdateModal.vue';
    import QueryConfigModal from './query/QueryConfigModal.vue';
    import TabPanel from '../ui/tabpanels/tabpanel.vue';
    import Tab from '../ui/tabpanels/tab.vue';

    export default {
        props: ['reportId'],
        data() {
            return {
                model: {
                /* Report: {
                 *      Id: 0,
                 *      Name: '',
                 *      Comment: '',
                 *      Queries: []
                 *  }
                 */
                },
                showQueryList: false,          //
                showQueryUpdateDialog: false,  //
                showQueryConfigDialog: false,  //
                selectedQuery: -1,             //
                selectedQueryId: 0,
                isLoaded: false
            };
        },
        components: {
            Modal: Modal,
            QueryUpdateModal: QueryUpdateModal,
            QueryConfigModal: QueryConfigModal,
            TabPanel: TabPanel,
            Tab: Tab
        },
        emits: ['report-add', 'report-update', 'modal-closed'],
        methods: {
            async save() {
                let form = this.$refs.form;
                
                if (form.checkValidity()) {

                    if (this.model.Report.Id == 0) {

                        let json = JSON.stringify(this.model.Report);
                        let response = await this.$fetch('/report/create/', { method: 'POST', body: json });

                        if (response.success == true) {

                            this.model.Report = response.data.model.Report;

                            this.$emit('report-add', this.model.Report);
                            this.showQueryList = true;
                        } else {
                            alert('Unable to save changes');
                        }

                    } else {
                        this.model.Report.Queries = [];
                        let json = JSON.stringify(this.model.Report);

                        let result = await this.$fetch('/report/edit/', { method: 'POST', body: json });
                        if (result.success == true) {
                            this.$emit('report-update', this.model.Report);
                        } else {
                            alert('Unable to save changes');
                        }   
                    }
                } else {
                    form.reportValidity();
                }
            },
            close() {
                this.$emit('modal-closed');
            },
            queryAdd() {
                this.selectedQueryId = 0;
                this.showQueryUpdateDialog = true;
            },
            queryUpdate(queryId) {
                this.selectedQueryId = queryId;
                this.showQueryUpdateDialog = true;
            },
            async queryDelete(queryId) {

                let json = JSON.stringify({
                    Id: queryId
                });

                let response = await this.$fetch('/query/delete/', { method: 'POST', body: json });

                console.log(response);

                if (response.success == true) {

                    let targetIndex = this.model.Report.Queries.findIndex(e => e.Id == response.data.Id);
                    this.model.Report.Queries.splice(targetIndex, 1);

                } else {
                    alert('Unable to delete query');
                }

            },
            queryConfigure(queryId) {
                this.selectedQueryId = queryId;
                this.showQueryConfigDialog = true;
            },
            onQueryAdd(item) {
                this.model.Report.Queries.push(item);
                this.showQueryUpdateDialog = false;
            },
            onQueryUpdate(sourceItem) {

                let targetItem = this.model.Report.Queries.find(e => e.Id == sourceItem.Id);

                if (targetItem != null) {
                    Object.assign(targetItem, sourceItem);
                }

                this.showQueryUpdateDialog = false;
            },
            getQueryId() {
                return this.selectedQuery == -1 ? 0 : this.model.Report.Queries[this.selectedQuery]['Id']
            },
            getQuery() {
                return this.selectedQuery == -1 ? {} : this.model.Report.Queries[this.selectedQuery]
            },
            getModalTitle() {
                console.log(this.model.Report.Id);
                return this.model.Report.Id > 0 ? this.model.Report.Name : 'New report';
            }
        },
        async created() {
            let response = await this.$fetch('/report/details/?Id=' + this.reportId, { method: 'GET' });
            if (response.success == true) {
                this.model = response.data.model;
                this.isLoaded = true;
            } else {
                alert('Unable to get details');
            }
        }
    };
</script>

<template>
    <modal v-if="isLoaded">
        <template v-slot:header>
            {{ getModalTitle() }}
        </template>
        <template v-slot:body>
            <tab-panel v-bind:initTabs="['Report', 'Queries']">
                <template v-slot:tab-collection>
                    <tab>
                        <template v-slot:tab-content>
                            <form ref="form">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Name:</td>
                                            <td><input v-model="model.Report.Name" type="text" required /></td>
                                        </tr>
                                        <tr>
                                            <td>Comment:</td>
                                            <td><input v-model="model.Report.Comment" type="text" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </template>
                    </tab>
                    <tab>
                        <template v-slot:tab-content>
                            <div v-if="model.Report.Id == 0">
                                <div>
                                    <b>You need to save report to add queries</b>
                                </div>
                                <br />
                                <div class="g-center">
                                    <button type="button" v-bind:disabled="model.Report.Name.length == 0" v-on:click="save">Apply</button>
                                </div>
                            </div>
                            <table v-if="model.Report.Id > 0">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Comment</th>
                                        <th>Union</th>
                                        <th></th>
                                        <th></th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(query, i) in model.Report.Queries">
                                        <td>{{ query.Id }}</td>
                                        <td>{{ query.Name }}</td>
                                        <td>{{ query.Comment }}</td>
                                        <td><input disabled v-model="query.IsUnion" type="checkbox"/></td>
                                        <td><button v-on:click="queryConfigure(query.Id)" type="button">Configure</button></td>
                                        <td><button v-on:click="queryUpdate(query.Id)" type="button">Edit</button></td>
                                        <td><button v-on:click="queryDelete(query.Id)" type="button">Delete</button></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4"></td>
                                        <td><button v-on:click="queryAdd" type="button">Add</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </tab>
                </template>
            </tab-panel>
        </template>

        <template v-slot:footer>
            <button v-on:click="close">Close</button>
            <button v-on:click="save">Save</button>
        </template>
    </modal>
    <query-update-modal v-if="showQueryUpdateDialog" v-bind:query-id="selectedQueryId" v-bind:report-id="model.Report.Id" v-on:query-add="onQueryAdd" v-on:query-update="onQueryUpdate" v-on:modal-closed="(e) => showQueryUpdateDialog = false">
    </query-update-modal>
    <query-config-modal v-if="showQueryConfigDialog" v-bind:query-id="selectedQueryId" v-bind:report-id="model.Report.Id" v-on:query-update="onQueryUpdate" v-on:modal-closed="(e) => showQueryConfigDialog = false">
    </query-config-modal>
</template>