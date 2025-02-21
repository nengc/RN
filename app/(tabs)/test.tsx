import { Image, StyleSheet,Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import WebView from 'react-native-webview';

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
          source={require('./../../assets/a.html')}
          style={styles.webview}
          scalesPageToFit={true} // 适应页面大小
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
