import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native';

const SkillInput = ({ skillInput, setSkillInput, addSkill }: { skillInput: string, setSkillInput: (text: string) => void, addSkill: () => void }) => {
    const navigation = useNavigation<any>();
    return (
        <>
            <View style={styles.rowBetween}>
                <Text style={[styles.label, styles.skillLabel]}>Skills & Expertise</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            {/* Skill input */}
            <View style={styles.skillInputWrapper}>
                <TextInput
                    style={styles.skillInput}
                    placeholder="Add A Skill (E.G. Barista)"
                    placeholderTextColor="#9CA3AF"
                    value={skillInput}
                    onChangeText={setSkillInput}
                />
                <TouchableOpacity
                    style={styles.plusIcon}
                    onPress={addSkill}
                    onPressIn={() => navigation.navigate('role')}
                >
                    <Plus size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </>
    )
}
export default SkillInput;


export const styles = StyleSheet.create({
    skillLabel: {
        marginTop: 0,
    },
    label: {
        color: '#fff',
        marginTop: 32,
        marginBottom: 8,
        fontSize: 14,
        fontFamily: 'InterDisplay-Medium',
        fontWeight: 500,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },

    viewAll: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'InterDisplay-Thin',
        fontWeight: 300,
    },

    skillInputWrapper: {
        position: 'relative',
        width: '100%',
        marginTop: 8,
    },

    skillInput: {
        height: 52,
        backgroundColor: '#1D1D1D',
        borderRadius: 12,
        paddingLeft: 14,
        paddingRight: 48,
        color: '#9CA3AF',
        fontSize: 14,
    },

    plusIcon: {
        position: 'absolute',
        right: 14,
        top: '50%',
        transform: [{ translateY: -12 }],
    },

    skillWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },

    skillChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1D1D1D',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        margin: 4,
    },

    skillText: {
        color: '#9CA3AF',
        marginRight: 6,
        fontSize: 14,
        fontFamily: 'InterDisplay-Medium',
        fontWeight: 500,
    },
})