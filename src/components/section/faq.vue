<template>
    <div class="sec-faq">
        <div class="sec-faq__wrapper container">
            <h2 class="sec-faq__wrapper-title" data-aos="fade-up">
                Frequently Asked Questions
            </h2>
            <ul class="sec-faq__list">
                <li
                    v-for="(item, key) in 8"
                    :key="key"
                    :class="{ '-active': key === id }"
                    @click="click(key)"
                >
                    <div class="sec-faq__list-question">
                        <Icon class="sec-faq__list-question-icon" name="triangle"></Icon>
                        <h3>
                            {{ t('faq[' + key + '].question') }}
                        </h3>
                    </div>
                    <p
                        class="sec-faq__list-anser"
                        :style="key === id ? 'max-height:' + anserHeight[key] + 'px' : 'max-height: 0px'"
                        :ref="el => {anserRef[key] = el}"
                    >
                        {{ t('faq[' + key + '].anser') }}
                    </p>
                </li>
            </ul>
            <div class="sec-faq__logo container" data-aos="fade-up">
                <img src="@/assets/logo.png" alt="">
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, reactive } from '@vue/reactivity'
    import { onMounted, nextTick } from '@vue/runtime-core';
    import Icon from '../Icon.vue'
    import { useI18n } from "vue-i18n"

    const { locale, t } = useI18n({
        inheritLocale: true,
    })

    const id = ref(0)
    const anserRef = reactive([])
    const anserHeight = reactive([])

    const click = (key) => {
        if (key === id.value) {
            id.value = null
        } else {
            id.value = key
        }
        setTimeout(() => {
            window.$scroll.update()
        }, 301) //timeout for animation
    }

    onMounted(() => {
        nextTick(() => {
            anserRef.forEach((item, key) => {
                anserHeight[key] = item.scrollHeight
            })
        })
    })
</script>
<style lang="scss">
    $class-name: sec-faq;
    .#{$class-name} {
        @include size(100vw, auto);

        display: flex;
        min-height: 100vh;

        &__wrapper {
            @include size(100%);

            position: relative;
            display: flex;
            flex-direction: column;
            padding-top: 184px;
            padding-bottom: 80px;

            @include media-breakpoint-down(tablet) {
                padding: 10vh 0 0;
            }

            &-title {
                @include typo('display', 1);

                margin-bottom: 48px;

                @include media-breakpoint-down(tablet) {
                    @include typo('heading', 1);
                }
            }
        }

        &__list {
            @include set-col(8, 12, 0);

            @include media-breakpoint-down(tablet) {
                @include size(100%, auto);
            }

            li {
                display: flex;
                flex-direction: column;
                margin-bottom: 32px;
                cursor: pointer;

                &.-active {
                    .#{$class-name}__list-question {
                        .#{$class-name}__list-question-icon {
                            transform: rotate(180deg);
                        }
                    }
                }
            }

            &-question {
                @include size(100%);

                display: flex;
                align-items: center;
                margin-bottom: 16px;

                @include media-breakpoint-down(tablet) {
                    margin-bottom: 4px;
                }

                &-icon {
                    @include size(30px, 20px);

                    margin-right: 16px;
                    color: map-get($colors, black);
                    transition: transform 0.3s;
                    flex: 0 0 auto;

                    @include media-breakpoint-down(tablet) {
                        @include size(18px, 12px);

                        display: flex;
                        margin-right: 12px;
                    }
                }

                h3 {
                    @include typo('heading', 2);
                    color: map-get($colors, lightpink);

                    @include media-breakpoint-down(tablet) {
                        font-size: 16px;
                        font-weight: map-get($font-weight, medium);
                        line-height: 20px;
                    }
                }
            }

            &-anser {
                @include typo('body', 1);

                overflow: hidden;
                max-height: 0px;
                transition: max-height 0.3s;
                padding-left: 46px;

                @include media-breakpoint-down(tablet) {
                    padding-left: 30px;
                }
            }
        }

        &__logo {

            position: absolute;
            bottom: 0;
            right: 0;
            padding-bottom: 80px;
            display: flex;
            justify-content: flex-end;
            pointer-events: none;

            @include media-breakpoint-down(tablet) {
                position: relative;
            }

            img {
                @include set-col(2, 12, 0);

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);
                }
            }
        }
    }
</style>