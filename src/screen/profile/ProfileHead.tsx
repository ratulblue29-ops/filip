import { View, Image } from 'react-native'
import React from 'react'
import styles from './viewProfileStyle'

const ProfileHead = () => {
    return (
        <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: 'https://i.imgur.com/6o89S5s.png' }}
                    style={styles.profileImage}
                />
            </View>
        </View>
    )
}

export default ProfileHead