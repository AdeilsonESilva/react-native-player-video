import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';

const VideoPlayer = () => {
  const [settings, setSettings] = useState({
    rate: 1,
    volume: 1,
    muted: false,
    resizeMode: 'contain',
    duration: 0.0,
    currentTime: 0.0,
    paused: true,
  });
  const [videoUrl, setVideoUrl] = useState();

  useEffect(() => {
    // const VIMEO_ID = '347119375';
    const VIMEO_ID = '253989945';
    fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then(res => res.json())
      .then(res =>
        setVideoUrl(
          res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        ),
      );
  }, []);

  const video = useRef();

  const onLoad = data => {
    setSettings(prev => ({...prev, duration: data.duration}));
  };

  const onProgress = data => {
    setSettings(prev => ({...prev, currentTime: data.currentTime}));
  };

  const onEnd = () => {
    setSettings(prev => ({...prev, paused: true}));
    video.current.seek(0);
  };

  const onAudioBecomingNoisy = () => {
    setSettings(prev => ({...prev, paused: true}));
  };

  const onAudioFocusChanged = event => {
    setSettings(prev => ({...prev, paused: !event.hasAudioFocus}));
  };

  const getCurrentTimePercentage = () => {
    if (settings.currentTime > 0) {
      return parseFloat(settings.currentTime) / parseFloat(settings.duration);
    }
    return 0;
  };

  const renderRateControl = rate => {
    const isSelected = settings.rate === rate;

    return (
      <TouchableOpacity
        onPress={() => {
          setSettings(prev => ({...prev, rate}));
        }}>
        <Text
          style={[
            styles.controlOption,
            {fontWeight: isSelected ? 'bold' : 'normal'},
          ]}>
          {rate}x
        </Text>
      </TouchableOpacity>
    );
  };

  const renderResizeModeControl = resizeMode => {
    const isSelected = settings.resizeMode === resizeMode;

    return (
      <TouchableOpacity
        onPress={() => {
          setSettings(prev => ({...prev, resizeMode}));
        }}>
        <Text
          style={[
            styles.controlOption,
            {fontWeight: isSelected ? 'bold' : 'normal'},
          ]}>
          {resizeMode}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderVolumeControl = volume => {
    const isSelected = settings.volume === volume;

    return (
      <TouchableOpacity
        onPress={() => {
          setSettings(prev => ({...prev, volume}));
        }}>
        <Text
          style={[
            styles.controlOption,
            {fontWeight: isSelected ? 'bold' : 'normal'},
          ]}>
          {volume * 100}%
        </Text>
      </TouchableOpacity>
    );
  };

  const flexCompleted = getCurrentTimePercentage() * 100;
  const flexRemaining = (1 - getCurrentTimePercentage()) * 100;

  if (!videoUrl) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fullScreen}
        onPress={() => setSettings(prev => ({...prev, paused: !prev.paused}))}>
        <Video
          ref={video}
          /* For ExoPlayer */
          // source={{
          //   uri: 'http://www.youtube.com/api/manifest/dash/id/bf5bb2419360daf1/source/youtube?as=fmp4_audio_clear,fmp4_sd_hd_clear&sparams=ip,ipbits,expire,source,id,as&ip=0.0.0.0&ipbits=0&expire=19000000000&signature=51AF5F39AB0CEC3E5497CD9C900EBFEAECCCB5C7.8506521BFC350652163895D4C26DEE124209AA9E&key=ik0',
          //   type: 'mpd',
          // }}
          // source={require('./broadchurch.mp4')}
          // source={{
          //   uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          // }}
          source={{
            uri: videoUrl,
          }}
          style={styles.fullScreen}
          rate={settings.rate}
          paused={settings.paused}
          volume={settings.volume}
          muted={settings.muted}
          resizeMode={settings.resizeMode}
          onLoad={onLoad}
          onProgress={onProgress}
          onEnd={onEnd}
          onAudioBecomingNoisy={onAudioBecomingNoisy}
          onAudioFocusChanged={onAudioFocusChanged}
          repeat={false}
        />
      </TouchableOpacity>

      <View style={styles.controls}>
        <View style={styles.generalControls}>
          <View style={styles.rateControl}>
            {renderRateControl(0.25)}
            {renderRateControl(0.5)}
            {renderRateControl(1.0)}
            {renderRateControl(1.5)}
            {renderRateControl(2.0)}
          </View>

          <View style={styles.volumeControl}>
            {renderVolumeControl(0.5)}
            {renderVolumeControl(1)}
            {renderVolumeControl(1.5)}
          </View>

          <View style={styles.resizeModeControl}>
            {renderResizeModeControl('cover')}
            {renderResizeModeControl('contain')}
            {renderResizeModeControl('stretch')}
          </View>
        </View>

        <View style={styles.trackingControls}>
          <View style={styles.progress}>
            <View
              style={[styles.innerProgressCompleted, {flex: flexCompleted}]}
            />
            <View
              style={[styles.innerProgressRemaining, {flex: flexRemaining}]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
});

export default VideoPlayer;
