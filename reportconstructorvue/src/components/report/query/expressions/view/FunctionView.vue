<script>
    export default {
        props: ['getModel', 'selectorActivatedCallback', 'contextMenuActivatedCallback'],
    };
</script>

<template>
    <span class="expression-node-function-view">
        <span class="function" v-on:click="selectorActivatedCallback" v-on:contextmenu="contextMenuActivatedCallback">{{ getModel('Function').Name }}</span>
        <span class="func-parenthesis">(</span>
        <slot name="content">

        </slot>
        <span class="func-parenthesis">)</span>
    </span>
</template>

<style>
    .expression-node-function-view.selected .function {
        background-color: #ede4e4;
    }

    .expression-node-function-view .func-parenthesis {
        padding-left: 3px;
        padding-right: 3px;
    }

    .expression-node-function-view {
        cursor: pointer;
        user-select: none;
    }
</style>