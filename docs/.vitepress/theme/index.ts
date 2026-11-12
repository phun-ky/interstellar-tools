import type { Theme } from 'vitepress';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme-without-fonts';
import { h, onMounted, watchEffect } from 'vue';

import '@fontsource/ibm-plex-sans-condensed/400.css';
import '@fontsource/ibm-plex-sans-condensed/500.css';
import '@fontsource/ibm-plex-sans-condensed/600.css';
import '@fontsource/ibm-plex-sans-condensed/700.css';
// eslint-disable-next-line import-x/no-unresolved
import 'virtual:group-icons.css';
import './custom.css';
import './mission.css';
import './practice.css';

import ApolloAimPlot from './components/apollo/ApolloAimPlot.vue';
import ApolloDvLedger from './components/apollo/ApolloDvLedger.vue';
import ApolloEntryPlot from './components/apollo/ApolloEntryPlot.vue';
import ApolloLatitudePlot from './components/apollo/ApolloLatitudePlot.vue';
import ApolloMissionMap from './components/apollo/ApolloMissionMap.vue';
import ApolloRendezvousPlot from './components/apollo/ApolloRendezvousPlot.vue';
import ApolloSunPlot from './components/apollo/ApolloSunPlot.vue';
import DocPhoto from './components/DocPhoto.vue';
import MissionHome from './components/home/MissionHome.vue';
import ProjectionMap from './components/maps/ProjectionMap.vue';
import MarsClock from './components/mars/MarsClock.vue';
import MarsLandingGrid from './components/mars/MarsLandingGrid.vue';
import SolarDayFigure from './components/mars/SolarDayFigure.vue';
import NavStatus from './components/NavStatus.vue';
import OrbitWidget from './components/OrbitWidget.vue';
import PullQuote from './components/PullQuote.vue';
import HeliosphereSideView from './components/tracking/HeliosphereSideView.vue';
import IssGroundTrack from './components/tracking/IssGroundTrack.vue';
import ProbeDistanceScale from './components/tracking/ProbeDistanceScale.vue';

const GLOBAL_CLASS = 'ph';
const THEME_DARK = 'theme--dark';
const THEME_LIGHT = 'theme--light';

export default {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(NavStatus)
    }),
  enhanceApp(ctx) {
    // Keep the default theme's global components (e.g. <Badge>)
    DefaultTheme.enhanceApp?.(ctx);
    ctx.app.component('MissionHome', MissionHome);
    ctx.app.component('PullQuote', PullQuote);
    ctx.app.component('DocPhoto', DocPhoto);
    ctx.app.component('OrbitWidget', OrbitWidget);
    ctx.app.component('ApolloMissionMap', ApolloMissionMap);
    ctx.app.component('ApolloAimPlot', ApolloAimPlot);
    ctx.app.component('ApolloLatitudePlot', ApolloLatitudePlot);
    ctx.app.component('ApolloDvLedger', ApolloDvLedger);
    ctx.app.component('ApolloSunPlot', ApolloSunPlot);
    ctx.app.component('ApolloRendezvousPlot', ApolloRendezvousPlot);
    ctx.app.component('ApolloEntryPlot', ApolloEntryPlot);
    ctx.app.component('ProjectionMap', ProjectionMap);
    ctx.app.component('MarsClock', MarsClock);
    ctx.app.component('MarsLandingGrid', MarsLandingGrid);
    ctx.app.component('SolarDayFigure', SolarDayFigure);
    ctx.app.component('IssGroundTrack', IssGroundTrack);
    ctx.app.component('HeliosphereSideView', HeliosphereSideView);
    ctx.app.component('ProbeDistanceScale', ProbeDistanceScale);

    if (typeof window !== 'undefined') {
      document.documentElement.classList.add(GLOBAL_CLASS);
    }
  },

  setup() {
    const { isDark } = useData();

    onMounted(() => {
      const root = document.documentElement;

      watchEffect(() => {
        root.classList.toggle(THEME_DARK, isDark.value);
        root.classList.toggle(THEME_LIGHT, !isDark.value);
      });
    });
  }
} satisfies Theme;
