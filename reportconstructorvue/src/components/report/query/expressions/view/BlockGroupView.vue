<script>
    // import ContextMenu from '/src/components/ui/dropdowns/ContextMenu.vue';

    export default {
        props: ['selectorActivatedCallback', 'contextMenuActivatedCallback'],
        data() {
            return {
                
            };
        },
        emits: ['view-selector-activated', 'view-context-menu-activated'],
        components: {
            
        },
        methods: {
        }
    };
</script>

<template>

    <div class="expression-node-grid-wrapper expression-node-block-group-view" v-on:click="selectorActivatedCallback" v-on:contextmenu="contextMenuActivatedCallback">

        <div class="block-group-view-leading-selector">
            &nbsp;
        </div>

        <div class="expression-node-grid">
            <span class="expression-node-unvisible-operator"></span>
            <slot name="content">
            </slot>
        </div>

        <div class="block-group-view-trailing-selector">
            &nbsp;
        </div>

    </div>

</template>

<style>
    .expression-node-block-group-view.selected {
        background-color: #ede4e4;
    }

    .block-group-view-leading-selector {
        width: 5px;
        border-top: 2px solid green;
        border-left: 2px solid green;
        border-bottom: 2px solid green;
        cursor: pointer;
    }

    .block-group-view-trailing-selector {
        width: 5px;
        border-top: 2px solid green;
        border-right: 2px solid green;
        border-bottom: 2px solid green;
        cursor: pointer;
    }
</style>
