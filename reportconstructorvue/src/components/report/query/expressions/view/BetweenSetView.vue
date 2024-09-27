<script>
    export default {
        props: ['selectorActivatedCallback', 'contextMenuActivatedCallback'],
        data() {
            console.log('test');
            return {

            };
        }
    };
</script>

<template>
    <span class="expression-node-between-set-view" v-on:click="selectorActivatedCallback" v-on:contextmenu="contextMenuActivatedCallback">
        <span class="between-set-view-selector leading-selector">(</span>
        <slot name="content">
        </slot>
        <span class="inline-group-view-selector trailing-selector">)</span>
    </span>
</template>

<style>

    .expression-node-between-set-view.selected {
        background-color: #ede4e4;
    }

    .between-set-view-selector {
        cursor: pointer;
    }

    .expression-node-between-set-view :nth-child(2):after {
        content: "and";
        padding-left: 10px;
        padding-right: 10px;
    }

    .expression-node-between-set-view:hover .inline-between-set-selector {
        font-weight: bold;
    }

    .between-set-view-selector.leading-selector {
        padding-right: 5px;
    }

    .between-set-view-selector.trailing-selector {
        padding-left: 5px;
    }

</style>