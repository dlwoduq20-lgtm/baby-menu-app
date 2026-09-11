import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jy.babymenu',
  appName: '오늘 뭐 먹이지',
  webDir: 'public',
  server: {
    url: 'https://baby-menu-app.vercel.app',
    cleartext: false
  },
  android: {
    backgroundColor: '#FFF8F0'
  }
};

export default config;
