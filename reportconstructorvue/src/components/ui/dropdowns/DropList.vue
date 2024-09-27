<script>

    import DropListItem from './DropListItem.vue';
    // import { toRaw } from 'vue';

    export default {
        props: ['buttonName', 'initList', 'buttonClass', 'styles'],
        data() {
            return {
                model: {
                    list: this.initList
                },
                btnClass: {
                    main: 'drop-button',
                    clicked: 'clicked'
                },
                showList: false
            };
        },
        emits: ['drop-list-opened', 'drop-list-item-selected'],
        components: {
            DropListItem
        },
        methods: {
            show(e) {
                this.showList = !this.showList;

                if (this.showList) {
                    this.$emit('drop-list-opened');
                }
            },
            hide(e) {
                if (e.relatedTarget == null || !Object.is(e.relatedTarget, this.$refs.list)) {
                    this.showList = false;
                }
            },
            onItemSelected(item) {
                this.showList = false;
                this.$emit('drop-list-item-selected', item.Command);
            }
        }
    };
</script>

<template>
    <div class="drop-list-wrapper">
        <button v-bind:class="[buttonClass]" v-on:click="show" v-on:focusout="hide" type="button">{{ buttonName }}</button>
        <div tabindex="-1" v-show="showList" class="dropdown-content fl-col" v-bind:class="styles" ref="list">

            <drop-list-item v-for="(item, i) in model.list" v-bind:init-item="item" v-on:list-item-selected="onItemSelected">
                {{ item.Name }}
            </drop-list-item>

        </div>
    </div>
</template>

<style>

    
    .drop-list-wrapper {
        position: relative;
    }

    .drop-list-wrapper .dropdown-content {
        position: absolute;
        top: 22px;
        left: 0;
        min-width: 100px;
        z-index: 2;
        background-color: #f9f9f9;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    .drop-list-wrapper .dropdown-content .list-item-wrapper {
        display: block;
        position: relative;
    }

    .drop-list-wrapper .dropdown-content .list-item-wrapper > .children-wrapper {
        display: none;
    }

    .drop-list-wrapper .dropdown-content .list-item-wrapper:hover > .children-wrapper {
        display: block;
        position: absolute;
        top: 0;
        left: 100%;
        min-width: 100px;
        z-index: 2;
        background-color: #f9f9f9;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    .drop-list-wrapper .dropdown-content .list-item {
        margin: 0px;
        padding: 5px;
    }

    .drop-list-wrapper .dropdown-content .list-item:hover {
        background-color: #b3e6ff;
        cursor: pointer;
    }

</style>