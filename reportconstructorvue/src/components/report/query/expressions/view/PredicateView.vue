<script>
    export default {
        props: ['selectorActivatedCallback', 'contextMenuActivatedCallback'],
        data() {
            return {

            };
        },
        emits: ['view-selector-activated', 'view-context-menu-activated']
    };
</script>

<template>

    <span class="expression-node-predicate-view">
        <span class="predicate-selector-mark" v-on:click="selectorActivatedCallback" v-on:contextmenu="contextMenuActivatedCallback">*</span>
        <slot name="content">

        </slot>
    </span>

</template>

<style>
    .expression-node-predicate-view.selected {
        background-color: #ede4e4;
    }

    .predicate-selector-mark {
        visibility: hidden;
        padding-left: 5px;
        padding-right: 5px;
        cursor: pointer;
    }

    .expression-node-predicate-view:hover .predicate-selector-mark {
        visibility: visible;
    }

</style>