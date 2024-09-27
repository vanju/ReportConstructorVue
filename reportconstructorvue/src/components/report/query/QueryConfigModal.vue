<script>
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

    import Modal from '../../ui/modals/Modal.vue';
    import CteList from './cte/CteList.vue';

    import SourceExpressionEditor from './expressions/SourceExpressionEditor.vue';
    import PredicateExpressionEditor from './expressions/PredicateExpressionEditor.vue';
    import SelectExpressionEditor from './expressions/SelectExpressionEditor.vue';
    // import GroupExpressionEditor from './expressions/GroupExpressionEditor.vue';
    import OrderByExpressionEditor from './expressions/OrderByExpressionEditor.vue';

    export default {
        props: ['queryId'],
        data() {
            return {
                model: {
                /*
                    Query: {
                    Id: this.initialModel.Id,
                    Name: this.initialModel.Name,
                    Comment: this.initialModel.Comment,
                    ReportId: this.initialModel.ReportId,
                    CTE: this.initialModel.CTE,
                    FromClause: this.initialModel.FromClause,
                    WhereClause: this.initialModel.WhereClause,
                    SelectClause: this.initialModel.SelectClause
                    }
                 */
                },
                step: 0,
                steps: [
                    /*
                    {
                        'name': 'CTE',
                        'isValid': this.isValidCTE
                    },
                    */
                    {
                        'name': 'From',
                        'isValid': this.isValidFrom
                    },
                    {
                        'name': 'Where',
                        'isValid': this.isValidWhere
                    },
                    {
                        'name': 'Select',
                        'isValid': this.isValidSelect
                    },
                    /*
                    {
                        'name': 'Group',
                        'isValid': this.isValidGroup
                    },
                    */
                    {
                        'name': 'Order',
                        'isValid': true
                    }
                ],
                isLoaded: false,
                debug: false
            };
        },
        emits: ['query-update', 'modal-closed'],
        computed: {

        },
        components: {
            Modal,
            CteList,
            SourceExpressionEditor,
            PredicateExpressionEditor,
            SelectExpressionEditor,
            // GroupExpressionEditor,
            OrderByExpressionEditor
        },
        methods: {
            nextStep() {
                if ((this.step + 1) == this.steps.length) {
                    return false;
                }

                let isValid = this.steps[this.step].isValid;
                if (isValid()) {
                    this.step++;
                }
            },
            previousStep() {
                if (this.step > 0) {
                    this.step--;
                }
            },
            save() {
                this.$emit('modal-closed');
            },
            showStep(step) {
                console.log(step);
                return step == this.step;
            },
            isValidCTE() {
                return true;
            },
            isValidFrom() {
                return true;
            },
            isValidWhere() {
                return true;
            },
            isValidSelect() {
                return true;
            },
            isValidGroup() {
                return true;
            }
        },
        async created() {
            
            // let response = await this.$fetch('/query/details/?Id=' + this.queryId, { method: 'GET' });

            let response = await this.$fetch('/expression-node/tree-structure/?query-id=' + this.queryId, {method: 'GET'});

            if (response.Success == true) {

                this.model = response.Data;
                this.isLoaded = true;
            } else {
                alert('Unable to get details');
            }
            
        }
    }

</script>

<template>

    <modal v-if="isLoaded" class="big">
        <template v-slot:header>
           {{ step + 1 }}. Step: {{ steps[step].name }}
        </template>
        <template v-slot:body>
            <div class="query-config">
                <!--
                <cte-list v-if="showStep(0)" v-bind:query-id="queryId">
                </cte-list>
                -->
                <source-expression-editor v-if="showStep(0)" v-bind:query-id="model.QueryId" v-bind:root-id="model.FromClause.Id">
                </source-expression-editor>

                <predicate-expression-editor v-if="showStep(1)" v-bind:query-id="model.QueryId" v-bind:root-id="model.WhereClause.Id">
                </predicate-expression-editor>

                <select-expression-editor v-if="showStep(2)" v-bind:query-id="model.QueryId" v-bind:root-id="model.SelectClause.Id">
                </select-expression-editor>

                <!--
                <group-expression-editor v-if="showStep(3)" v-bind:query-id="model.QueryId" v-bind:root-id="model.GroupByClause.Id">
                </group-expression-editor>
                -->

                <order-by-expression-editor v-if="showStep(3)" v-bind:query-id="model.QueryId" v-bind:root-id="model.OrderByClause.Id">
                </order-by-expression-editor>

            </div>
        </template>
        <template v-slot:footer>
            <div class="fl-row fl-row-center">
                <div class="control-el">
                    <button v-on:click="save">Close</button>
                </div>
                <div class="control-el">
                    <button v-on:click="previousStep" type="button">Previous</button>
                </div>
                <div class="control-el">
                    <button v-on:click="nextStep" type="button">Next</button>
                </div>
            </div>
        </template>
    </modal>
</template>

<style>
    .query-config {
        width: 100%;
    }
</style>
