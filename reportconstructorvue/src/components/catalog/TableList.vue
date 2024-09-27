<script>
    import Modal from '../ui/modals/Modal.vue';

    export default {
        props: ['queryId'],
        inject: ['RCCorePlugin'],
        data() {
            return {
                model: {
                    // Tables: []
                },
                selected: null, // index
                isLoaded: false
            };
        },
        emits: ['table-selected', 'modal-closed'],
        components: {
            Modal: Modal
        },
        methods: {
            selectTable(index) {
                this.selected = index;
            },
            select() {
                if (this.selected === null) {
                    alert('Select table');
                } else {
                    this.$emit('table-selected', this.model.Tables[this.selected]);
                }
            },
            close() {
                this.$emit('modal-closed');
            }
        },
        async created() {

            let response = await this.$fetch('/table/list/?queryId=' + this.queryId, { method: 'GET' });

            if (response.success == true) {
                this.model.Tables = response.data;
                this.isLoaded = true;
            } else {
                alert('Unable to load table list');
            }
        }
    };

</script>

<template>

    <modal v-if="isLoaded">
        <template v-slot:header>
            Tables
        </template>
        <template v-slot:body>
            <div>
                <table class="table-list">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in model.Tables" v-bind:class="selected == index ? 'selected-row' : ''" v-on:click="selectTable(index)">
                            <td>{{ item.Id }}</td>
                            <td>{{ item.Name }}</td>
                            <td>{{ item.Type }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-slot:footer>
            <button v-on:click="select" type="button">Select</button>
            <button v-on:click="close" type="button">Close</button>
        </template>
    </modal>

</template>

<style>
    .table-list .selected-row > td {
        background-color: lightgreen;
    }
</style>
