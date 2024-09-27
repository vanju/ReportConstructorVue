<script>
    export default {
        props: [],
        data() {
            return {
                test: true
            };
        },
        components: {

        },
        methods: {

        }
    };
</script>


<template>
    <div class="step-block">
        <slot name="header"></slot>
        <div class="f-row">
            Placeholder CTE
        </div>
    </div>
</template>