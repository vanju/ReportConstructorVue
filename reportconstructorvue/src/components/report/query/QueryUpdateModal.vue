<script>
    import Modal from '../../ui/modals/Modal.vue';

    export default {
        props: ['queryId', 'reportId'],
        data() {
            return {
                model: {
                    /*
                     * Query: {
                        Id: 0,
                        Name: '',
                        Comment: '',
                        ReportId: 0,
                        IsUnion: false,
                        CTE: [],
                        FromClause: [],
                        WhereClause: [],
                        SelectClause: []
                     * }
                    */
                },
                isLoaded: false
            };
        },
        components: {
            Modal: Modal
        },
        emits: ['query-add', 'query-update', 'modal-closed'],
        inject: ['getTest', 'updateTest'],
        methods: {
            async save() {
                let form = this.$refs.form;
                
                if (form.checkValidity()) {
                    
                    if (this.model.Query.Id == 0) {
                        let json = JSON.stringify(this.model.Query);
                        let response = await this.$fetch('/query/create/', {method: 'POST', body: json});
                        if (response.success == true) {
                            this.model.Query = response.data;
                            this.$emit('query-add', this.model.Query);
                        } else {
                            alert('Unable to save changes');
                        }
                    } else {
                        let json = JSON.stringify(this.model.Query);
                        let result = await this.$fetch('/query/edit/', { method: 'POST', body: json});
                        if (result.success == true) {
                            this.$emit('query-update', this.model.Query);
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
            }
        },
        async created() {
            let response = await this.$fetch('/query/details/?Id=' + this.queryId, { method: 'GET' });
            if (response.success == true) {
                this.model = response.data.model;
                this.model.Query.ReportId = this.reportId;
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
            New query
        </template>
        <template v-slot:body>
            <form ref="form">
                <table>
                    <tbody>
                        <tr>
                            <td>Name:</td>
                            <td><input v-model="model.Query.Name" type="text" required /></td>
                        </tr>
                        <tr>
                            <td>Comment:</td>
                            <td><input v-model="model.Query.Comment" type="text" /></td>
                        </tr>
                        <tr>
                            <td>Union:</td>
                            <td><input v-model="model.Query.IsUnion" type="checkbox" /></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </template>
        <template v-slot:footer>
            <button v-on:click="close">Close</button>
            <button v-on:click="save">Save</button>
        </template>
    </modal>
</template>
