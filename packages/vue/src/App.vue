<template>
  <div id="root">
    <div :class="cssClasses">
      <component
        :is="$route.meta.layout"
        :title="title"
        :is-x-small="screen.getScreenSizeInfo.isXSmall"
        :is-large="screen.getScreenSizeInfo.isLarge"
      >
      <div class="content">
        <router-view></router-view>
      </div>
        <template #footer>
          <app-footer />
        </template>
      </component>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import AppFooter from "./components/app-footer.vue";
import { sizes, subscribe, unsubscribe } from "./utils/media-query";
import {
  getCurrentInstance,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed
} from "vue";

interface IScreenInfo {
  isXSmall?: boolean;
  isLarge?: boolean;
  cssClasses?: string[];
}

function getScreenSizeInfo(): IScreenInfo {
  const screenSizes = sizes();

  return {
    isXSmall: screenSizes["screen-x-small"],
    isLarge: screenSizes["screen-large"],
    cssClasses: Object.keys(screenSizes).filter(key => screenSizes[key])
  };
}


export default defineComponent({
  components: {
    AppFooter
  },
  setup() {
    const vm = getCurrentInstance();

    const proxy: any = vm?.proxy;
    const title = proxy?.$appInfo.title;
    const screen = reactive<{ getScreenSizeInfo: IScreenInfo }>({ getScreenSizeInfo: { } });
    screen.getScreenSizeInfo = getScreenSizeInfo();
    
    function screenSizeChanged () {
      screen.getScreenSizeInfo = getScreenSizeInfo();
    }

    onMounted(() => {
      subscribe(screenSizeChanged);
    });

    onBeforeUnmount(() => {
      unsubscribe(screenSizeChanged);
    });

    const cssClasses = computed(() => {
      return ["app"].concat(screen.getScreenSizeInfo.cssClasses ?? []);
    });

    return {
      title,
      screen,
      cssClasses
    };
  }
});
</script>

<style lang="scss">
@use "./variables" as *;
html,
body {
  margin: 0px;
  min-height: 100%;
  height: 100%;
}

#root {
  height: 100%;
}

* {
  box-sizing: border-box;
}

.app {
  background-color: $side-panel-background;
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
