import { AppState, Image, Platform, StyleSheet,Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { readAsStringAsync } from "expo-file-system";
import { useAssets,Asset } from "expo-asset";

import * as FileSystem from "expo-file-system";
import { stopServer, startServer } from "expo-static-server";
import { File, Paths } from 'expo-file-system/next';


interface MyComponentProps {
  style?: {}; // 使用问号表示 style 是可选的
  value?: any;
  height?: number;
}
const MyComponent: React.FC<MyComponentProps> = ({ style,value,height }) => {
  // return (
  //   <Text style={style}>
  //     {value}
  //   </Text>
  // );
  return (
    <View style={{paddingTop:10, alignItems: 'center', justifyContent: 'center', height:height, backgroundColor: 'white',}}>
     <Text style={style}>
       {value}
     </Text>
    </View>
  );
};

export default function TestScreen() {

  // const [index, indexLoadingError] = useAssets(
  //   require("./../../assets/web/a.html")
  // );

  // const [html, setHtml] = useState("");

  // if (index) {
  //   readAsStringAsync(index[0].localUri as any).then((data) => {
  //       setHtml(data);
  //   });
  // }


    console.log(Platform.OS);
    console.log(Platform.Version);

    // const [assets] = useAssets([require("./../../assets/web/a.html")]);
    // const htmlAsset = assets?.[0];

    const [assets, setAssets] = useState<Asset[] | undefined>([]);
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);

    // 调用 `useAssets` 并获取资源
    const [assetsLoaded, assetsError] = useAssets([require("./../../assets/web/a.html")]);
  
  
    useEffect(() => {
      // assetsLoaded 存在时才执行后续的操作
      const setupServer = async () => {
        if (assetsLoaded) {
          const root = (FileSystem.documentDirectory || "") + "expo_static_server_root_files";
  
          // 使用 Promise.all 等待所有文件复制完成
          await Promise.all(assetsLoaded.map(file => {
            const fileName = `${file.name}${file.type ? "." + file.type : ""}`;
            console.log(file.uri);
            const htmlFilePath = file.localUri || '';
            console.log(`${root}/${fileName}`);
            return FileSystem.copyAsync({
              from: htmlFilePath,
              to: `${root}/${fileName}`,
            });
          }));
  
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

      console.log(111);
      console.log(assets);

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


  return (
    // <ParallaxScrollView
    //   headerHeight={0}
    //   headerStyle={{height: 0, overflow: 'hidden'}}
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <MyComponent/>
    //   }>
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Welcome!</ThemedText>
    //     <HelloWave />
    //   </ThemedView>
      
    // </ParallaxScrollView>
    
    <View style={styles.container}>
        <MyComponent height={0}  style={{height:0,color:'red'}} value={'abc'}/>
        {/* <WebView
          originWhitelist={['*']}
          source={require('./../../assets/a.html')}
          source={{ html }}
          source={
            htmlAsset?.localUri
              ? {
                uri:
                  Platform.OS === "android" ? htmlAsset.localUri : htmlAsset.uri,
              }
              : { uri: 'about:blank' }
          }
          style={styles.webview}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          scalesPageToFit={true} // 适应页面大小
          onLoad={() => {}}
          onMessage={(event) => {}}
        /> */}
        {isServerRunning ? (
          <WebView
            originWhitelist={['*']}
            source={{ uri: 'http://127.0.0.1:8089/a.html' }}
            style={styles.webview}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            scalesPageToFit={true}
            onLoad={() => {}}
            onMessage={(event) => {}}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1, // 允许 WebView 填充可用空间
  },
});
