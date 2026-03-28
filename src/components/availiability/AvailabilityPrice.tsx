import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const AvailabilityPrice = ({
    price,
    setPrice,
}: {
    price: string;
    setPrice: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t('availability_price.label')}</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.currency}>€</Text>
                <TextInput
                    style={styles.input}
                    placeholder="25"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
                <Text style={styles.unit}>{t('availability_price.unit')}</Text>
            </View>
        </View>
    );
};

export default AvailabilityPrice;
const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputWrapper: {
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(245, 245, 245, 0.07)',
        backgroundColor: '#1D1D1D',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },
    currency: {
        color: '#FBBF24',
        fontSize: 16,
        marginRight: 6,
        fontWeight: '600',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    unit: {
        color: '#F5F5F5',
        opacity: 0.6,
        fontSize: 14,
    },
});
