<script>

    import DropListItem from './DropListItem.vue';

    export default {
        props: ['initList', 'left', 'top', 'bottom', 'avalY'],
        data() {
            return {
                model: {
                    list: this.initList
                },
                showList: true,
                version: 1
            };
        },
        emits: ['drop-list-item-selected'],
        components: {
            DropListItem
        },
        methods: {
            hide(e) {
                if (e.relatedTarget == null || !Object.is(e.relatedTarget, this.$refs.menu)) {
                    this.showList = false;
                }
                this.version++;
            },
            onItemSelected(item) {
                this.showList = false;
                this.$emit('drop-list-item-selected', item.Command);
            }
        },
        mounted() {
            if (this.$.vnode.key == 0) {
                this.showList = false;
            }
            
            this.$refs.menu.focus();

            if (this.avalY - this.$refs.menu.offsetHeight > 0) {
                this.$refs.menu.style.top = (this.top + 'px');
            } else {
                this.$refs.menu.style.bottom = (this.bottom + 'px');
            }
            
            this.$refs.menu.style.left = (this.left + 5 + 'px');
        }
    };
</script>

<template>
    <div v-show="showList" class="dropdown-content fl-col" ref="menu" tabindex="-1" v-on:focusout="hide">

        <drop-list-item v-for="(item, i) in model.list" v-bind:init-item="item" v-on:list-item-selected="onItemSelected">
            {{ item.Name }}
        </drop-list-item>

    </div>
</template>

<style>

    .drop-list-wrapper {
        display: inline-block;
        position: relative;
    }

    .dropdown-content {
        position: absolute;
        min-width: 100px;
        height: fit-content;
        z-index: 2;
        background-color: #f9f9f9;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        /*overflow: visible;*/
    }

    .dropdown-content .list-item-wrapper {
        display: block;
        position: relative;
    }

    .dropdown-content .list-item-wrapper > .children-wrapper {
        display: none;
    }

    .dropdown-content .list-item-wrapper:hover > .children-wrapper {
        display: block;
        position: absolute;
        bottom: 0;
        left: 100%;
        min-width: 100px;
        z-index: 2;
        background-color: #f9f9f9;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    .dropdown-content .list-item {
        margin: 0px;
        padding: 5px;
    }

    /*
    .dropdown-content .list-item:hover {
        background-color: #b3e6ff;
        cursor: pointer;
    }
    */

    .dropdown-content .list-item-wrapper:hover {
        background-color: #b3e6ff;
        cursor: pointer;
    }
</style>