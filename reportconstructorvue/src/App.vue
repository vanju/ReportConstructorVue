<script>
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

    import ReportList from './components/report/ReportList.vue';
    //import WhereList from './components/report/query/where/WhereList.vue'; // Temp
    //import PredicateExpressionEditor from './components/report/query/expressions/PredicateExpressionEditor.vue'; // Temp !!!
    //import SourceExpressionEditor from './components/report/query/expressions/SourceExpressionEditor.vue'; // Temp !!!
    //import SelectExpressionEditor from './components/report/query/expressions/SelectExpressionEditor.vue'; // Temp !!!
    //import GroupExpressionEditor from './components/report/query/expressions/GroupExpressionEditor.vue';

    //import OrderByExpressionEditor from './components/report/query/expressions/OrderByExpressionEditor.vue';

    export default {
        props: ['initialModel'],
        data() {
            return {
                debug: false
            };
        },
        components: {
            ReportList: ReportList,
            //PredicateExpressionEditor: PredicateExpressionEditor,
            //SourceExpressionEditor: SourceExpressionEditor,
            //SelectExpressionEditor: SelectExpressionEditor,
            //GroupExpressionEditor: GroupExpressionEditor,
            //OrderByExpressionEditor: OrderByExpressionEditor
        }
    }

</script>

<template>
    <report-list></report-list>

    <!--<predicate-expression-editor></predicate-expression-editor>-->
    <!--<source-expression-editor></source-expression-editor>-->
    <!--<select-expression-editor></select-expression-editor>-->
    <!--<group-expression-editor></group-expression-editor>-->
    <!--<order-by-expression-editor></order-by-expression-editor>-->

    <div v-show="debug" class="debug">
        <p>Model:</p>
        <pre><code></code></pre>
    </div>

    <!--
        <div class="fl-row fl-row-center">
            <pre><code>{{ model.Reports }}</code></pre>
        </div>

        <div class="dev-tools">
            Dev tools
            <button type="button" v-on:click="debug = !debug">debug</button>
        </div>
    -->

</template>

<style>
    .debug {
        position: absolute;
        width: 400px;
        border: 1px solid green;
        right: 0px;
        top: 0;
        bottom: 54px;
        background: white;
        padding: 5px;
    }

    .dev-tools {
        display: flex;
        flex-direction: row;
        justify-content: end;
        border-top: 1px solid green;
        padding-right: 10px;
        padding-left: 10px;
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .report-constructor {
        border: 1px solid green;
        width: 90%;
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 5%;
        margin-bottom: 5%;
        height: 90%;
    }

    .step-block {
        display: flex;
        flex-direction: column;
        border: 1px solid green;
        padding: 1px;
    }

    .fl {
        display: flex;
    }

    .fl-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fl-col {
        display: flex;
        flex-direction: column;
    }

    .h100 {
        height: 100%;
    }
    .w100 {
        width: 100%;
    }
    .w90 {
        width: 90%;
    }
    .text-center {
        text-align: center;
    }
    .fl-row {
        display: flex;
        flex-direction: row;
    }

    .fl-row-grow {
        width: 100%;
    }

    .fl-row-center {
        justify-content: center;
    }

    .fl-row-around {
        justify-content: space-around;
    }

    .control-col {
        width: 25%;
    }

    .info-col {
        width: 75%;
    }

    .g-center {
        text-align: center;
    }

    .control-el {
        padding: 5px;
    }

    .control-el button {
        width: 100px;
    }

    .heading {
        margin: 0;
    }

    .hide-option {
        display: none;
    }

    .layout-table td {
        padding: 5px;
    }
</style>