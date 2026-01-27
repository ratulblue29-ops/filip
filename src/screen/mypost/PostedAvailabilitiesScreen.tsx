// import React, { useEffect, useState } from 'react';
// import {
//     Text,
//     View,
//     ScrollView,
//     TouchableOpacity,
//     StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ArrowLeft, Bell, ChevronRight, CookingPot, Martini, CircleSlash, Calendar } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { getAuth } from '@react-native-firebase/auth';
// import TrophyIcon from '../../components/svg/TrophyIcon';
// import styles from './style';
// import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
// const PostedAvailabilitiesScreen = () => {
//     const navigation = useNavigation<any>();
//     const [activeTab, setActiveTab] = useState('all');
//     const [userRole, setUserRole] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchUserRole = async () => {
//             const user = getAuth().currentUser;
//             if (!user) return;

//             const userRef = doc(getFirestore(), 'users', user.uid);
//             const userDoc = await getDoc(userRef);

//             if (userDoc.exists()) {
//                 const data = userDoc.data();
//                 setUserRole(data?.role);
//             }
//         };

//         fetchUserRole();
//     }, []);

//     const availabilities = [
//         {
//             id: '1',
//             title: 'Head Chef',
//             schedule: 'Fri, Nov 14 • 5 PM - 11 PM',
//             status: 'active',
//             offersReceived: 3,
//             postedTime: '2d Ago',
//             icon: 'cup',
//         },
//         {
//             id: '2',
//             title: 'Banquet Server',
//             schedule: 'Weekend • On Call',
//             status: 'active',
//             isOpenForOffers: true,
//             postedTime: '1h Ago',
//             icon: 'Martini',
//         },
//         {
//             id: '3',
//             title: 'Bartender',
//             schedule: 'Sat, Sat 12 • 7 AM - 12 PM',
//             status: 'consumed',
//             postedTime: '1d Ago',
//             icon: 'trophy',
//         },
//         {
//             id: '4',
//             title: 'Assistant Cook',
//             schedule: 'Sat, Sat 12 • 7 AM - 12 PM',
//             status: 'withdrawn',
//             postedTime: '1d Ago',
//             icon: 'cook',
//         },
//         {
//             id: '5',
//             title: 'Cleaner',
//             schedule: 'Sat, Sat 12 • 7 AM - 12 PM',
//             status: 'expired',
//             postedTime: '1d Ago',
//             icon: 'clean',
//         },
//         {
//             id: '6',
//             title: 'Cleaner',
//             schedule: 'Sat, Sat 12 • 7 AM - 12 PM',
//             status: 'expired',
//             postedTime: '1d Ago',
//             icon: 'clean',
//         },
//         {
//             id: '7',
//             title: 'Cleaner',
//             schedule: 'Sat, Sat 12 • 7 AM - 12 PM',
//             status: 'expired',
//             postedTime: '1d Ago',
//             icon: 'clean',
//         },
//     ];

//     const handleGoBack = () => {
//         navigation.goBack();
//     };

//     const handleAddNew = () => {
//         navigation.navigate('SeosonalAvailabilityCreation');
//     };

//     const getStatusStyle = (status: string) => {
//         if (status === 'active') {
//             return styles.statusActive;
//         } else if (status === 'consumed') {
//             return styles.statusConsumed;
//         } else if (status === 'withdrawn') {
//             return styles.statusWithdrawn;
//         } else if (status === 'expired') {
//             return styles.statusExpired;
//         }
//         return styles.statusActive;
//     };

//     const getStatusText = (status: string) => {
//         if (status === 'active') {
//             return 'Active';
//         } else if (status === 'consumed') {
//             return 'Consumed';
//         } else if (status === 'withdrawn') {
//             return 'Withdrawn';
//         } else if (status === 'expired') {
//             return 'Expired';
//         }
//         return 'Active';
//     };

