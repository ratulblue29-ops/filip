import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111',
        paddingHorizontal: 20,
    },
    HeaderWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    title: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
        marginVertical: 16,
    },

    feeCard: {
        borderWidth: 1.5,
        borderColor: '#F5C400',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },

    feeTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 20,
        marginBottom: 12,
    },

    iconTextRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    textWrapper: {
        flex: 1,
    },

    feeText: {
        color: '#FFF',
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 400,
        flexShrink: 1,
    },

    bold: {
        color: '#FBBF24',
        fontWeight: '700',
        lineHeight: 21,
        fontSize: 14,
    },

    singleBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginVertical: 16,
    },

    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    link: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: '600',
    },

    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },

    label: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 6,
    },

    input: {
        backgroundColor: '#1c1c1c',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: '#fff',
        marginBottom: 14,
    },

    textArea: {
        backgroundColor: '#1c1c1c',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: '#fff',
        height: 100,
        textAlignVertical: 'top',
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },

    flex: {
        flex: 1,
    },

    button: {
        backgroundColor: '#F5C400',
        borderRadius: 12,
        paddingVertical: 14,
        marginVertical: 24,
        alignItems: 'center',
    },

    buttonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default styles;