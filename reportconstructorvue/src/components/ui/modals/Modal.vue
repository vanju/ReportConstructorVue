<script>
    export default {
        props: {
            size: {
                type: String,
                default: "normal"
            },
            show: {
                type: Boolean,
                default: true
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            showFooter: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {

            };
        },
        methods: {
            test() {
                console.log(this);
            }
        }
    }

</script>

<template>
    <div v-if="show" class="modal-context">
        <div v-bind:class="['modal', 'modal-' + $attrs.class]">
            <div v-if="showHeader" class="modal-header">
                <slot name="header">Header</slot>
            </div>

            <div class="modal-body">
                <slot name="body">Body</slot>
            </div>

            <div v-if="showFooter" class="modal-footer">
                <slot name="footer">Footer</slot>
            </div>
        </div>
    </div>
</template>

<style>
    .modal-context {
        display: flex;
        position: fixed;
        align-items: center;
        justify-content: center;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
    }
    .modal {
        width: 50%;
        height: 50%;
        background-color: #fefefe;
        border: 2px solid blue;
        display: flex;
        flex-direction: column;
    }
    div.modal-big {
        width: 95%;
        height: 90%;
    }
    .modal-header {
        display: flex;
        flex: 1 0 auto;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid grey;
    }
    .modal-body {
        display: flex;
        flex: 2 0 auto;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .modal-footer {
        display: flex;
        flex: 1 0 auto;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-top: 1px solid grey;
    }
    .modal-footer button {
        margin-left: 10px;
        margin-right: 10px;
    }
</style>