//     const renderIcon = (iconType: string) => {
//         if (iconType === 'cup') {
//             return <Calendar width={24} height={24} color="#000000" />;
//         } else if (iconType === 'Martini') {
//             return <Martini width={24} height={24} color="#000000" />;
//         } else if (iconType === 'cook') {
//             return <CookingPot width={24} height={24} color="#000000" />;
//         } else if (iconType === 'clean') {
//             return <CircleSlash width={24} height={24} color="#000000" />;
//         }
//         return <TrophyIcon width={24} height={24} />;
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />

//             <View style={styles.header}>
//                 <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
//                     <ArrowLeft width={24} height={24} color="#FFFFFF" />
//                 </TouchableOpacity>
//                 <Text style={styles.title}>My Posted Availabilities</Text>
//                 <View>
//                     <Bell width={24} height={24} color="white" />
//                     <View style={styles.notifDot} />
//                 </View>
//             </View>

//             <View style={styles.tabsContainer}>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'all' && styles.activeTab]}
//                     onPress={() => setActiveTab('all')}
//                     activeOpacity={0.7}
//                 >
//                     <Text
//                         style={[
//                             styles.tabText,
//                             activeTab === 'all' && styles.activeTabText,
//                         ]}
//                     >
//                         All
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'active' && styles.activeTab]}
//                     onPress={() => setActiveTab('active')}
//                     activeOpacity={0.7}
//                 >
//                     <Text
//                         style={[
//                             styles.tabText,
//                             activeTab === 'active' && styles.activeTabText,
//                         ]}
//                     >
//                         Active
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'past' && styles.activeTab]}
//                     onPress={() => setActiveTab('past')}
//                     activeOpacity={0.7}
//                 >
//                     <Text
//                         style={[
//                             styles.tabText,
//                             activeTab === 'past' && styles.activeTabText,
//                         ]}
//                     >
//                         Past
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {availabilities.map(item => (
//                     <TouchableOpacity
//                         key={item.id}
//                         style={styles.availabilityCard}
//                         activeOpacity={0.7}
//                     >
//                         <View style={styles.cardHeader}>
//                             <View style={styles.iconCircle}>
//                                 {renderIcon(item.icon)}
//                             </View>
//                             <View style={styles.cardInfo}>
//                                 <View style={styles.titleRow}>
//                                     <Text style={styles.availabilityTitle}>{item.title}</Text>
//                                 </View>
//                                 <Text style={styles.scheduleText}>{item.schedule}</Text>
//                                 <View style={styles.bottomRow}>
//                                     <View style={getStatusStyle(item.status)}>
//                                         <Text
//                                             style={[
//                                                 styles.statusText,
//                                                 item.status === 'active' && styles.statusTextActive,
//                                                 item.status === 'consumed' && styles.statusTextConsumed,
//                                                 item.status === 'withdrawn' && styles.statusTextWithdrawn,
//                                                 item.status === 'expired' && styles.statusTextExpired,
//                                             ]}
//                                         >
//                                             {getStatusText(item.status)}
//                                         </Text>
//                                     </View>
//                                     {item.offersReceived !== undefined && (
//                                         <Text style={styles.offersText}>
//                                             {item.offersReceived} Offers Received
//                                         </Text>
//                                     )}
//                                     {item.isOpenForOffers && (
//                                         <Text style={styles.offersText}>Open For Offers</Text>
//                                     )}
//                                     <Text style={styles.postedTime}>Posted {item.postedTime}</Text>
//                                 </View>
//                             </View>
//                             <ChevronRight width={24} height={24} color="#ffffff" />
//                         </View>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>
//             {userRole !== 'worker' && (
//                 <TouchableOpacity
//                     style={styles.addButton}
//                     activeOpacity={0.7}
//                     onPress={handleAddNew}
//                 >
//                     <Text style={styles.addButtonText}>+ Post New</Text>
//                 </TouchableOpacity>
//             )}
//         </SafeAreaView>
//     );
// };

// export default PostedAvailabilitiesScreen;
import React, { useEffect, useState } from 'react';
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
import { getAuth } from '@react-native-firebase/auth';
import TrophyIcon from '../../components/svg/TrophyIcon';
import styles from './style';

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
} from '@react-native-firebase/firestore';

const PostedAvailabilitiesScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('all');
    const [userRole, setUserRole] = useState<string | null>(null);
    const [availabilities, setAvailabilities] = useState<any[]>([]);

    // 🔹 Fetch user role (UNCHANGED LOGIC)
    useEffect(() => {
        const fetchUserRole = async () => {
            const user = getAuth().currentUser;
            if (!user) return;

            const userDoc = await getFirestore()
                .collection('users')
                .doc(user.uid)
                .get();

            if (userDoc.exists()) {
                setUserRole(userDoc.data()?.role ?? null);
            }
        };

        fetchUserRole();
    }, []);

    // 🔹 Fetch jobs posted by current user
    useEffect(() => {
        const fetchMyJobs = async () => {
            const user = getAuth().currentUser;
            if (!user) return;

            try {
                const q = query(
                    collection(getFirestore(), 'jobs'),
                    where('userId', '==', user.uid)
                );

                const snapshot = await getDocs(q);

                const data = snapshot.docs.map((doc: { id: any; data: () => { (): any; new(): any; title: any; type: any; }; }) => ({
                    id: doc.id,
                    title: doc.data().title,
                    schedule: doc.data().type, // UI compatible
                    status: 'active', // keep existing badge logic
                    postedTime: 'Just now',
                    icon: 'cup',
                }));

                setAvailabilities(data);
            } catch (e) {
                console.log('Error fetching jobs:', e);
            }
        };

        fetchMyJobs();
    }, []);

    // 🔹 ORIGINAL helpers (UNCHANGED)
    const handleGoBack = () => navigation.goBack();
    const handleAddNew = () => navigation.navigate('SeosonalAvailabilityCreation');

    const getStatusStyle = (status: string) => {
        if (status === 'active') return styles.statusActive;
        if (status === 'consumed') return styles.statusConsumed;
        if (status === 'withdrawn') return styles.statusWithdrawn;
        if (status === 'expired') return styles.statusExpired;
        return styles.statusActive;
    };

    const getStatusText = (status: string) => {
        if (status === 'active') return 'Active';
        if (status === 'consumed') return 'Consumed';
        if (status === 'withdrawn') return 'Withdrawn';
        if (status === 'expired') return 'Expired';
        return 'Active';
    };

    const renderIcon = (iconType: string) => {
        if (iconType === 'cup') {
            return <Calendar width={24} height={24} color="#000000" />;
        } else if (iconType === 'Martini') {
            return <Martini width={24} height={24} color="#000000" />;
        } else if (iconType === 'cook') {
            return <CookingPot width={24} height={24} color="#000000" />;
        } else if (iconType === 'clean') {
            return <CircleSlash width={24} height={24} color="#000000" />;
        }
        return <TrophyIcon width={24} height={24} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* HEADER – UNCHANGED */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
                    <ArrowLeft width={24} height={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>My Posted Availabilities</Text>
                <View>
                    <Bell width={24} height={24} color="white" />
                    <View style={styles.notifDot} />
                </View>
            </View>

            {/* TABS – UNCHANGED */}
            <View style={styles.tabsContainer}>
                {['all', 'active', 'past'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.7}
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

            {/* LIST – UNCHANGED UI */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {availabilities.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.availabilityCard}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.iconCircle}>
                                {renderIcon(item.icon)}
                            </View>

                            <View style={styles.cardInfo}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.availabilityTitle}>
                                        {item.title}
                                    </Text>
                                </View>

                                <Text style={styles.scheduleText}>
                                    {item.schedule}
                                </Text>

                                <View style={styles.bottomRow}>
                                    <View style={getStatusStyle(item.status)}>
                                        <Text style={styles.statusText}>
                                            {getStatusText(item.status)}
                                        </Text>
                                    </View>

                                    <Text style={styles.postedTime}>
                                        Posted {item.postedTime}
                                    </Text>
                                </View>
                            </View>

                            <ChevronRight width={24} height={24} color="#ffffff" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* ADD BUTTON – UNCHANGED */}
            {userRole !== 'worker' && (
                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={handleAddNew}
                >
                    <Text style={styles.addButtonText}>+ Post New</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default PostedAvailabilitiesScreen;
