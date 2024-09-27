<script>

    import Modal from '../../../ui/modals/Modal.vue';

    export default {
        props: ['expressionId', 'view'],
        data() {
            return {
                model: {
                    /*
                        Expression: {

                        }
                    */
                },
                isLoaded: false
            };
        },
        components: {
            Modal: Modal
        },
        emits: ['expression-add', 'expression-update', 'modal-closed'],
        computed: {
            isNew() {
                return this.expressionId == 0;
            }
        },
        methods: {
            save() {

                let form = this.$refs.form;

                if (form.checkValidity()) {
                    if (this.isNew) {
                        this.$emit('expression-add', this.model.Expression);
                    } else {
                        this.$emit('expression-update', this.model.Expression);
                    }
                    
                } else {
                    form.reportValidity();
                }
            },
            close() {
                this.$emit('modal-closed');
            },
            modelLoaded() {

            }
        },
        catalog: {},
        async created() {

            let response = await this.$fetch('/expression/details/?id=' + this.expressionId, { method: 'Get' });

            if (response.success == true) {
                // catalog first
                this.$options.catalog = response.data.catalog;

                // model next
                this.model = response.data.model;
                this.modelLoaded();
                this.isLoaded = true;
            } else {
                alert('Unable to load constant expression');
            }
        }
    };
</script>

<template>
    <modal v-if="isLoaded">
        <template v-slot:header>
            <p>Constant Expression</p>
        </template>
        <template v-slot:body>
            <div v-if="view == 'edit' || true">
                <form ref="form">
                    <select v-model="model.Expression.ConstantType" required>
                        <option v-for="(item, i) in $options.catalog.scalarTypes" v-bind:value="item.Type"> {{ item.Name }} </option>
                    </select>
                    <input v-model="model.Expression.ConstantValue" required type="text" />
                </form>
            </div>
        </template>
        <template v-slot:footer>
            <button type="button" v-on:click="save">Save</button>
            <button type="button" v-on:click="close">Close</button>
        </template>
    </modal>
</template>