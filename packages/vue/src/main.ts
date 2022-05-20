import 'devextreme/scss/bundles/dx.material.blue.light.scss';
import './dx-styles.scss';
import { createApp }  from "vue";
import router from "./router";

import App from "./App.vue";
import appInfo from "./app-info";

const app = createApp(App);
app.use(router);
app.config.globalProperties.$appInfo = appInfo;
app.mount('#app');
