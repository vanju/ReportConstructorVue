<script>

    import Modal from '../ui/modals/Modal.vue';

    export default {
        props: ['tableId'],
        inject: ['RCCorePlugin'],
        data() {
            return {
                model: {
                    // Columns: {},
                    // Table: {}
                },
                Table: null,
                selected: null,
                isLoaded: false
            };
        },
        emits: ['table-field-selected', 'modal-closed'],
        components: {
            Modal: Modal
        },
        methods: {
            selectField(index) {
                this.selected = index;
            },
            save() {
                if (this.selected === null) {
                    alert('Select field');
                } else {
                    this.$emit('table-field-selected', this.model.Columns[this.selected]);
                }
            },
            close() {
                this.$emit('modal-closed');
            }
        },
        async created() {
            let response = await this.$fetch('/column/list/?tableId=' + this.tableId, { method: 'GET' });
            if (response.success == true) {
                this.model.Table = response.data.model.Table;
                this.model.Columns = response.data.model.Columns;
                this.isLoaded = true;
            } else {
                alert('Unable to load column list');
            }
        }
    };

</script>

<template>

    <modal v-if="isLoaded">
        <template v-slot:header>
            Table: {{ model.Table.Name }}
        </template>
        <template v-slot:body>
            <div>
                <div class="g-center"><p>Fields:</p></div>
                <table class="layout-table table-field-list">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Primary</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in model.Columns" v-bind:class="selected == index ? 'selected-row' : ''" v-on:click="selectField(index)">
                            <td>{{ item.Id }}</td>
                            <td>{{ item.Name }}</td>
                            <td>{{ item.Type }}</td>
                            <td>{{ item.Primary }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-slot:footer>
            <button v-on:click="save" type="button">Select</button>
            <button v-on:click="close" type="button">Close</button>
        </template>
    </modal>

</template>

<style>
    .table-field-list .selected-row > td {
        background-color: lightblue;
    }
</style>
