<template>
    <div class="sec-vision">
        <div class="sec-vision__wrapper container">
            <div
                class="sec-vision__marquee"
                ref="marqueeRef"
            >
                <div
                    class="sec-vision__marquee-group"
                    ref="marqueeGroupRef"
                    v-for="(item, key) in 3"
                    :key="key"
                >
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/1.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/2.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/3.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/4.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/5.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/6.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/7.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/8.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/9.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/10.png" alt="">
                </div>
            </div>
            <div
                class="sec-vision__marquee -mobile"
                ref="marqueeMobileRef"
            >
                <div
                    class="sec-vision__marquee-group"
                    ref="marqueeGroupRef"
                    v-for="(item, key) in 3"
                    :key="key"
                >
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/1.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/2.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/3.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/4.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/5.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/6.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/7.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/8.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/9.png" alt="">
                    <img class="sec-vision__marquee-group-img" src="@/assets/img/marquee/10.png" alt="">
                </div>
            </div>
            <h2 class="sec-vision__wrapper-title" data-aos="fade-up">
                Vision
            </h2>
            <p class="sec-vision__wrapper-description" data-aos="fade-up">
                {{ t('vision.description') }}
            </p>
            <sub data-aos="fade-up">
                {{ t('vision.sub') }}
            </sub>
        </div>
    </div>
</template>
<script setup>
    import { ref } from "@vue/reactivity"
    import { nextTick, onMounted } from "@vue/runtime-core"
    import gsap from "gsap"
    import { useI18n } from "vue-i18n"

    const { locale, t } = useI18n({
        inheritLocale: true,
    })

    const marqueeRef = ref()
    const marqueeMobileRef = ref()
    const marqueeGroupRef = ref()
    let timeline
    let groupWidth

    const init = () => {
        timeline = gsap.timeline()
        
        setTimeline()
    }

    const setTimeline = () => {
        timeline.add(createMarquee(marqueeRef.value), 0)

        if (window.innerWidth < 768) {
            timeline.add(createMarqueeMobile(marqueeMobileRef.value), 0)
        }
    }

    const createMarquee = (element) => {
        const distance = groupWidth
        return gsap.timeline().to(element, {
                duration: 30,
                ease: 'none',
                x: -distance,
                onComplete() {
                    timeline.play(0)
                },
                onReverseComplete() {
                    timeline.reverse(0)
                },
            },
        )
    }

    const createMarqueeMobile = (element) => {
        const distance = groupWidth
        return gsap.timeline().to(element, {
                duration: 30,
                ease: 'none',
                x: distance,
                onComplete() {
                    timeline.play(0)
                },
                onReverseComplete() {
                    timeline.reverse(0)
                },
            },
        )
    }

    
    
    onMounted(() => {
        nextTick(() => {
            groupWidth = marqueeGroupRef.value[0].clientWidth
            init()
            window.$scroll.on("scroll", () => {
                if (window.$scroll.scroll.instance.speed > 1.2) {
                    timeline.timeScale(window.$scroll.scroll.instance.speed / 3.2)
                } else {
                    timeline.timeScale(1)
                }
            })
        })
    })
</script>
<style lang="scss">
    $class-name: sec-vision;
    .#{$class-name} {
        @include size(100vw, auto);

        display: flex;
        justify-content: center;
        align-items: center;
        background-color: map-get($colors, pink);
        min-height: 100vh;

        &__wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;

            @include media-breakpoint-down(tablet) {
                padding: 10vh 0;
            }

            &-title {
                @include typo('heading', 1);

                color: map-get($colors, blue);
                margin-bottom: 32px;
            }

            &-description {
                @include set-col(8, 12, 0);
                @include typo('body', 1);

                margin-bottom: 1rem;
                white-space: pre-line;
                text-align: center;

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);
                }
            }

            sub {
                @include typo('body', 1);

                font-weight: 300;
                font-style: italic;
                white-space: pre-line;
                text-align: center;
            }
        }

        &__marquee {
            display: flex;
            margin-bottom: 64px;

            &.-mobile {
                display: none;

                @include media-breakpoint-down(tablet) {
                    display: flex !important;
                }
            }

            &-group {
                display: flex;

                &-img {
                    @include size(335px);
    
                    margin-right: 48px;

                    @include media-breakpoint-down(tablet) {
                        @include size(167px);
                    }
                }
            }

        }
    }
</style>