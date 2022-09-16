<template>
    <header
        class="header"
        :class="{'-active': showHeader}"
    >
        <div class="header__wrapper container">
            <img class="header__logo" src="@/assets/logo.png" alt="" @click="scrollTo('hero')">
            <ul
                class="header__menu"
                :class="{'-active': showMenu}"
                @click="toggleMenu"
            >
                <div class="header__menu-close"></div>
                <li @click="scrollTo('about')">
                    About
                </li>
                <li @click="scrollTo('vision')">
                    Vision
                </li>
                <li @click="scrollTo('galaxy')">
                    Galaxy Frens
                </li>
                <li @click="scrollTo('faq')">
                    FAQ
                </li>
                <li @click="scrollTo('team')">
                    Team
                </li>
                <div class="header__menu-social">
                    <a class="header__menu-social-icon" href="https://twitter.com/rugpullfrens" target="__blank">
                        <Icon name="twitter"></Icon>
                    </a>
                    <a class="header__menu-social-icon" href="https://discord.com/invite/rugpullfrens" target="__blank">
                        <Icon name="discord"></Icon>
                    </a>
                    <a class="header__menu-social-icon" href="https://instagram.com/rpf_nft" target="__blank">
                        <Icon name="instagram"></Icon>
                    </a>
                </div>
            </ul>
            <div class="header__nav">
                <div class="header__nav-lang" @click="switchLang">
                    中 / EN
                </div>
                <a class="header__nav-icon" href="https://twitter.com/rugpullfrens" target="__blank">
                    <Icon name="twitter"></Icon>
                </a>
                <a class="header__nav-icon" href="https://discord.com/invite/rugpullfrens" target="__blank">
                    <Icon name="discord"></Icon>
                </a>
                <a class="header__nav-icon" href="https://instagram.com/rpf_nft" target="__blank">
                    <Icon name="instagram"></Icon>
                </a>
                <div class="header__nav-hamburger" @click="toggleMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </header>
</template>
<script setup>
    import Icon from '../Icon.vue'
    import { useI18n } from "vue-i18n"
    import { i18n } from '@/main.js'
    import { nextTick, onMounted, ref } from '@vue/runtime-core'

    const { locale, t } = useI18n({
        inheritLocale: true,
    })

    const showHeader = ref(true)
    const showMenu = ref(false)

    const switchLang = () => {
        if (i18n.global.locale.value === 'en') {
            i18n.global.locale.value = 'zh-TW'
        } else {
            i18n.global.locale.value = 'en'
        }
    }

    const scrollTo = (id) => {
        console.log(window.$scroll)
        window.$scroll.scrollTo('#' + id)
    }

    const toggleMenu = () => {
        showMenu.value = !showMenu.value
    }

    onMounted(() => {
        nextTick(() => {
            // window.$scroll.on('scroll', () => {
            //     if (window.$scroll.scroll.instance.scroll.y > 0) {
            //         showHeader.value = true
            //     } else {
            //         showHeader.value = false
            //     }
            // })
        })
    })

</script>
<style lang="scss">
    $class-name: header;
    .#{$class-name} {
        @include size(100vw, auto);

        top: 24px;
        position: fixed;
        opacity: 0;
        transition: opacity .3s, transform .3s;
        transform: translateY(-100%);
        z-index: 990;

        &.-active {
            opacity: 1;
            transform: translateY(0);
        }

        &__wrapper {
            display: flex;
            align-items: flex-start;
        }

        &__logo {
            @include set-col(1, 12, 0);

            @include media-breakpoint-down(tablet) {
                @include size(120px, auto);
            }
        }

        &__menu {
            @include set-col-offset(0, 12, 2);

            display: flex;
            color: map-get($colors, black);

            @include media-breakpoint-down(tablet) {
                @include size(100vw, auto);

                position: fixed;
                top: -24px;
                left: 0;
                margin-left: 0;
                padding: 64px 20px 20px;
                flex-direction: column;
                align-items: center;
                opacity: 0;
                background-color: map-get($colors, green);
                pointer-events: none;
                transition: opacity .3s;

                &.-active {
                    opacity: 1;
                    pointer-events: auto;
                }

                &-close {
                    @include size(27px);

                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    top: 20px;
                    right: 20px;
                    
                    &::before {
                        @include size(34px, 4px);

                        content: '';
                        position: absolute;
                        background-color: map-get($colors, black);
                        transform: rotate(45deg);
                    }

                    &::after {
                        @include size(34px, 4px);

                        content: '';
                        position: absolute;
                        background-color: map-get($colors, black);
                        transform: rotate(-45deg);
                    }
                }

                &-social {
                    @include size(100%, auto);

                    display: flex !important;
                    justify-content: space-evenly;
                    margin-top: 20px;

                    &-icon {
                        @include size(56px);

                        > svg {
                            @include size(100%);
                        }
                    }
                }
            }

            > li {
                @include typo('heading', 2);

                margin-right: 36px;
                cursor: pointer;

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);

                    border-bottom: 2px solid map-get($colors, black);
                    padding-bottom: 16px;
                    margin-right: 0;
                    margin-bottom: 16px;
                    text-align: center;
                }
            }

            &-social {
                display: none;
            }
        }

        &__nav {
            display: flex;
            margin-left: auto;
            color: map-get($colors, black);

            @include media-breakpoint-down(tablet) {
                align-items: center;
            }

            > * {
                margin-left: 36px;
                cursor: pointer;
            }

            &-lang {
                @include typo('button', 1);
            }

            &-icon {
                @include size(34px, 28px);

                color: map-get($colors, black);

                @include media-breakpoint-down(tablet) {
                    display: none;
                }

                > svg {
                    @include size(100%);
                }
            }

            &-hamburger {
                display: none;

                @include media-breakpoint-down(tablet) {
                    display: flex !important;
                    flex-direction: column;

                    @include media-breakpoint-down(tablet) {
                        display: none;
                    }

                    > span {
                        @include size(34px, 4px);

                        background-color: map-get($colors, black);
                        border-radius: 4px;
                        margin-bottom: 3px;

                        &:last-child {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }
    }
</style>
