// /src/components/VideoPlayer.tsx
import React, {
  useState,
  useRef
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform
} from 'react-native';
import Video, {
  VideoRef
} from 'react-native-video';
import {
  AlertCircle
} from 'lucide-react-native';

interface VideoPlayerProps {
  streamUrl: string;
  channelName: string;
  autoPlay?: boolean;
  muted?: boolean;
}

const isTV = Platform.isTV;

const VideoPlayer: React.FC < VideoPlayerProps > = ({
  streamUrl,
  channelName,
  autoPlay = true,
  muted = false,
}) => {
  const videoRef = useRef < VideoRef > (null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState < string | null > (null);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleReadyForDisplay = () => {
    setIsLoading(false);
  };

  const handleError = (e: any) => {
    console.error('Video Error:', e);
    setError('Failed to load the stream. Please try again.');
    setIsLoading(false);
  };

  // ExoPlayer (Android) buffer config
  const bufferConfig = {
    minBufferMs: 15000,
    maxBufferMs: 60000,
    bufferForPlaybackMs: 2500,
    bufferForPlaybackAfterRebufferMs: 5000,
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: streamUrl
        }}
        style={styles.video}
        controls={true} // Use native controls (works on TV D-pad)
        autoplay={autoPlay}
        muted={muted}
        onLoadStart={handleLoadStart}
        onReadyForDisplay={handleReadyForDisplay}
        onError={handleError}
        bufferConfig={bufferConfig}
        resizeMode="contain"
        poster="https_via.placeholder.com/1280x720.png?text=Loading+Stream..."
        posterResizeMode="cover"
        allowsExternalPlayback={true}
        playInBackground={false}
      />

      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.overlayText}>Loading {channelName}...</Text>
        </View>
      )}

      {error && (
        <View style={[styles.overlay, {
          backgroundColor: 'rgba(0,0,0,0.9)'
        }]}>
          <AlertCircle size={48} color="#ef4444" />
          <Text style={[styles.overlayText, {
            color: '#ef4444',
            fontSize: 16,
            marginTop: 10
          }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayText: {
    marginTop: 8,
    color: '#FFF',
    fontSize: 14,
  },
});

export default VideoPlayer;
