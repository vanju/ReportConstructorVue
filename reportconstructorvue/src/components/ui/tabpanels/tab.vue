<script>
    export default {
        props: ['show', 'name'],
        data() {
            return {};
        },
        emit: ['tab-created'],
        methods: {

        },
        created() {
            this.$emit('tab-created', this.name);
        }
    }

</script>

<template>
    <div class="tab">
        <slot name="tab-content"></slot>
    </div>
</template>

<style>
    div.tab {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1 0 auto;
    }
</style>