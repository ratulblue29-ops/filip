import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'InterDisplay-Bold'
    },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
    profileImageContainer: { alignItems: 'center', marginVertical: 20 },
    imageWrapper: { position: 'relative' },
    profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#333' },
    editIconButton: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#1F2937',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#000',
    },
    changePhotoText: {
        color: '#9CA3AF',
        marginTop: 12,
        fontSize: 13,
        fontFamily: 'InterDisplay-Regular'
    },
    label: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
        marginTop: 20,
        fontFamily: 'InterDisplay-SemiBold'
    },
    input: {
        backgroundColor: '#171717',
        borderRadius: 10,
        padding: 12,
        color: '#fff',
        fontSize: 14,
        fontFamily: 'InterDisplay-Regular'
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#171717',
        borderRadius: 10,
    },
    flexInput: {
        flex: 1,
        color: '#fff',
        padding: 12,
        fontSize: 14,
        fontFamily: 'InterDisplay-Regular'
    },
    row: { flexDirection: 'row' },
    textArea: { height: 100, textAlignVertical: 'top' },
    rolesContainer: {
        backgroundColor: '#171717',
        padding: 12,
        borderRadius: 12,
    },
    tagsWrapper: { flexDirection: 'row', flexWrap: 'wrap' },
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
        fontFamily: 'InterDisplay-Medium'
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
        color: '#A3A3A3',
        fontSize: 11,
        marginBottom: 6,
        fontFamily: 'InterDisplay-Medium'
    },
    dateCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1.5,
        borderColor: '#404040',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDateCircle: { backgroundColor: '#FACC15', borderColor: '#FACC15' },
    dateText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'InterDisplay-SemiBold'
    },
    activeDateText: { color: '#000', fontFamily: 'InterDisplay-Bold' },
    dot: { width: 4, height: 4, borderRadius: 2, marginTop: 6 },
    reviewCard: {
        backgroundColor: '#171717',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    reviewHeader: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333' },
    reviewTitle: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'InterDisplay-Bold'
    },
    reviewSubtext: {
        color: '#737373',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'InterDisplay-Medium'
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        marginRight: 4,
        fontFamily: 'InterDisplay-Bold'
    },
    reviewBody: {
        color: '#D4D4D4',
        fontSize: 13,
        marginTop: 12,
        lineHeight: 18,
        fontFamily: 'InterDisplay-Regular'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    mainButton: {
        backgroundColor: '#FACC15',
        paddingVertical: 16,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButtonText: {
        color: '#000',
        fontSize: 16,
        marginLeft: 10,
        fontFamily: 'InterDisplay-Bold'
    },
});

export default styles;
