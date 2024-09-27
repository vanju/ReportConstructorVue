<script>
    export default {
        props: ['getModel', 'selectorActivatedCallback', 'contextMenuActivatedCallback'],
    };
</script>

<template>

    <div class="expression-node-grid-wrapper expression-node-root-view">

        <div class="expression-node-grid">
            <span class="expression-node-unvisible-operator"></span>

            <slot name="content">

            </slot>
        </div>
    </div>

</template>