<template>
    <div class="sec-hero container">
        <div class="sec-hero__bg">
            <img
                class="sec-hero__bg-img"
                data-scroll
                data-scroll-speed="1"
                src="@/assets/img/hero_bg.jpg"
                alt=""
            >
            <img class="sec-hero__bg-gif" src="@/assets/img/hero_front.gif" alt="">
        </div>
        <div class="sec-hero__wrapper">
            <h1 class="sec-hero__wrapper-title">
                <div>
                    <p>Dive Into</p>
                </div>
                <div>
                    <p>RAIbbit Hole</p>
                </div>
            </h1>
            <p class="sec-hero__wrapper-description">
                {{ t('hero.description') }}
            </p>
            <a href="" class="sec-hero__wrapper-btn">
                Get Ticket!
            </a>
        </div>
    </div>
</template>
<script setup>
    import { watch } from "@vue/runtime-core"
    import { useI18n } from "vue-i18n"
    import gsap from "gsap"

    const { locale, t } = useI18n({
        inheritLocale: true,
    })

    const props = defineProps({
        loading: {
            type: Boolean,
            default: true,
        },
    })

    watch(() => props.loading, (val) => {
        if (!val) {
            gsap.from(".sec-hero__bg-img", {
                duration: 1,
                delay: 1,
                scale: 1.5,
                ease: "power4.out",
            })
            gsap.from(".sec-hero__bg-gif", {
                duration: 1,
                delay: 1,
                y: '10%',
                ease: "power4.out",
            })
            setTimeout(() => {
                document.querySelector('.sec-hero__wrapper-title').classList.add('-show')
            }, 1000);
        }
    })
</script>
<style lang="scss">
    $class-name: sec-hero;
    .#{$class-name} {
        @include size(100vw, auto);

        display: flex;
        align-items: center;
        color: map-get($colors, black);
        min-height: 100vh;

        @include media-breakpoint-down(tablet) {
            align-items: flex-start;
            justify-content: center;
            padding-top: 192px;
        }

        &__bg {
            @include size(100vw, 100vh);

            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            pointer-events: none;

            @include media-breakpoint-down(tablet) {
                @include size(100vw, 100vh);

                justify-content: flex-end;
                align-items: flex-end;
            }

            &-img {
                @include size(100%);

                position: absolute;
                object-fit: cover;
            }

            &-gif {
                @include size(100%);

                position: relative;
                object-fit: cover;
                z-index: 2;

                @include media-breakpoint-down(tablet) {
                    @include size(auto, 125vw);

                    transform: translateX(13vw);
                }
            }
        }

        &__wrapper {
            @include set-col-offset(1, 12, 1);

            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            z-index: 1;

            @include media-breakpoint-down(tablet) {
                align-items: center;
                margin-left: 0;
            }

            &-title {
                @include typo('display', 1);
                
                display: flex;
                flex-direction: column;

                @include media-breakpoint-down(tablet) {
                    text-align: center;
                }

                &.-show {
                    p {
                        transform: translateY(0);
                    }
                }


                > div {
                    overflow: hidden;

                    &:nth-child(2) {
                        p {
                            transition-delay: .5;
                        }
                    }

                    > p {
                        transform: translateY(100%);
                        transition: transform 2s .3s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                }
            }

            &-description {
                @include typo('heading', 3);

                margin-top: 32px;
                margin-bottom: 40px;
                white-space: pre-line;

                @include media-breakpoint-down(tablet) {
                    text-align: center;
                    margin-top: 16px;
                    margin-bottom: 56px;
                }
            }

            &-btn {
                @include typo('button', 1);

                padding: 8px 32px;
                color: map-get($colors, white);
                background-color: map-get($colors, black);
                border-radius: 50px;

                @include media-breakpoint-down(tablet) {
                    padding: 8px 16px;
                }
            }
        }

    }
</style>