import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../screen/SeosonalAvailabilityCreation/style';
import { X } from 'lucide-react-native';
const AvilabilityLocation = ({ newLocation, setNewLocation, locations, removeLocation, addLocation }: { newLocation: string; setNewLocation: (text: string) => void; locations: string[]; removeLocation: (index: number) => void; addLocation: () => void }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Location</Text>

            <View style={styles.addLocationRow}>
                <TextInput
                    style={[styles.jobText, { flex: 1 }]}
                    placeholder="Add location..."
                    placeholderTextColor="#9CA3AF"
                    value={newLocation}
                    onChangeText={setNewLocation}
                />
                <TouchableOpacity style={styles.addLocationButton} onPress={addLocation} activeOpacity={0.7}>
                    <Text>Add</Text>
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

export default AvilabilityLocation