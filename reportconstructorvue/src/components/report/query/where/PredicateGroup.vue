<script>

    import Predicate from './Predicate.vue';

    export default {
        props: ['initPredicate'],
        data() {
            return {
                model: {
                    Predicate: this.initPredicate
                }
            };
        },
        watch: {
            'model.Predicate.Operator'(v) {
                if (v) {
                    this.model.Predicate.OperatorId = v.Id;
                } else {
                    this.model.Predicate.OperatorId = null;
                }
            }
        },
        computed: {
            isSelected() {
                return this.selectedPredicateId == this.model.Predicate.Id;
            },
            getSortedChildren() {
                return this.model.Predicate.Children.sort(function (a, b) {
                    if (a.Order > b.Order) {
                        return 1;
                    } else if (a.Order < b.Order) {
                        return -1;
                    }
                    return 0;
                });
            }
        },
        emits: ['predicate-selected', 'predicate-unselected', 'predicate-order-changed'],
        components: {
            Predicate: Predicate
        },
        inject: ['selectedPredicateId'],
        methods: {
            select(e) {
                e.stopPropagation();
                if (this.isSelected) {
                    this.$emit('predicate-unselected');
                } else {
                    this.$emit('predicate-selected', this.model.Predicate, null);
                }
            },
            onChildSelected(predicate, parentPredicate) {
                if (parentPredicate == null) {
                    parentPredicate = this.model.Predicate;
                }
                this.$emit('predicate-selected', predicate, parentPredicate);
            },
            onChildUnselected() {
                this.$emit('predicate-unselected');
            }
        }
    }
</script>

<template>
    <div v-on:click="select" v-bind:class="{ 'predicate-selected': isSelected }">
        <div><span v-if="model.Predicate.Operator">{{ model.Predicate.Operator.Sign }}</span></div>
        <div v-if="model.Predicate.ParentId != null">(</div>
        <ul class="bullets-disabled" v-for="(item, i) in getSortedChildren" :key="item.Id">
            <predicate v-if="!item.IsGroup" v-bind:init-predicate="item" v-on:predicate-selected="onChildSelected" v-on:predicate-unselected="onChildUnselected"></predicate>
            <predicate-group v-if="item.IsGroup" v-bind:init-predicate="item" v-on:predicate-selected="onChildSelected" v-on:predicate-unselected="onChildUnselected"></predicate-group>
        </ul>
        <div v-if="model.Predicate.ParentId != null">)</div>
    </div>
</template>

<style>
    .predicate-selected {
        background-color: grey;
    }
</style>