import { provide, ref, computed, onBeforeUnmount } from '@vue/runtime-core'
import viewport from '@/plugins/functions/viewport'

export default () => {
    const vp = ref(viewport)

    const viewportInfo = computed(() => vp.value.info)

    onBeforeUnmount(() => {
        vp.value.destroy()
    })

    provide('viewportInfo', viewportInfo)

    return viewportInfo
}
