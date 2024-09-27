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
    <span class="expression-node-sequence-set-view" v-on:click="selectorActivatedCallback" v-on:contextmenu="contextMenuActivatedCallback">
        <span class="sequence-set-view-selector leading-selector">(</span>
        <slot name="content">
        </slot>
        <span class="sequence-set-view-selector trailing-selector">)</span>
    </span>
</template>

<style>

    .expression-node-sequence-set-view.selected {
        background-color: #ede4e4;
    }

    .sequence-set-view-selector {
        cursor: pointer;
    }

    .expression-node-sequence-set-view:hover .inline-sequence-set-selector {
        font-weight: bold;
    }

    .sequence-set-view-selector.leading-selector {
        padding-right: 5px;
    }

    .sequence-set-view-selector.trailing-selector {
        padding-left: 5px;
    }

    .expression-node-sequence-set-view .container-item:not(:nth-last-child(2)):after {
        content: ", "
    }

</style>