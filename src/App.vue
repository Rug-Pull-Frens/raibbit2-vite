<template>
    <Header/>
    <Loading
        :progress="loadingProgress"
    />
    <main data-scroll-container>
        <Hero
            id="hero"
            :loading="isLoading"
        ></Hero>
        <Card id="card"></Card>
    </main>
    <!-- <DevColumn/> -->
</template>
<script setup>
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
    import Header from './components/header/index.vue'
    import DevColumn from './components/DevColumn.vue'
    import Loading from './components/Loading.vue'

    import Hero from './components/section/hero.vue'
    import Card from './components/section/card.vue'

    
    import { onMounted, reactive, ref, watch, inject } from '@vue/runtime-core'
    import { createApp, provide } from 'vue'
    import LocomotiveScroll from 'locomotive-scroll'
    import ImagesLoaded from 'imagesloaded'
    import viewport from '@/compositions/viewport'

    const app = createApp()
    viewport()

    let isLoading = ref(true)
    const loadingProgress = ref(0)

    const loadImage = () => {
        return new Promise((resolve) => {
            new ImagesLoaded('#app', (instance) => {
                resolve(instance)
            }).on('progress', (instance, image) => {
                loadingProgress.value = instance.progressedCount / instance.images.length
            })
        })
    }

    watch(() => isLoading.value, (value) => {
        if (!value) {
            document.body.classList.add('loaded')
            setTimeout(() => {
                window.$scroll.update()
            }, 1);
        }
    })

    onMounted(() => {
        loadImage().then(() => {
            isLoading.value = false
        })
        window.$scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            getDirection: true,
            getSpeed: true,
            smartphone: {
                smooth: false,
                getDirection: true,
                getSpeed: true,
                multiplier: 2,
            },
            tablet: {
                smooth: false,
                getDirection: true,
                getSpeed: true,
            }
        })
        if (window.innerWidth > 768) {
            let observer = new IntersectionObserver( (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate')
                    } else {
                        entry.target.classList.remove('aos-animate')
                    }
                })
            })
            document.querySelectorAll('[data-aos]').forEach(aosElem => { observer.observe(aosElem) })
        }
    })
</script>
<style lang="scss">
    .-animation-text {
        overflow: hidden;

        span, svg {
            display: block;
            transform: translate3d(0, 100%, 0);
            transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
        }
    }
    header {
        opacity: 0;
        transform: translate3d(0, -2rem, 0);
        transition: all 1s .3s cubic-bezier(0.76, 0, 0.24, 1);
    }
    body.loaded {
        .-animation-text {
            span, svg {
                transform: translate3d(0, 0, 0);
            }
            
            &:nth-child(2){
                transition-delay: .1s;
            }
        }
    }
</style>
