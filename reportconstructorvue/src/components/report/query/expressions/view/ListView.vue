<script>
    export default {
        props: ['getModel', 'selectorActivatedCallback', 'contextMenuActivatedCallback'],
    };
</script>

<template>

    <div class="expression-node-root-list-view">
        <slot name="content">

        </slot>
    </div>
</template>

<style>
    .expression-node-root-list-view {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 3px;
        margin-bottom: 5px;
        width: 100%;
    }
</style>