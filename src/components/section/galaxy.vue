<template>
    <div class="sec-galaxy">
        <figure class="sec-galaxy__bg">
            <img src="@/assets/img/galaxy.jpg" alt="">
        </figure>
        <div class="sec-galaxy__content container">
            <h2 class="sec-galaxy__content-title" data-aos="fade-up">
                Galaxy Frens
            </h2>
            <p class="sec-galaxy__content-description" data-aos="fade-up">
                {{ t('galaxy.description') }}
            </p>
        </div>
    </div>
</template>
<script setup>
    import { useI18n } from "vue-i18n"

    const { locale, t } = useI18n({
        inheritLocale: true,
    })
</script>
<style lang="scss">
    $class-name: sec-galaxy;
    .#{$class-name} {
        @include size(100vw, auto);

        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;

        &__bg {
            @include size(100%);

            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            @include media-breakpoint-down(tablet) {
                justify-content: flex-end;
            }

            img {
                @include size(100%);

                position: absolute;
                object-fit: cover;

                @include media-breakpoint-down(tablet) {
                    @include size(auto, 100%);
                    
                    transform: translateX(50vw);
                }
            }
        }

        &__content {
            display: flex;
            flex-direction: column;
            padding-top: 20vh;
            z-index: 1;

            @include media-breakpoint-down(tablet) {
                padding-top: 10vh;
            }

            &-title {
                @include set-col(8, 12, 0);
                @include typo('heading', 1);

                color: map-get($colors, yellow);
                margin-bottom: 32px;

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);

                    text-align: center;
                }
            }

            &-description {
                @include set-col(8, 12, 0);
                @include typo('body', 1);

                color: map-get($colors, black);
                white-space: pre-line;

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);
                }
            }
        }
    }
</style>