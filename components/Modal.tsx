import { KeyboardAvoidingView, Modal, ModalProps, Platform, View } from "react-native";

type VideoModalProps = ModalProps & {
    isOpen: boolean;
    withInput?: boolean;
}

export const ModalComp = ({ isOpen, withInput, children, ...rest }: VideoModalProps) => {

    const content = withInput ? (
        <KeyboardAvoidingView
            className="items-center justify-center flex-1 px-3 bg-zinc-900/40"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        <View className="items-center justify-center flex-1 px-3 bg-zinc-900/40">
            {children}
        </View>
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
            statusBarTranslucent={true}
            {...rest}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,1)' }}>
                {content}
            </View>
        </Modal>
    );
};