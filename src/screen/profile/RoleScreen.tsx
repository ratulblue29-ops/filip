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
  ChevronLeft,
  Check,
  Utensils,
  Martini,
  Users,
  ChefHat,
  Briefcase,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from '../Language/style';
import { updateUserRoles } from '../../services/user';
import Toast from 'react-native-toast-message';
// import { useQuery } from '@tanstack/react-query';
// import { fetchCurrentUser } from '../../services/user';
import { useRoute } from '@react-navigation/native';
import { setPendingSkills } from '../../store/pendingSkillsStore';
import { useTranslation } from 'react-i18next';

type Role = {
  code: string;
  name: string;
  icon: any;
};

const RoleScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const route = useRoute<any>();
  const fromEdit = route.params?.fromEdit ?? false;
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    route.params?.currentSkills ?? [],
  );
  const [searchQuery] = useState('');
  // const { data: currentUser } = useQuery({
  //   queryKey: ['currentUser'],
  //   queryFn: fetchCurrentUser,
  // });

  // React.useEffect(() => {
  //   if (currentUser?.profile?.skills && currentUser.profile.skills.length > 0) {
  //     setSelectedLanguages(currentUser.profile.skills);
  //   }
  // }, [currentUser]);
  const roles: Role[] = [
    { code: 'WAITER', name: t('role_screen.roles.WAITER'), icon: Utensils },
    { code: 'BARTENDER', name: t('role_screen.roles.BARTENDER'), icon: Martini },
    { code: 'BAR_ASSISTANT', name: t('role_screen.roles.BAR_ASSISTANT'), icon: Martini },
    { code: 'HOST', name: t('role_screen.roles.HOST'), icon: Users },
    { code: 'COOK', name: t('role_screen.roles.COOK'), icon: ChefHat },
    { code: 'ASSISTANT_COOK', name: t('role_screen.roles.ASSISTANT_COOK'), icon: ChefHat },
    { code: 'KITCHEN_HELPER', name: t('role_screen.roles.KITCHEN_HELPER'), icon: ChefHat },
    { code: 'MANAGER', name: t('role_screen.roles.MANAGER'), icon: Briefcase },
    { code: 'EMPLOYER', name: t('role_screen.roles.EMPLOYER'), icon: Briefcase },
  ];
  // filter
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // toggle role select
  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.filter(item => item !== code)
        : [...prev, code],
    );
  };
  // udpate role
  const { mutate: saveRoles, isPending } = useMutation({
    mutationFn: updateUserRoles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigation.goBack();
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: t('role_screen.toast_error'),
        text2: err.message || t('role_screen.toast_update_failed'),
      });
    },
  });
  // const handleSaveChanges = () => {
  //   if (selectedLanguages.length === 0) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: 'Please select at least one role',
  //     });
  //     return;
  //   }
  //   saveRoles(selectedLanguages);
  // };

  // CHANGE handleSaveChanges to this:
  const handleSaveChanges = () => {
    if (selectedLanguages.length === 0) {
      Toast.show({
        type: 'error',
        text1: t('role_screen.toast_error'),
        text2: t('role_screen.toast_select_role'),
      });
      return;
    }

    // If coming from Edit Profile, just return skills — do NOT save to Firebase
    // if (fromEdit) {
    //   navigation.navigate('BottomTabs', {
    //     screen: 'Profile',
    //     params: { updatedSkills: selectedLanguages },
    //   });
    //   return;
    // }
    if (fromEdit) {
      setPendingSkills(selectedLanguages); // store skills before going back
      navigation.goBack(); // goBack() does NOT remount MainProfile
      return;
    }

    // Standalone usage — save to Firebase as before
    saveRoles(selectedLanguages);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>{t('role_screen.title')}</Text>

        <View />
      </View>
      <Text style={styles.skilltext}>{t('role_screen.subtitle')}</Text>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredRoles.map(role => {
            const isSelected = selectedLanguages.includes(role.code);
            const Icon = role.icon;

            return (
              <TouchableOpacity
                key={role.code}
                style={[
                  styles.languageItem,
                  isSelected && styles.languageItemSelected,
                  styles.skillItem,
                ]}
                onPress={() => toggleLanguage(role.code)}
                activeOpacity={0.7}
              >
                <View style={[styles.languageLeft, styles.skillleft]}>
                  <Icon width={22} height={22} color="#FFF" />

                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{role.name}</Text>
                  </View>
                </View>

                {/* Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxChecked,
                  ]}
                >
                  {isSelected && (
                    <Check width={16} height={16} color="#1E293B" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, styles.saverole]}
          onPress={handleSaveChanges}
          disabled={isPending}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>
            {isPending ? t('role_screen.saving') : t('role_screen.save_roles')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoleScreen;
