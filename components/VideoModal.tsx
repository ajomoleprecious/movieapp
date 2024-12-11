import { useCallback, useRef, useState } from "react";
import { TouchableOpacity, View, Text, Dimensions } from "react-native";
import { BackwardIcon, ForwardIcon, XMarkIcon, PlayIcon, PauseIcon } from "react-native-heroicons/solid";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import LoadingSpinner from "./Loading";

type VideoModalProps = {
    videoId: string | undefined;
    setShowVideoModal: (show: boolean) => void;
};

const { width, height } = Dimensions.get('window');
export const VideoModal = ({ videoId, setShowVideoModal }: VideoModalProps) => {
    const [playing, setPlaying] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const playerRef = useRef<YoutubeIframeRef>(null);


    const onStateChange = useCallback((state: string) => {
        if (state === "ended") {
            setPlaying(false);
        } else if (state === "playing") {
            setPlaying(true);
        } else if (state === "paused") {
            setPlaying(false);
        }
    }, []);

    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    const rewind10seconds = async () => {
        playerRef.current?.seekTo(await playerRef.current.getCurrentTime() - 10, true);
    }

    const forward10seconds = async () => {
        playerRef.current?.seekTo(await playerRef.current.getCurrentTime() + 10, true);
    }

    return (
        <View className="justify-center items-center rounded-2xl">
            <TouchableOpacity
                onPress={() => setShowVideoModal(false)}
                style={{
                    position: 'absolute',
                    top: 1,
                    right: 2,
                    backgroundColor: '#eab308',
                    borderRadius: 20,
                    padding: 8,
                }}
                accessibilityLabel="Close video"
            >
                <XMarkIcon size={25} width={50} color="black" />
            </TouchableOpacity>

            <View
                style={{
                    marginTop: 50,
                    paddingTop: 60,
                    borderRadius: 12,
                    width: width * 0.91,
                    height: height * 0.25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <YoutubePlayer
                    ref={playerRef}
                    height={height * 0.30}
                    width={width * 0.90}
                    play={playing}
                    videoId={videoId}
                    onChangeState={onStateChange}
                    onReady={() => setVideoReady(true)}
                    initialPlayerParams={{
                        controls: true,
                        showClosedCaptions: true,
                        loop: true,
                    }}
                />
                {!videoReady && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <LoadingSpinner />
                    </View>
                )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                <TouchableOpacity
                    onPress={rewind10seconds}
                    style={{
                        marginTop: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        backgroundColor: "#eab308",
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                    accessibilityLabel="Rewind 10 seconds"
                >
                    <BackwardIcon size={25} color="black" />
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold' }}>
                        10-sec
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={togglePlaying}
                    style={{
                        marginTop: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        backgroundColor: "#eab308",
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                    }}
                    accessibilityLabel={playing ? "Pause video" : "Play video"}
                >
                    {playing ? <PauseIcon size={25} color="black" /> : <PlayIcon size={25} color="black" />}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={forward10seconds}
                    style={{
                        marginTop: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        backgroundColor: "#eab308",
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                    accessibilityLabel="Forward 10 seconds"
                >
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold' }}>
                        10-sec
                    </Text>
                    <ForwardIcon size={25} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

