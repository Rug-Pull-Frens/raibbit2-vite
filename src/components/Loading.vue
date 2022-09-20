<template>
    <div
        class="loading"
        :class="{'-done': loadingDone }"
    >
        <figure class="loading__logo">
            <img src="@/assets/logo.png" alt="">
        </figure>
        <p class="loading__text">Loading...</p>
    </div>
</template>
<script setup>
    import { watch, ref } from "@vue/runtime-core"

    const props = defineProps({
        progress: {
            type: Number,
            default: 0,
        },
    })
    
    watch(() => props.progress, (newVal, oldVal) => {
        if (newVal === 1) {
            loadingDone.value = true
        }
    })

    const loadingDone = ref(false)
</script>
<style lang="scss">
    $class-name: loading;
    .#{$class-name} {
        @include size(100vw, 100%);

        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        background-color: map-get($colors, black);
        transition: opacity .5s 1s;

        &.-done {
            pointer-events: none;
            opacity: 0;

            .#{$class-name}__logo {
                animation: loading 1s cubic-bezier(0.76, 0, 0.24, 1);
                animation-fill-mode: forwards;
            }
        }

        &__logo {
            @include size(320px, auto);

            img {
                @include size(100%);
            }
        }

        &__text {
            @include typo('heading', 3);

            position: absolute;
            bottom: 10vh;
            color: map-get($colors, white);
            animation: shining .5s infinite;
        }
    }

    @keyframes loading {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0.5);
        }
    }

    @keyframes shining {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>