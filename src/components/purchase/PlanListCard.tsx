import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PlanListCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

const PlanListCard: React.FC<PlanListCardProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.planListCard}>
      <View style={styles.planListCardIcon}>
        {icon}
      </View>

      <View>
        <Text style={styles.planListCardTitle}>{title}</Text>
        <Text style={styles.planListCardSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
   planListCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#262216',
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 12,
    },
    planListCardIcon: {
        alignItems:'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        backgroundColor: 'rgba(246, 223, 96, 0.10)',
        borderRadius: 100,
    },
    planListCardTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'InterDisplayBold',
        fontWeight: 700,
    },
    planListCardSubtitle: {
        fontSize: 14,
        color: '#E5E5E5',
        fontFamily: 'InterDisplayRegular',
        fontWeight: 400,
    },  
})
export default PlanListCard;
