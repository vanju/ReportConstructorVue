<script>
    import Modal from '../../../ui/modals/Modal.vue';

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
                    // Predicate: {}
                },
                isLoaded: false
            };
        },
        components: {
            Modal: Modal
        },
        emits: ['predicate-root-add', 'predicate-update', 'predicate-add', 'modal-closed'],
        computed: {
            isNew() {
                return this.predicateId == 0;
            },
            hasParent() {
                return this.parentPredicateId > 0;
            },
            isOperatorRequired() {
                return this.hasSiblings;
            },
            hasRequiredInputs() {
                return this.isOperatorRequired;
            }
        },
        methods: {
            async save() {

                if (this.hasRequiredInputs) {
                    let form = this.$refs.form;

                    if (!form.checkValidity()) {
                        form.reportValidity();
                        return;
                    }
                }

                if (this.isNew) {

                    if (!this.hasParent) {
                        let response = await this.$fetch('/predicate/create-root-and-child/', { method: 'POST', body: JSON.stringify(this.model.Predicate) });

                        if (response.success == true) {
                            this.model = response.data.model;
                            this.$emit('predicate-root-add', this.model.Predicate);
                        }
                    } else {
                        let response = await this.$fetch('/predicate/create-group/', { method: 'POST', body: JSON.stringify(this.model.Predicate) });

                        if (response.success == true) {
                            this.model = response.data.model;
                            this.$emit('predicate-add', this.model.Predicate);
                        }
                    }
                } else {
                    let response = await this.$fetch('/predicate/edit-group/', { method: 'POST', body: JSON.stringify(this.model.Predicate) });
                    if (response.success == true) {
                        this.$emit('predicate-update', this.model.Predicate);
                    }
                }
            },
            close() {
                this.$emit('modal-closed');
            },
            modelLoaded() {

                if (this.isNew) {
                    this.model.Predicate.ParentId = this.parentPredicateId;
                    this.model.Predicate.QueryId = this.queryId;
                    this.model.Predicate.Order = this.order;
                    this.model.Predicate.Path = this.path;
                }
            }
        },
        watch: {
            'model.Predicate.Operator'(v) {
                if (v) {
                    this.model.Predicate.OperatorId = v.Id;
                }
            }
        },
        async created() {

            /*
            let queryParams = `id=${this.predicateId}&parent-id=${this.parentPredicateId}&query-id=${this.queryId}`
            
            let response = await this.$fetch('/predicate/group-details/?' + queryParams, { method: 'GET' });
            */

            let response = await this.$fetch('/predicate/group-details/?id=' + this.predicateId, { method: 'GET' });

            if (response.success == true) {
                // catalog first
                this.$options.catalog = response.data.catalog;

                // model next
                this.model = response.data.model;
                this.modelLoaded();

                if (this.isNew && !this.hasSiblings) {
                    await this.save();
                }

                this.isLoaded = true;
            }
        }
    };

</script>

<template>
    <modal v-if="isLoaded">

        <template v-slot:header>
            New group predicate
        </template>
        <template v-slot:body>
            <form ref="form">
                <table>
                    <tbody>
                        <tr>
                            <td><label>Operator</label></td>
                            <td>
                                <select v-model="model.Predicate.Operator" v-bind:required="isOperatorRequired">
                                    <option v-for="(item, i) in $options.catalog.Operators" v-bind:value="item">
                                        {{ item.Name }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </template>

        <template v-slot:footer>
            <button type="button" v-on:click="save">Save</button>
            <button type="button" v-on:click="close">Close</button>
        </template>
    </modal>

</template>
