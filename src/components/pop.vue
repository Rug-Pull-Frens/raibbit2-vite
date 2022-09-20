<template>
    <Teleport to="body">
        <div class="esNotification">
            <div class="esNotification__inner">
                <i @click="closePops()"><span /><span /></i>
                <img src="/src/assets/icon/check.svg">
                <h4>Congratulations</h4>
                <p>Your Purchase is Successful !</p>
                <div class="esNotification__inner-btn header__nav-btn yellow" @click="openSea()">View on OpenSea</div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
    import { ref, reactive } from "@vue/reactivity";
    // import { defineProps, computed } from "@vue/runtime-core"

    const emit = defineEmits(['update'])
    const closePops = () => {
        emit('update')
    }

    // View on OpenSea
    const openSea = () => {
        
    }
</script>

<style lang='scss'>
        .esNotification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;

        &.out {
            opacity: 0;
            pointer-events: none;
        }

        &__inner {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 50%;
            padding: 2rem;
            background-color: map-get($colors, white);
            border-radius: 24px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            pointer-events: all;

            @include media-breakpoint-down(tablet) {
                width: 80%;
            }

            i{
                position: absolute;
                top: 1rem;
                right: 1rem;
                width: 60px;
                height: 60px;
                cursor: pointer;
                color: map-get($colors, grays);
                transform-origin: (50% 50%);
                transition: transform .3s;

                &:hover{
                    transform: scale(1.1);
                }

                span{
                    &:first-child{
                        box-sizing: border-box;

                        position: absolute;
                        left: 25%;
                        right: 25%;
                        top: 25%;
                        bottom: 25%;
                        border-top: 2px solid #222222;
                        transform: rotate(45deg);
                    }
                    &:last-child{
                        box-sizing: border-box;

                        position: absolute;
                        left: 57%;
                        right: -7%;
                        top: 25%;
                        bottom: 25%;
                        border-top: 2px solid #222222;
                        transform: rotate(-45deg);
                    }
                }
            }

            img{
                width: 5rem;
                height: 5rem;
            }

            h4 {
                font-size: 40px;
                font-weight: 800;
                color: map-get($colors, grays);
                text-align: center;

                @include media-breakpoint-down(tablet) {
                    font-size: 32px;
                    line-height: 2;
                }
            }

            p {
                font-size: 20px;
                font-weight: 500;
                color: map-get($colors, grays);
                opacity: .5;
                text-align: center;
                padding: 0 0 1rem;

                @include media-breakpoint-down(tablet) {
                    font-size: 16px;
                }
            }

            &-btn{
                padding: .2rem 3rem;
                cursor: pointer;

                @include media-breakpoint-down(tablet) {
                    padding: .2rem 2rem;
                }
            }
        }
    }
</style>
