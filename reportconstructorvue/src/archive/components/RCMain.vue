<script>
    import Modal from './Modal.vue';
    import RCFrom from './RCFrom.vue';
    import RCCte from './RCCte.vue';
    import RCWhere from './RCWhere.vue';

    export default {
        props: ['debug'],
        data() {
            return {
                step: 1,
                cte: [],
                from: [],
                where: []
            }
        },
        computed: {
            hola() {
                console.log(this.from);
            },
            debugData() {
                return {
                    cte: this.cte,
                    from: this.from,
                    where: this.where
                };
            }
        },
        components: {
            Modal,
            RCFrom,
            RCCte,
            RCWhere
        },
        methods: {
            nextStep() {
                this.step++;
            },
            previousStep() {
                if (this.step > 1) {
                    this.step--;
                }
            },
            showTab(step) {
                return step == this.step;
            }
        }
    }

</script>

<template>

    <div class="main-container">
        <form>
            <RCCte v-show="showTab(1)" :storage="cte">
                <template v-slot:header>
                    <h3>1. Step: CTE</h3>
                </template>
            </RCCte>
            <RCFrom v-show="showTab(2)" :storage="from">
                <template v-slot:header>
                    <h3>2. Step: From</h3>
                </template>
            </RCFrom>
            <RCWhere v-show="showTab(3)" :storage="where">
                <template v-slot:header>
                    <h3>3. Step: Where</h3>
                </template>
            </RCWhere>

            <div class="f-row f-gcenter">
                <div class="control-el">
                    <button v-on:click="previousStep" type="button">Previous</button>
                </div>
                <div class="control-el">
                    <button v-on:click="nextStep" type="button">Next</button>
                </div>
            </div>
        </form>
    </div>
    <div v-show="debug" class="debug">
        <p>Model:</p>
        <pre><code>{{ debugData }}</code></pre>
    </div>
</template>

<style>
    .debug {
        position: absolute;
        width: 400px;
        border:1px solid green;
        right: 0px;
        top: 0;
        bottom: 26px;
        background: white;
        padding: 5px;
    }
    .main-container {
        height: 100%;
    }
    .step-block {
        display: flex;
        flex-direction: column;
        border: 1px solid green;
        padding: 1px;
    }
    .active-block {
        /*display: initial;*/
    }
    .f-col {
        display: flex;
        flex-direction: column;
    }
    .f-row {
        display: flex;
        flex-direction: row;
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
    .f-gcenter {
        justify-content: center;
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
</style>
