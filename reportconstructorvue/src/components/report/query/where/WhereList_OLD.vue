<script>

    import Predicate from './Predicate.vue';
    import PredicateGroup from './PredicateGroup.vue';
    import PredicateUpdateModal from './PredicateUpdateModal.vue';
    import PredicateGroupUpdateModal from './PredicateGroupUpdateModal.vue';
    import { computed } from 'vue';

    export default {
        props: {
            queryId: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                model: {
                    // WhereClause: {}
                },
                selectedPredicateInner: null,
                showPredicateUpdateDialog: false,
                showPredicateGroupUpdateDialog: false,

                updateParams: {
                    predicateId: 0,
                    parentPredicateId: null,
                    queryId: this.queryId,
                    path: '',
                    order: 1,
                    hasSiblings: false
                },
                treeVersion: 0,
                isLoaded: false
            };
        },
        computed: {
            selectedPredicate() {
                return this.selectedPredicateInner == null ? this.model.WhereClause : this.selectedPredicateInner;
            }
        },
        components: {
            Predicate: Predicate,
            PredicateGroup: PredicateGroup,
            PredicateUpdateModal: PredicateUpdateModal,
            PredicateGroupUpdateModal: PredicateGroupUpdateModal
        },
        provide() {
            return {
                selectedPredicateId: computed(() => (this.selectedPredicate == null || this.selectedPredicate.ParentId == null) ? -1 : this.selectedPredicate.Id)
            };
        },
        methods: {

            getPredicateById(id) {
                return this.findPredicateRecursively(id, this.model.WhereClause);
            },
            findPredicateRecursively(id, branch) {

                if (branch.Id == id) {
                    return branch;
                }

                let result = null;

                if (branch.IsGroup) {
                    
                    for (let i = 0; i < branch.Children.length; i++) {
                        result = this.findPredicateRecursively(id, branch.Children[i]);
                        if (result != null) {
                            break;
                        }
                    }
                }

                return result;
            },
            onPredicateSelected(predicate, parentPredicate) {
                this.selectedPredicateInner = predicate;
            },
            onPredicateUnselected() {
                this.selectedPredicateInner = null;
            },
            onAddRootPredicate(root) {
                this.model.WhereClause = root;
                this.showPredicateGroupUpdateDialog = false;
                this.treeVersion++;
            },
            onAddPredicate(item) {
                this.selectedPredicate.Children.push(item);
                this.showPredicateGroupUpdateDialog = false;
                this.showPredicateUpdateDialog = false;
            },
            onUpdatePredicate(item) {

                let parent = this.getPredicateById(this.selectedPredicate.ParentId);
                let index = this.selectedPredicate.Order - 1;
                parent.Children[index] = item;
                this.treeVersion++;

                this.showPredicateGroupUpdateDialog = false;
                this.showPredicateUpdateDialog = false;
            },
            isOrderButtonActive() {
                /*
                let target = this.selectedPredicate;
                let isActive = this.model.WhereClause.Children.find(item => item.Id == target);
                return typeof isActive == 'object';
                */
                return true;
            },
            moveUp() {
                let parent = this.getPredicateById(this.selectedPredicate.ParentId);
                let index = this.selectedPredicate.Order - 1;
                
                if (index > 0) {
                    this.swapPredicates(parent.Children, index - 1, index);
                }
            },
            moveDown() {
                let parent = this.getPredicateById(this.selectedPredicate.ParentId);
                let index = this.selectedPredicate.Order - 1;

                if (index < (parent.Children.length - 1)) {
                    this.swapPredicates(parent.Children, index, index + 1);
                }
            },
            swapPredicates(array, indexA, indexB) {
                
                let pA = array[indexA];
                let pB = array[indexB];

                // swap
                array[indexA] = pB;
                array[indexB] = pA;

                // restore operator and order values
                let orderA = pA.Order;
                let operatorA = pA.Operator;

                pA.Order = pB.Order;
                pA.Operator = pB.Operator;

                pB.Order = orderA;
                pB.Operator = operatorA;
            },
            async save() {
                let response = await this.$fetch('/predicate/edit-group/', { method: 'POST', body: JSON.stringify(this.model.WhereClause) });
                if (response.success == true) {
                    this.model.WhereClause = response.data.model.Predicate;
                    this.treeVersion++;
                }
            },
            openAddGroupDialog() {

                this.updateParams = {
                    'predicateId': 0,
                    'parentPredicateId': this.selectedPredicate.Id,
                    'queryId': this.queryId,
                    'order': this.selectedPredicate.Children.length + 1,
                    'path': this.selectedPredicate.Path + this.selectedPredicate.Id + '/',
                    'hasSiblings': this.selectedPredicate.Children.length > 0
                };
                this.showPredicateGroupUpdateDialog = true;
            },
            openAddDialog() {

                this.updateParams = {
                    'predicateId': 0,
                    'parentPredicateId': this.selectedPredicate.Id,
                    'queryId': this.queryId,
                    'order': this.selectedPredicate.Children.length + 1,
                    'path': this.selectedPredicate.Path + this.selectedPredicate.Id + '/',
                    'hasSiblings': this.selectedPredicate.Children.length > 0
                };
                this.showPredicateUpdateDialog = true;
            },
            openUpdateDialogGeneric() {

                if (this.selectedPredicate.IsGroup == true) {
                    this.openUpdateGroupDialog();
                } else {
                    this.openUpdateDialog();
                }
            },
            openUpdateGroupDialog() {
                this.updateParams = {
                    'predicateId': this.selectedPredicate.Id
                };
                this.showPredicateGroupUpdateDialog = true;
            },

            openUpdateDialog() {
                this.updateParams = {
                    'predicateId': this.selectedPredicate.Id
                };
                this.showPredicateUpdateDialog = true;
            },
            async deletePredicate() {
                let response = await this.$fetch('/predicate/delete/', { method: 'POST', body: JSON.stringify(this.selectedPredicate) });
                if (response.success == true) {

                    // update tree
                    response = await this.$fetch('/predicate/list/?query-id=' + this.queryId, { method: 'GET' });
                    if (response.success == true) {
                        this.model = response.data.model;
                    }
                    this.treeVersion++;
                }
            }
        },
        watch: {
            'model.WhereClause'(v) {
                this.selectedPredicateInner = null;
            },
            'treeVersion'(v) {

            }
        },
        async created() {
            let response = await this.$fetch('/predicate/list/?query-id=' + this.queryId, { method: 'GET', mock: false });
            if (response.success == true) {

                this.$options.entity = response.data.entity;
                this.$options.catalog = response.data.catalog;
                
                this.model = response.data.model;

                this.isLoaded = true;
            } else {
                alert('Unable to load predicate list');
            }
        }
    };
