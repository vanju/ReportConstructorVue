<script>
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

    import Modal from '../ui/modals/Modal.vue';
    import ReportUpdateModal from './ReportUpdateModal.vue';
    //import QueryListModal from './components/query/QueryListModal.vue';

    export default {
        props: [],
        data() {
            return {
                model: {
                    // Reports: []
                },
                debug: false,
                showReportUpdateDialog: false,
                selectedReport: -1,
                isLoaded: false,
                bag: null
            };
        },
        provide() {
            return {
                updateTest: this.updateTest,
                getTest: this.getTest
            }
        },
        computed: {
            debugData() {
                return this.Reports;
            }
        },
        components: {
            Modal: Modal,
            ReportUpdateModal: ReportUpdateModal
        },
        methods: {
            updateTest(v) {
                this.test = v;
            },
            getTest() {
                return this.test;
            },
            reportAdd() {
                this.selectedReport = -1;
                this.showReportUpdateDialog = true;
            },
            reportUpdate(index) {
                this.selectedReport = index;
                this.showReportUpdateDialog = true;
            },
            onReportAdd(item) {
                this.model.Reports.push(item);
            },
            onReportUpdate(item) {
                
                this.model.Reports[this.selectedReport] = item;
                this.showReportUpdateDialog = false;
            }
        },
        async created() {
            let response = await this.$fetch('/report/list/', { method: 'GET'});
            if (response.success == true) {
                this.model = response.data.model;
                this.isLoaded = true;
            } else {
                alert('Unable to get list');
            }
        }
    }

</script>

<template>
    <div v-if="isLoaded" class="rc-wrapper">
        <div class="rc">
            <h3>Reports:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th></th>
                        <th>Comment</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(report, i) in model.Reports">
                        <td>{{ report.Id }}</td>
                        <td><a v-bind:href="'/report/display/?id=' + report.Id">{{ report.Name }}</a></td>
                        <td>{{ report.Comment }}</td>
                        <td>{{ report.UserCreated.Name }}</td>
                        <td><button v-on:click="reportUpdate(i)" type="button">Edit</button></td>
                    </tr>
                    <tr>
                        <th colspan="4"></th>
                        <th><button v-on:click="reportAdd" type="button">Add</button></th>
                    </tr>
                </tbody>

            </table>
        </div>
    </div>
 
    <report-update-modal v-if="showReportUpdateDialog" v-bind:report-id="selectedReport == -1 ? 0 : model.Reports[selectedReport]['Id']" v-on:report-add="onReportAdd" v-on:report-update="onReportUpdate" v-on:modal-closed="(e) => showReportUpdateDialog = false">
    </report-update-modal>

</template>

<style>
    .rc-wrapper {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }

    .rc {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>