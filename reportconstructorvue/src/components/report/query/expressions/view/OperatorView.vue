<script>
    export default {
        props: ['getModel', 'selectorActivatedCallback', 'contextMenuActivatedCallback'],
    };
</script>

<template>
    <div class="expression-node-operator-view">
        <div class="operator" v-on:click="selectorActivatedCallback" v-on:contextmenu="contextMenuActivatedCallback">{{ getModel('Operator').Sign }}</div>

        <div class="expression-node-grid">
            <span class="expression-node-unvisible-operator"></span>

            <slot name="content">

            </slot>
        </div>
    </div>
</template>

<style>
    .expression-node-operator-view.selected .operator {
        background-color: #ede4e4;
    }

    .expression-node-operator-view {
        padding-left: 20px;
        cursor: pointer;
        user-select: none;
    }
</style>