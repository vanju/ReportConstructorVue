<script>

    import Modal from '../../../ui/modals/Modal.vue';
    import ModalTableList from '../../../catalog/TableList.vue';

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
                            Type: '',
                            Class: ''
                        },
                        Join: null, // always null
                    }
                    */
                },

                showTableListDialog: false,
                isLoaded: false
            };
        },
        emits: ['from-add', 'from-update', 'modal-closed'],
        components: {
            Modal: Modal,
            ModalTableList: ModalTableList
        },
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
            onTableSelected(item) {
                this.showTableListDialog = false;
                this.model.Source.Table = item;
                this.model.Source.TableId = item.Id;
            }
        },
        async created() {
            let response = await this.$fetch('/source/details/?Id=' + this.sourceId, {method: 'Get'});
            if (response.success == true) {
                this.model = response.data.model;
                this.model.Source.QueryId = this.queryId;
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
            Source table
        </template>
        <template v-slot:body>
            <div>
                <form ref="form">
                    <div>
                        <label>Table:</label>
                        <input required type="text" v-bind:value="model.Source.Table.Name" onkeydown="event.preventDefault()"/>
                        <button v-on:click="showTableListDialog = true" type="button">Select</button>
                    </div>
                </form>
            </div>
        </template>

        <template v-slot:footer>
            <button v-on:click="save" type="button">Save</button>
            <button v-on:click="close" type="button">Close</button>
        </template>
    </modal>

    <modal-table-list v-if="showTableListDialog" v-bind:query-id="0" v-on:modal-closed="showTableListDialog = false" v-on:table-selected="onTableSelected">

    </modal-table-list>

</template>

<style>

</style>