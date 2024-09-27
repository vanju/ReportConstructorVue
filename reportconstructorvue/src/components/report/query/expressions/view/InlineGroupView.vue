<script>
    export default {
        props: ['selectorActivatedCallback', 'contextMenuActivatedCallback'],
        data() {
            return {

            };
        }
    };
</script>

<template>
    <span class="expression-node-inline-group-view" v-on:click="selectorActivatedCallback" v-on:contextmenu="contextMenuActivatedCallback">
        <span class="inline-group-view-selector leading-selector">(</span>
        <slot name="content">
        </slot>
        <span class="inline-group-view-selector trailing-selector">)</span>
    </span>
</template>

<style>

    .expression-node-inline-group-view.selected {
        background-color: #ede4e4;
    }

    .inline-group-view-selector {
        cursor: pointer;
    }

    .expression-node-inline-group-view:hover .inline-group-view-selector {
        font-weight: bold;
    }

    .inline-group-view-selector.leading-selector {
        padding-right: 5px;
    }

    .inline-group-view-selector.trailing-selector {
        padding-left: 5px;
    }

</style>