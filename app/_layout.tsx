// @ts-ignore
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { stopServer, startServer } from "expo-static-server";
import * as FileSystem from "expo-file-system";

import { useColorScheme } from '@/hooks/useColorScheme';
import { Asset, useAssets } from 'expo-asset';
import { AppState } from 'react-native';
import { unzip } from 'react-native-zip-archive';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // http-server 初始化相关
  const [assets, setAssets] = useState<Asset[] | undefined>([]);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  // 调用 `useAssets` 并获取资源
  // const [assetsLoaded, assetsError] = useAssets([require("./../assets/web/a.html")]);
  const [assetsLoaded, assetsError] = useAssets([require("./../assets/web/web.zip")]);
  
  
  useEffect(() => {
    // assetsLoaded 存在时才执行后续的操作
    const setupServer = async () => {
      if (assetsLoaded) {
        const root = (FileSystem.documentDirectory || "") + "expo_static_server_root_files";

        // 使用 Promise.all 等待所有文件复制完成
        /* await Promise.all(assetsLoaded.map(file => {
          const fileName = `${file.name}${file.type ? "." + file.type : ""}`;
          console.log(file.uri);
          const htmlFilePath = file.localUri || '';
          console.log(`${root}/${fileName}`);
          return FileSystem.copyAsync({
            from: htmlFilePath,
            to: `${root}/${fileName}`,
          });
        })); */
        await unzip(assetsLoaded?.[0].localUri as string, root);

        // 文件复制完成后启动服务器
        startServer({
          port: 8089,
          host: "127.0.0.1",
          root: root,
        })
        .then(() => {
          console.log("Static server is running");
          setIsServerRunning(true);
        })
        .catch(console.error);
      }
    };

    if (!isServerRunning) {
      setupServer().catch(console.error);
    }

    const subscription = AppState.addEventListener("change", nextAppState => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [assetsLoaded]);// 依赖于 assetsLoaded 以确保只有加载成功时才执行


  useEffect(() => {
    if (appState === 'background' && isServerRunning) {
      console.log("App is in background, server will continue running.");
    } else if (appState === 'inactive' && isServerRunning) {
      console.log("App is inactive, server will continue running.");
    } else if (appState === 'active' && isServerRunning) {
      console.log("App is active.");
    } else if (appState === 'unknown' && isServerRunning) {
      stopServer()
      .then(() => {
        console.log("The static server is stopped");
        setIsServerRunning(false);
      })
      .catch(console.error);
    }
  }, [appState, isServerRunning]);

  useEffect(() => {
    if (loaded && isServerRunning) {
      SplashScreen.hideAsync();
    }
  }, [loaded,isServerRunning]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
