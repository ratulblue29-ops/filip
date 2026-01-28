
// import React, { useState } from 'react';
// import {
//     Text,
//     View,
//     ScrollView,
//     TouchableOpacity,
//     StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import {
//     ArrowLeft,
//     Bell,
//     ChevronRight,
//     CookingPot,
//     Martini,
//     CircleSlash,
//     Calendar,
// } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useQuery } from '@tanstack/react-query';
// import TrophyIcon from '../../components/svg/TrophyIcon';
// import styles from './style';
// import { fetchMyJobs } from '../../services/jobs';
// import { fetchUserRole } from '../../services/user';
// import { formatSchedule, timeAgo } from '../../helper/timeanddateHelper';


// const PostedAvailabilitiesScreen = () => {
//     const navigation = useNavigation<any>();
//     const [activeTab, setActiveTab] = useState('all');

//     // Queries
//     const { data: availabilities = [], isLoading } = useQuery({
//         queryKey: ['my-jobs'],
//         queryFn: fetchMyJobs,
//     });
//     const { data: userRole } = useQuery({
//         queryKey: ['user-role'],
//         queryFn: fetchUserRole,
//     });

//     const handleGoBack = () => navigation.goBack();
//     const handleAddNew = () => navigation.navigate('SeosonalAvailabilityCreation');

//     const getStatusStyle = (status: string) => {
//         if (status === 'active') return styles.statusActive;
//         if (status === 'consumed') return styles.statusConsumed;
//         if (status === 'withdrawn') return styles.statusWithdrawn;
//         if (status === 'expired') return styles.statusExpired;
//         return styles.statusActive;
//     };

//     const getStatusText = (status: string) => {
//         if (status === 'active') return 'Active';
//         if (status === 'consumed') return 'Consumed';
//         if (status === 'withdrawn') return 'Withdrawn';
//         if (status === 'expired') return 'Expired';
//         return 'Active';
//     };

//     const renderIcon = (iconType: string) => {
//         if (iconType === 'cup') return <Calendar width={24} height={24} />;
//         if (iconType === 'Martini') return <Martini width={24} height={24} />;
//         if (iconType === 'cook') return <CookingPot width={24} height={24} />;
//         if (iconType === 'clean') return <CircleSlash width={24} height={24} />;
//         return <TrophyIcon width={24} height={24} />;
//     };
//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />

//             {/* HEADER */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={handleGoBack}>
//                     <ArrowLeft width={24} height={24} color="#FFFFFF" />
//                 </TouchableOpacity>
//                 <Text style={styles.title}>My Posted Availabilities</Text>
//                 <View>
//                     <Bell width={24} height={24} color="white" />
//                     <View style={styles.notifDot} />
//                 </View>
//             </View>

//             {/* TABS */}
//             <View style={styles.tabsContainer}>
//                 {['all', 'active', 'past'].map(tab => (
//                     <TouchableOpacity
//                         key={tab}
//                         style={[styles.tab, activeTab === tab && styles.activeTab]}
//                         onPress={() => setActiveTab(tab)}
//                     >
//                         <Text
//                             style={[
//                                 styles.tabText,
//                                 activeTab === tab && styles.activeTabText,
//                             ]}
//                         >
//                             {tab.toUpperCase()}
//                         </Text>
//                     </TouchableOpacity>
//                 ))}
//             </View>

//             {/* LIST */}
//             <ScrollView contentContainerStyle={styles.scrollContent}>
//                 {isLoading && <Text style={{ color: '#fff' }}>Loading...</Text>}

//                 {availabilities.map((item: any) => {
//                     return (
//                         <TouchableOpacity key={item.id} style={styles.availabilityCard}>
//                             <View style={styles.cardHeader}>
//                                 <View style={styles.iconCircle}>{renderIcon(item.icon)}</View>

//                                 <View style={styles.cardInfo}>
//                                     <Text style={styles.availabilityTitle}>{item.title}</Text>
//                                     <Text style={styles.scheduleText}>
//                                         {item.schedule?.start && item.schedule?.end
//                                             ? formatSchedule(item.schedule.start, item.schedule.end)
//                                             : 'N/A'}
//                                     </Text>


//                                     <View style={styles.bottomRow}>
//                                         <View style={getStatusStyle(item.status)}>
//                                             <Text style={styles.statusText}>
//                                                 {getStatusText(item.status)}
//                                             </Text>
//                                         </View>

