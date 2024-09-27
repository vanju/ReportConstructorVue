<script>

    import ExpressionNode from './ExpressionNode.vue';

    export default {
        extends: ExpressionNode,
        inject: ['updateExpressionNodeConstant'],
        data() {
            return {
                tempValue: null
            }
        },
        methods: {
            onFocusIn(e) {
                this.tempValue = this.model.ExpressionNode.Constant.Value;
            },
            onFocusOut(e) {
                if (this.getConstantType() == 'datetime') {
                    this.updateExpressionNodeConstant(this.model.ExpressionNode);
                } else if (this.tempValue != this.model.ExpressionNode.Constant.Value) {
                    this.updateExpressionNodeConstant(this.model.ExpressionNode);
                }
            },
            getInputType() {
                let type = 'text';
                switch (this.getConstantType()) {
                    case 'decimal':
                    case 'bigint':
                    case 'int':
                    case 'bit':
                        type = 'number';
                        break;
                    case 'datetime':
                        type = 'datetime-local';
                        break;
                }
                return type;
            },
            getConstantType() {
                return this.model.ExpressionNode.Constant.DataPrototype.SqlName;
            }
        }
    }

</script>

<template>
    <span class="expression-node-constant" 
          v-bind:class="{selected: isNodeSelected()}" 
          v-on:click="setSelectedNode(model.ExpressionNode, $event)" 
          v-on:contextmenu="showContextMenu(model.ExpressionNode, $event)"
    >
        <span>
            <input 
                   class="constant-value" 
                   v-model="model.ExpressionNode.Constant.Value" 
                   v-on:focusout="onFocusOut" 
                   v-on:focusin="onFocusIn"
                   v-bind:type="getInputType()"
            />
        </span>
    </span>
</template>

<style>
    .expression-node-constant.selected {
        background-color: grey;
        /*
        padding-left: 10px;
        padding-right: 10px;
        */
    }
    .expression-node-constant .constant-value {
        min-width: 25px;
        /*width: 100px;*/
        border-width: 0 0 1px 0;
    }
    .expression-node-constant-input-wrapper {

    }
</style>