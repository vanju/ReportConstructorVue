<script>

    import Tab from './tab.vue';

    export default {
        props: ['initTabs'],
        data() {
            return {
                tabs: this.initTabs,
                selectedTab: 0,
                showTabs: false
            };
        },
        components: {
            Tab: Tab
        },
        methods: {
            selectTab(newSelectedTab) {
                let tabs = this.$refs.tabs.children,
                    oldSelectedTab = this.selectedTab;

                tabs[oldSelectedTab].style.display = 'none';
                tabs[newSelectedTab].style.display = 'flex';

                this.selectedTab = newSelectedTab;
            }
        },
        mounted() {

            let tabs = this.$refs.tabs.children;

            for (let i = 0; i < tabs.length; i++) {
                
                if (i != this.selectedTab) {
                    tabs[i].style.display = 'none';
                }
            }
            this.showTabs = true;
        }
    }

</script>

<template>
    <div class="tabpanel">
        <div class="tabpanel-header">
            <div v-for="(tabName, i) in tabs" v-on:click='selectTab(i)' v-bind:class="{'tab-name': true, 'tab-selected': i == selectedTab}">{{ tabName }}</div>
        </div>
        <div class="tabpanel-body" ref="tabs" v-show="showTabs">
            <slot name="tab-collection">

            </slot>
        </div>
    </div>
</template>

<style>

    .tab-name {
        padding: 5px;
        border-right: 1px solid grey;
    }

    .tab-selected {
        background-color: grey;
    }

    div.tabpanel-header {
        display: flex;
        flex-direction: row;
        flex: 1 1 auto;
        max-height: 30px;
        border: 1px solid grey;
    }

    div.tabpanel-header:hover {
        cursor: pointer;
    }

    div.tabpanel {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    div.tabpanel-body {
        display: flex;
        flex: 2 1 auto;
        height: 100%;
    }
</style>