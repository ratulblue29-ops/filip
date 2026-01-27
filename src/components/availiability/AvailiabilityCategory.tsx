import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../screen/SeosonalAvailabilityCreation/style';
import { X } from 'lucide-react-native';
const AvailiabilityCategory = ({ categoryInput, setCategoryInput, categories, removeCategory, addCategory }: { categoryInput: string, setCategoryInput: (text: string) => void, categories: string[], removeCategory: (index: number) => void, addCategory: () => void }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>

            <View style={styles.addLocationRow}>
                <TextInput
                    style={[styles.jobText, { flex: 1 }]}
                    placeholder="Add category..."
                    placeholderTextColor="#9CA3AF"
                    value={categoryInput}
                    onChangeText={setCategoryInput}
                />
                <TouchableOpacity style={styles.addLocationButton} onPress={addCategory} activeOpacity={0.7}>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.locationsContainer}>
                {categories.map((cat, index) => (
                    <View key={index} style={styles.locationChip}>
                        <Text style={styles.locationText}>{cat}</Text>
                        <TouchableOpacity onPress={() => removeCategory(index)}>
                            <X size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default AvailiabilityCategory