</script>

<template>
    <!--
    <div v-if="isLoaded" class="step-block">
        <slot name="header"></slot>
        <div class="fl-row">
            <div class="predicate-tree">
                <predicate-group v-bind:init-predicate="model.WhereClause" v-bind:key="treeVersion" v-on:predicate-selected="onPredicateSelected" v-on:predicate-unselected="onPredicateUnselected"></predicate-group>
            </div>
            <div class="fl-col predicate-controls">
                <button type="button" v-on:click="moveUp">Up</button>
                <button type="button" v-on:click="moveDown">Down</button>
                <br />
                <button type="button" v-on:click="openAddGroupDialog">Add group</button>
                <button type="button" v-on:click="openAddDialog">Add</button>
                <button type="button" v-on:click="openUpdateDialogGeneric">Edit</button>
                <button type="button" v-on:click="deletePredicate">Delete</button>
                <br />

                <button type="button" v-on:click="save">Save</button>
            </div>
        </div>

    </div>
    <predicate-update-modal v-if="showPredicateUpdateDialog" v-bind="updateParams" v-on:modal-closed="showPredicateUpdateDialog = false;">
    </predicate-update-modal>
    <predicate-group-update-modal v-if="showPredicateGroupUpdateDialog" v-bind="updateParams" v-on:predicate-root-add="onAddRootPredicate" v-on:predicate-add="onAddPredicate" v-on:predicate-update="onUpdatePredicate" v-on:modal-closed="showPredicateGroupUpdateDialog = false;">
    </predicate-group-update-modal>
    -->

    <div>
        <div>
            <span>1 = 1</span>
        </div>
        <div>
            <span>and</span><span>(</span><span>2 = 2 or 3 = 3</span><span>)</span>
        </div>
    </div>

</template>

<style>
    .bullets-disabled {
        list-style-type: none;
    }
    .predicate-tree {
        flex-grow: 5;
    }
    .predicate-controls {
        flex-grow: 1;
        border: 1px solid green;
        padding: 5px 10px;
    }
    .predicate-controls button {
        margin-bottom: 5px;
    }
</style>