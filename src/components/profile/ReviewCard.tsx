import { View, Text } from 'react-native'
import React from 'react'
import styles from '../../screen/profile/viewProfileStyle';
import { Star } from 'lucide-react-native';
import { ReviewProps } from '../../@types/Review.type';


const ReviewCard = ({ name, role, time, text, rating }: ReviewProps) => (
    <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
            <View style={styles.avatarPlaceholder} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reviewTitle}>{name}</Text>
                <Text style={styles.reviewSubtext}>{role} • {time}</Text>
            </View>
            <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{rating}</Text>
                <Star size={12} color="#FACC15" fill="#FACC15" />
            </View>
        </View>
        <Text style={styles.reviewBody}>"{text}"</Text>
    </View>
);

export default ReviewCard