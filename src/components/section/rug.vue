<template>
    <div class="sec-rug">
        <figure class="sec-rug__bg">
            <img src="@/assets/img/rug.jpg" alt="">
        </figure>
        <div class="sec-rug__content container">
            <h2 class="sec-rug__content-title" data-aos="fade-up">
                Rug Pull Frens
            </h2>
            <p class="sec-rug__content-description" data-aos="fade-up">
                {{ t('rug.description') }}
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
    $class-name: sec-rug;
    .#{$class-name} {
        @include size(100vw, auto);

        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        min-height: 100vh;

        @include media-breakpoint-down(tablet) {
            background-color: map-get($colors, orange);
            flex-direction: column-reverse;
        }

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
                @include size(100%, auto);

                position: relative;
                top: auto;
                justify-content: flex-end;
            }

            img {
                @include size(100%);

                position: absolute;
                object-fit: cover;

                @include media-breakpoint-down(tablet) {
                    @include size(230vw, auto);

                    position: relative;
                }
            }
        }

        &__content {
            display: flex;
            flex-direction: column;
            padding-top: 20vh;
            z-index: 1;

            @include media-breakpoint-down(tablet) {
                padding: 10vh 0;
            }

            &-title {
                @include set-col(6, 12, 0);
                @include typo('heading', 1);

                color: map-get($colors, green);
                margin-bottom: 32px;

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);

                    text-align: center;
                }
            }

            &-description {
                @include set-col(6, 12, 0);
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