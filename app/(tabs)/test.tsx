import { Image, Platform, StyleSheet,Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import WebView from 'react-native-webview';
import { readAsStringAsync } from "expo-file-system";
import { useAssets,Asset } from "expo-asset";

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


  const { localUri } = Asset.fromModule(require('./../../assets/web/a.html'));
  /* On the webView */
  let source1 = {} as any;
  if (localUri) {
    let os = Platform.OS.toString();
    if (os === 'android') {
      source1 = {
        uri: localUri.includes('ExponentAsset')
          ? localUri
          : 'file:///android_asset/' + localUri.substring(9),
      }
    }else{
      source1 = require('./../../assets/web/a.html')
    }
  }


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
        <WebView
          originWhitelist={['*']}
          // source={require('./../../assets/a.html')}
          // source={{ html }}
          source={source1}
          style={styles.webview}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          scalesPageToFit={true} // 适应页面大小
          onLoad={() => {}}
          onMessage={(event) => {}}
        />
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
