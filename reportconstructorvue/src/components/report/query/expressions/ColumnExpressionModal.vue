<script>

    import Modal from '../../../ui/modals/Modal.vue';

    export default {
        props: ['ExpressionId'],
        data() {
            return {
                isLoaded: false
            };
        },
        components: {
            Modal: Modal
        },
        methods: {
            save() {

            },
            close() {
                this.$emit('modal-closed');
            }
        },
        created() {
            this.isLoaded = true;
        }
    };
</script>

<template v-if="isLoaded">
    <modal>
        <template v-slot:header>
            <p>Column Expression</p>
        </template>
        <template v-slot:footer>
            <button type="button" v-on:click="save">Save</button>
            <button type="button" v-on:click="close">Close</button>
        </template>
    </modal>
</template>