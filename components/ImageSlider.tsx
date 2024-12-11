import { TouchableOpacity, View, Image, Dimensions } from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import Carousel from 'react-native-reanimated-carousel';

type ImageModalProps = {
    images: string[];
    setShowImageModal: (show: boolean) => void;
};

const { width, height } = Dimensions.get('window');
export const ImageModal = ({ images, setShowImageModal }: ImageModalProps) => {
    return (
        <View className="justify-center items-center rounded-2xl">
            <TouchableOpacity
                onPress={() => setShowImageModal(false)}
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
                    width: width,
                    height: height * 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Carousel
                    loop
                    width={width}
                    height={width}
                    style={{ backgroundColor: 'gray' }}
                    autoPlay={true}
                    data={images}
                    autoPlayInterval={3000}
                    scrollAnimationDuration={1500}
                    renderItem={({ index }) => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={{ uri: images[index] }}
                                style={{
                                    width: width,
                                    height: width,
                                    objectFit: 'cover',
                                }}
                            />
                        </View>
                    )}
                />
            </View>

        </View>
    );
};