//                                         <Text style={styles.postedTime}>
//                                             Posted {item.createdAt ? timeAgo(item.createdAt) : 'N/A'}
//                                         </Text>

//                                     </View>
//                                 </View>

//                                 <ChevronRight width={24} height={24} color="#ffffff" />
//                             </View>
//                         </TouchableOpacity>
//                     )
//                 })}
//             </ScrollView>

//             {/* ADD BUTTON */}
//             {userRole !== 'worker' && (
//                 <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
//                     <Text style={styles.addButtonText}>+ Post New</Text>
//                 </TouchableOpacity>
//             )}
//         </SafeAreaView>
//     );
// };

// export default PostedAvailabilitiesScreen;
import React, { useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Bell,
    ChevronRight,
    CookingPot,
    Martini,
    CircleSlash,
    Calendar,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import TrophyIcon from '../../components/svg/TrophyIcon';
import styles from './style';
import { fetchMyJobs } from '../../services/jobs';
import { fetchUserRole } from '../../services/user';
import { formatSchedule, timeAgo } from '../../helper/timeanddateHelper';

const PostedAvailabilitiesScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'past'>('all');

    // Queries
    const { data: availabilities = [], isLoading } = useQuery({
        queryKey: ['my-jobs'],
        queryFn: fetchMyJobs,
    });
    const { data: userRole } = useQuery({
        queryKey: ['user-role'],
        queryFn: fetchUserRole,
    });

    const handleGoBack = () => navigation.goBack();
    const handleAddNew = () => navigation.navigate('SeosonalAvailabilityCreation');

    // Status styles
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return styles.statusActive;
            case 'consumed': return styles.statusConsumed;
            case 'withdrawn': return styles.statusWithdrawn;
            case 'expired': return styles.statusExpired;
            default: return styles.statusActive;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Active';
            case 'consumed': return 'Consumed';
            case 'withdrawn': return 'Withdrawn';
            case 'expired': return 'Expired';
            default: return 'Active';
        }
    };

    // Icon renderer
    const renderIcon = (iconType: string) => {
        switch (iconType) {
            case 'cup': return <Calendar width={24} height={24} />;
            case 'Martini': return <Martini width={24} height={24} />;
            case 'cook': return <CookingPot width={24} height={24} />;
            case 'clean': return <CircleSlash width={24} height={24} />;
            default: return <TrophyIcon width={24} height={24} />;
        }
    };

    // Filter availabilities based on activeTab
    const filteredAvailabilities = availabilities.filter((item: any) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return item.status === 'active';
        if (activeTab === 'past') return ['consumed', 'withdrawn', 'expired'].includes(item.status);
        return true;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <ArrowLeft width={24} height={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>My Posted Availabilities</Text>
                <View>
                    <Bell width={24} height={24} color="white" />
                    <View style={styles.notifDot} />
                </View>
            </View>

            {/* TABS */}
            <View style={styles.tabsContainer}>
                {['all', 'active', 'past'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab as 'all' | 'active' | 'past')}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* LIST */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {isLoading && <Text style={{ color: '#fff' }}>Loading...</Text>}

                {filteredAvailabilities.map((item: any) => (
                    <TouchableOpacity key={item.id} style={styles.availabilityCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconCircle}>{renderIcon(item.icon)}</View>

                            <View style={styles.cardInfo}>
                                <Text style={styles.availabilityTitle}>{item.title}</Text>
                                <Text style={styles.scheduleText}>
                                    {item.schedule?.start && item.schedule?.end
                                        ? formatSchedule(item.schedule.start, item.schedule.end)
                                        : 'N/A'}
                                </Text>

                                <View style={styles.bottomRow}>
                                    <View style={getStatusStyle(item.status)}>
                                        <Text style={styles.statusText}>
                                            {getStatusText(item.status)}
                                        </Text>
                                    </View>

                                    <Text style={styles.postedTime}>
                                        Posted {item.createdAt ? timeAgo(item.createdAt) : 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            <ChevronRight width={24} height={24} color="#ffffff" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* ADD BUTTON */}
            {userRole !== 'worker' && (
                <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                    <Text style={styles.addButtonText}>+ Post New</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default PostedAvailabilitiesScreen;
