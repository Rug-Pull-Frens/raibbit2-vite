<template>
    <div class="sec-team">
        <div class="sec-team__wrapper container">
            <h2 class="sec-team__title" data-aos="fade-up">
                CREATED BY MANY
            </h2>
            <ul class="sec-team__artist">
                <li
                    class="sec-team__artist-item"
                    v-for="(item, key) in team"
                    :key="key"
                    data-aos="fade-up"
                >
                    <a
                        :href="item.link"
                        target="__blank"
                        v-if="item.link"
                    >
                        <figure class="sec-team__artist-item-img">
                            <img
                                :src="item.img"
                            >
                        </figure>
                        <p class="sec-team__artist-item-name">
                            {{ item.name }}
                        </p>
                    </a>
                    <div
                        :href="item.link"
                        target="__blank"
                        v-else
                    >
                        <figure class="sec-team__artist-item-img">
                            <img
                                :src="item.img"
                            >
                        </figure>
                        <p class="sec-team__artist-item-name">
                            {{ item.name }}
                        </p>
                    </div>
                </li>
            </ul>
            <div class="sec-team__social">
                <a class="sec-team__social-icon" href="https://twitter.com/rugpullfrens" target="__blank">
                    <Icon name="twitter"></Icon>
                </a>
                <a class="sec-team__social-icon" href="https://discord.com/invite/rugpullfrens" target="__blank">
                    <Icon name="discord"></Icon>
                </a>
                <a class="sec-team__social-icon" href="https://instagram.com/rpf_nft" target="__blank">
                    <Icon name="instagram"></Icon>
                </a>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { reactive } from "@vue/reactivity";
    import Icon from '../Icon.vue'

    const team = reactive([
        {
            name: 'Artist: Raimochi',
            img: new URL(`../../assets/img/team/Raimochi.png`, import.meta.url).href,
            link: 'https://twitter.com/raimochi__',
        }, {
            name: 'Co-founder: JSTIN',
            img: new URL(`../../assets/img/team/JSTIN.jpg`, import.meta.url).href,
            link: 'https://twitter.com/jstin0502',
        }, {
            name: 'Co-founder: Swi',
            img: new URL(`../../assets/img/team/Swi.png`, import.meta.url).href,
            link: '',
        }, {
            name: 'Community: Javi',
            img: new URL(`../../assets/img/team/Javi.png`, import.meta.url).href,
            link: 'https://twitter.com/Javic_ETH',
        }, {
            name: 'Marketing: Ken',
            img: new URL(`../../assets/img/team/Ken.jpg`, import.meta.url).href,
            link: '',
        }, {
            name: 'Dev: Ryan',
            img: new URL(`../../assets/img/team/Ryan.jpg`, import.meta.url).href,
            link: 'https://twitter.com/ryanycwEth',
        }, {
            name: 'Dev: Mosano',
            img: new URL(`../../assets/img/team/Mosano.png`, import.meta.url).href,
            link: '',
        }, {
            name: 'Community: Hazel',
            img: new URL(`../../assets/img/team/Hazel.png`, import.meta.url).href,
            link: '',
        }, {
            name: 'Designer: Belinda',
            img: new URL(`../../assets/img/team/Belinda.png`, import.meta.url).href,
            link: '',
        }
    ])

    const getImageUrl = (name) => {
        return new URL(`../../assets/${name}`, import.meta.url).href
    }

    const replaceByDefault = (e) => {
      e.target.src = new URL(`../../assets/img/team/default.png`, import.meta.url).href
    }
</script>
<style lang="scss">
    $class-name: sec-team;
    .#{$class-name} {
        @include size(100vw, auto);

        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 10vh 0;
        background-color: map-get($colors, lightyellow);

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

            @include media-breakpoint-down(tablet) {
                @include size(calc(100% - 40px), auto);

                justify-content: space-between;
            }

            &-item {
                @include size(25%, auto);

                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 48px;

                @include media-breakpoint-down(tablet) {
                    @include size(calc(50% - 12px), auto);
                }

                &:hover {
                    .#{$class-name}__artist-item-img {
                        transform: scale(1.1);
                    }
                }

                > a, div {
                    display: flex;
                    flex-direction: column;
                }

                &-img {
                    @include size(100%);

                    margin-bottom: 16px;
                    max-width: 200px;
                    border-radius: 80px;
                    overflow: hidden;
                    transition: transform 0.3s;

                    @include media-breakpoint-down(tablet) {
                        border-radius: 48px
                    }

                    img {
                        @include size(100%);
                    }
                }

                &-name {
                    @include typo('heading', 3);
                    
                    display: flex;
                    justify-content: center;
                    color: map-get($colors, black);
                }
            }
        }

        &__social {
            display: none;

            @include media-breakpoint-down(tablet) {
                @include size(100%, auto);
                
                display: flex !important;
                justify-content: space-evenly;
                
                &-icon {
                    @include size(56px);

                    color: map-get($colors, black);
                    
                    > svg {
                        @include size(100%);
                    }
                }
            }
        }
    }
</style>