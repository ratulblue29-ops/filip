import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import styles from '../../screen/SeosonalAvailabilityCreation/style';
import { X } from 'lucide-react-native';
const AvilabilityLocation = ({ newLocation, setNewLocation, locations, removeLocation, addLocation }:
    { newLocation: string; setNewLocation: (text: string) => void; locations: string[]; removeLocation: (index: number) => void; addLocation: () => void }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Location</Text>

            <View style={[styles.addLocationRow, style.LocationRow]}>
                <TextInput
                    style={[styles.jobText, { flex: 1 }]}
                    placeholder="Add locations"
                    placeholderTextColor="#9CA3AF"
                    value={newLocation}
                    onChangeText={setNewLocation}
                />
                <TouchableOpacity style={styles.addLocationButton} onPress={addLocation} activeOpacity={0.7}>
                    <Text style={style.addLocationText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.locationsContainer}>
                {locations.map((location, index) => (
                    <View key={index} style={styles.locationChip}>
                        <Text style={styles.locationText}>{location}</Text>
                        <TouchableOpacity onPress={() => removeLocation(index)}>
                            <X size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default AvilabilityLocation;

export const style = StyleSheet.create({
    LocationRow: {
        borderWidth: 1,
        borderColor: 'rgba(249, 250, 251, 0.10)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#1D1D1D'
    },
    addLocationText: {
        fontSize: 20,
        color: '#9CA3AF',
    }

})