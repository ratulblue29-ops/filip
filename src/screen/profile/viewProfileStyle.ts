import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111111' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'InterDisplay-Bold'
    },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
    profileImageContainer: { alignItems: 'center', marginVertical: 20 },
    imageWrapper: { position: 'relative' },
    profileImage: { width: 104, height: 104, borderRadius: 50, borderWidth: 0.5, borderColor: '#A3E635' },
    changePhotoText: {
        color: '#9CA3AF',
        marginTop: 12,
        fontSize: 13,
        fontFamily: 'InterDisplay-Regular'
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
        marginTop: 20,
        fontFamily: 'InterDisplay-SemiBold'
    },
    box: {
        backgroundColor: '#1D1D1D',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 14,
        fontFamily: 'InterDisplay-Regular',
        borderWidth: 0.5,
        borderColor: 'rgba(249, 250, 251, 0.10)'
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1D1D1D',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 0.5,
        borderColor: 'rgba(249, 250, 251, 0.10)'
    },
    flexInput: {
        flex: 1,
        color: '#fff',
        padding: 12,
        fontSize: 14,
        fontFamily: 'InterDisplay-Regular'
    },
    row: { flexDirection: 'row', gap: 28 },
    rolesContainer: {
        backgroundColor: '#1D1D1D',
        padding: 12,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: 'rgba(249, 250, 251, 0.10)'
    },
    tagsWrapper: { flexDirection: 'row', flexWrap: 'wrap' },
    age: {
        flex: 1
    },
    agetext: {
        textAlign: 'center'
    },
    bioText: {
        fontFamily: 'InterDisplay-Regular',
        fontSize: 14,
        color: '#fff',
        lineHeight: 20,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        margin: 4,
        borderWidth: 1,
        borderColor: '#404040',
    },
    tagText: {
        color: '#fff',
        fontSize: 13,
        marginRight: 6,
        fontFamily: 'InterDisplay-Thin',
        fontWeight: 300,
    },
    addRoleBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginLeft: 4 },
    addRoleText: {
        color: '#737373',
        fontSize: 14,
        marginLeft: 6,
        fontFamily: 'InterDisplay-Medium'
    },
    helperText: {
        color: '#525252',
        fontSize: 12,
        marginTop: 15,
        fontFamily: 'InterDisplay-Regular'
    },
    daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    dayContainer: { alignItems: 'center' },
    dayLabelText: {
        color: '#fff',
        fontSize: 11,
        marginBottom: 6,
        fontFamily: 'InterDisplay-Medium',
        fontWeight: 500,
    },
    dateCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1.5,
        borderColor: '#FDE68A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDateCircle: { backgroundColor: '#FFD900', borderColor: '#FFD900' },
    dateText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'InterDisplay-SemiBold'
    },
    activeDateText: { color: '#000', fontFamily: 'InterDisplay-Bold', fontWeight: 700 },
    dot: { width: 4, height: 4, borderRadius: 2, marginTop: 6 },
    reviewCard: {
        backgroundColor: '#1D1D1D',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 0.5,
        borderColor: 'rgba(249, 250, 251, 0.10)'
    },
    reviewHeader: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333' },
    reviewTitle: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'InterDisplay-Bold',
        fontWeight: 700,
    },
    reviewSubtext: {
        color: '#9DB9A8',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'InterDisplay-Medium',
        fontWeight: 500,
        lineHeight: 21,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4B5563',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        marginRight: 4,
        fontFamily: 'InterDisplay-Bold',
        fontWeight: 700,
    },
    reviewBody: {
        color: '#D4D4D4',
        fontSize: 13,
        marginTop: 12,
        lineHeight: 18,
        fontFamily: 'InterDisplay-Regular'
    },
    footer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        backgroundColor: '#111',
        alignSelf: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    mainButton: {
        backgroundColor: '#FFD900',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButtonText: {
        color: '#102217',
        fontSize: 16,
        marginLeft: 10,
        fontFamily: 'InterDisplay-Bold',
        fontWeight: 700,
        lineHeight: 24
    },
    chatButton: {
        // backgroundColor: '#FFD900',
        borderColor: '#FFD900',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatButtonText: {
        color: '#FFD900',
        fontSize: 16,
        marginLeft: 10,
        fontFamily: 'InterDisplay-Bold',
        fontWeight: 700,
        lineHeight: 24
    },
});

export default styles;
