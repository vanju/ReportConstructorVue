<script>
    export default {
        props: ['initPredicate'],
        data() {
            
            return {
                model: {
                    Predicate: this.initPredicate
                }
            };
        },
        emits: ['predicate-selected'],
        components: {

        },
        inject: ['selectedPredicateId'],
        methods: {
            onSelect(e) {
                e.stopPropagation();
                this.$emit('predicate-selected', this.model.Predicate);
            },
            isSelected() {
                return this.selectedPredicateId == this.model.Predicate.Id;
            }
        }
    }
</script>

<template>

    <div v-on:click="onSelect" v-bind:class="{ 'predicate-selected': isSelected() }">
        <div><span v-if="model.Predicate.Operator">{{ model.Predicate.Operator.Sign }}&nbsp;</span></div>
        <div>
            <span>
                <!--{{ model.Predicate.Expression.Text }}-->
            </span>
        </div>
    </div>


</template>

<style>

</style>