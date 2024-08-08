import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jonogon',
  appName: 'Jonogon',
  webDir: 'dist/apps/jonogon',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true,
  },
  ios: {
    contentInset: 'always',
  },
  // server: {
  //   url: 'http://192.168.1.75:4200',
  //   cleartext: true,
  //   // androidScheme: 'http',
  //   // iosScheme: 'http',
  //   // hostname: '192.168.68.102:4200',
  //   // allowNavigation: ['*'],
  // },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      showSpinner: false,
      androidSpinnerStyle: 'horizontal',
      iosSpinnerStyle: 'large',
      spinnerColor: '#81c784',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
  },
};

export default config;
