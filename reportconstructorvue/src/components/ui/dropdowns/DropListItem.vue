<script>
    export default {
        props: ['initItem'],
        data() {
            return {
                model: {
                    Item: this.initItem
                }
            };
        },
        emits: ['list-item-selected'],
        methods: {
            select() {
                this.$emit('list-item-selected', this.model.Item);
            },
            onItemSelected(item) {
                this.$emit('list-item-selected', item);
            },
            hasChildren() {
                return this.model.Item.Children && this.model.Item.Children.length > 0;
            }
        },
        computed: {
            style() {
                let style = ['list-item'];

                if (this.model.Item.Style != null) {
                    style.push(this.model.Item.Style);
                }
                return style;
            }
        }
    }
</script>

<template>
    <div class="list-item-wrapper">
        <div v-bind:class="style" v-on:click="select">
            {{ model.Item.Name }}
        </div>

        <div v-if="hasChildren()" class="children-wrapper">
            <drop-list-item v-for="(item, i) in model.Item.Children" v-bind:init-item="item" v-on:list-item-selected="onItemSelected">

            </drop-list-item>
        </div>
    </div>

</template>

<style>

    .yellow {
        background-color: yellow;
    }

    .red {
        background-color: red;
    }
</style>