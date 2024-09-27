import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// import ReportList from './components/report/ReportList.vue';
import RCCorePlugin from './plugins/RCCore.js';


let options = {
        mode: 'dev',
        host: 'https://localhost:7299'
},
model = [];


const app = createApp(App, { 'initialModel': model });
app.use(RCCorePlugin, options);
app.config.unwrapInjectedRef = true;
app.mount('#app');
