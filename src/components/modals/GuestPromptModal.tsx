import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { X, LogIn, UserPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';

type GuestPromptModalProps = {
    visible: boolean;
    onClose: () => void;
    // Contextual message — caller describes what requires login
    message?: string;
};

const GuestPromptModal = ({
    visible,
    onClose,
    message = 'Sign in to continue',
}: GuestPromptModalProps) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogin = () => {
        onClose();
        navigation.navigate('Login');
    };

    const handleSignup = () => {
        onClose();
        navigation.navigate('signup');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={overlayStyle}
                activeOpacity={1}
                onPress={onClose}
            />
            <View style={sheetStyle}>
                {/* Drag handle */}
                <View style={handleStyle} />

                {/* Close */}
                <TouchableOpacity style={closeStyle} onPress={onClose} activeOpacity={0.7}>
                    <X size={20} color="#6B7280" />
                </TouchableOpacity>

                <Text style={titleStyle}>Sign in required</Text>
                <Text style={subtitleStyle}>{message}</Text>

                <TouchableOpacity style={primaryBtnStyle} onPress={handleLogin} activeOpacity={0.8}>
                    <LogIn size={18} color="#111111" />
                    <Text style={primaryBtnTextStyle}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={secondaryBtnStyle} onPress={handleSignup} activeOpacity={0.8}>
                    <UserPlus size={18} color="#FFD900" />
                    <Text style={secondaryBtnTextStyle}>Create account</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

// Inline styles — no StyleSheet needed for a single-use modal
const overlayStyle = {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
};

const sheetStyle = {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: '6%' as any,
    paddingBottom: '10%' as any,
    paddingTop: '4%' as any,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
};

const handleStyle = {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#374151',
    marginBottom: 16,
};

const closeStyle = {
    position: 'absolute' as const,
    top: 16,
    right: 20,
};

const titleStyle = {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'InterDisplayBold',
    marginBottom: 8,
    textAlign: 'center' as const,
};

const subtitleStyle = {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'InterDisplayRegular',
    textAlign: 'center' as const,
    marginBottom: 32,
    paddingHorizontal: '5%' as any,
};

const primaryBtnStyle = {
    backgroundColor: '#FFD900',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%' as any,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginBottom: 12,
};

const primaryBtnTextStyle = {
    fontSize: 16,
    color: '#111111',
    fontFamily: 'InterDisplayMedium',
};

const secondaryBtnStyle = {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%' as any,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
};

const secondaryBtnTextStyle = {
    fontSize: 16,
    color: '#FFD900',
    fontFamily: 'InterDisplayMedium',
};

export default GuestPromptModal;