import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconClock } from '@tabler/icons-react-native';
import LottieView from 'lottie-react-native';
import { SIZES } from '../../constants/theme';

const CommingZoon = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/Images/comingsoon.json')}
                autoPlay
                loop
                style={styles.lottieStyle} />
            <Text style={styles.subtitle}>
                This feature is under development. Stay tuned for updates!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        color: '#666',
    },
    lottieStyle: {
        height: SIZES.height * 0.25,
        width: SIZES.width
    }
});

export default CommingZoon;
