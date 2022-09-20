<template>
    <div class="sec-card">
        <div class="sec-card__wrapper container">
            <ul class="sec-card__artist">
                <li class="sec-card__artist-item"
                    v-for="(item, key) in card.items"
                    :key="key"
                    
                >
                    <figure class="sec-card__artist-item-img">
                        <img
                            :src="item.item_image"
                        >
                    </figure>
                    <div class="sec-card__artist-item-content">
                        <h4 class="sec-card__artist-item-content-name">{{ item.item_name }}</h4>
                        <div class="sec-card__artist-item-content-creator">{{ item.item_creator }}</div>
                        
                        <div class="sec-card__artist-item-content-purchase">
                            <div class="sec-card__artist-item-content-purchase-price header__nav-btn gray">
                                <i class="icon">$</i>
                                <p>{{ item.item_price }}</p>
                                <i>Ξ</i>
                            </div>
                            <div 
                                class="sec-card__artist-item-content-purchase-pur header__nav-btn gray"
                                @click="clickPurchase()"
                            >
                                PURCHASE
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <pop v-if="showPop" @update="closePop()" />
    </div>
</template>
<script setup>
    import axios from 'axios'
    import { ref, reactive } from "@vue/reactivity";
    import Pop from '../pop.vue'

    const card = ref({});
    const showPop = ref(false)

    const url = 'https://wijfssgy0b.execute-api.ap-northeast-1.amazonaws.com/gallery'
    axios.get(url)
        .then(res => {
            console.log(res.data)
            card.value = res.data
            // return {
            //     card
            // }
        })
        .catch(err => {
            console.log(err)
        })

    console.log('card',card)

    const clickPurchase = () => {
        showPop.value = true
    }
    const closePop = () => {
        showPop.value = false
    }

    

</script>
<style lang="scss">
    $class-name: sec-card;
    .#{$class-name} {
        @include size(100vw, auto);

        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 10vh 0;

        @include media-breakpoint-down(tablet) {
            padding: 10vh 0;
            align-items: flex-start;
            min-height: auto;
        }

        &__title {
            @include typo('heading', 1);

            margin-bottom: 72px;
            color: map-get($colors, brown);
        }

        &__wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        &__artist {
            @include set-col(10, 12, 0);

            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            @include media-breakpoint-down(tablet) {
                @include size(calc(100% - 40px), auto);

                justify-content: space-between;
            }

            &-item {
                @include size(30%, auto);

                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 48px;
                border-radius: 24px;
                overflow: hidden;

                @include media-breakpoint-down(desktop) {
                    @include size(calc(50% - 12px), auto);
                }

                @include media-breakpoint-down(tablet) {
                    @include size(calc(100%), auto);
                }

                &:hover {
                    .#{$class-name}__artist-item-img {
                        transform: scale(1.1);
                    }
                }

                > div {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                &-img {
                    @include size(100% ,auto);

                    object-fit: cover;
                    margin-bottom: 16px;
                    max-width: 200px;
                    overflow: hidden;
                    transition: transform 0.3s;

                    @include media-breakpoint-down(tablet) {
                        border-radius: 48px
                    }

                    img {
                        @include size(100%);
                    }
                }

                &-content {
                    width: 100%;
                    padding: 1rem;
                    background-color: map-get($colors, white);

                    &-name {
                        @include typo('heading', 3);
                        
                        color: map-get($colors, grays);
                        font-size: 48px;
                        line-height: 1.1;

                        @include media-breakpoint-down(desktop) {
                            font-size: 32px;
                            font-weight: 800;
                            line-height: 1;
                        }
                    }

                    &-creator{
                        color: map-get($colors, grays);
                        font-weight: 500;
                        opacity: .5;
                        margin: 0 0 0 .2rem;
                        @include media-breakpoint-down(desktop) {
                            font-size: 16px;
                        }
                    }

                    &-purchase {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        margin: .6rem 0 0;

                        &-price {
                            display: flex;
                            align-items: flex-end;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

                            i {
                                font-size: .8rem;
                                line-height: 2;

                                @include media-breakpoint-down(desktop) {
                                        font-size: .6rem;
                                        line-height: 1.8;
                                    }

                                &.icon{
                                    line-height: 2.8;

                                    @include media-breakpoint-down(desktop) {
                                        line-height: 3.2;
                                    }
                                }
                            }

                            p {
                                font-size: 36px;
                                font-weight: 600;
                                padding: 0 .4rem 0 .1rem;
                                line-height: 1.2;

                                @include media-breakpoint-down(desktop) {
                                    font-size: 32px;
                                }
                            }
                        }

                        &-pur{
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

                            @include media-breakpoint-down(desktop) {
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
        }

    }

    /* --------@popup-------- */
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

        .inner {
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
                right: 1.5rem;
                font-size: 1rem;
                cursor: pointer;
                color: map-get($colors, grays);
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
            }

            p {
                font-size: 20px;
                font-weight: 500;
                color: map-get($colors, grays);
                opacity: .5;
                text-align: center;
            }
        }
    }
</style>