<template>
    <div class="sec-about">
        <div class="sec-about__wrapper container">
            <div class="sec-about__wrapper-img">
                <img src="@/assets/img/about.png" alt="">
            </div>
            <div class="sec-about__wrapper-content">
                <h2 class="sec-about__title" data-aos="fade-up">
                    RAIbbit Hole
                </h2>
                <div class="sec-about__description" data-aos="fade-up">
                    {{ t('about.description') }}
                </div>
            </div>
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
    $class-name: sec-about;
    .#{$class-name} {
        @include size(100vw, auto);

        display: flex;
        align-items: center;
        background-color: map-get($colors, blue);
        min-height: 100vh;
        
        &__wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;

            @include media-breakpoint-down(tablet) {
                flex-direction: column;
                padding: 10vh 0;
            }

            &-img {
                @include set-col(6, 12, 0);

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);

                    margin-bottom: 32px;
                }

                img {
                    @include size(100%);

                    object-fit: cover;
                }
            }

            &-content {
                @include set-col(6, 12, 0);

                @include media-breakpoint-down(tablet) {
                    @include size(100%, auto);
                }
            }
        }

        &__title {
            @include typo('heading', 1);

            color: map-get($colors, yellow);
            margin-bottom: 24px;
            white-space: pre-line;

            @include media-breakpoint-down(tablet) {
                text-align: center;
            }
        }

        &__description {
            @include typo('body', 1);

            color: map-get($colors, white);
            white-space: pre-line;
        }
    }
</style>