import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#111111',
  cardBg: '#1D1D1D',
  primary: '#FFD900',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  textDark: '#1F2937',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },
  input: {
    flex: 1,
    color: COLORS.gray,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: COLORS.white,
    fontFamily: 'InterDisplaySemiBold',
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  topicCard: {
    width: '47%',
    height: 125,
  },
  topicCardBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  topicCardImage: {
    borderRadius: 12,
  },
  topicCardContent: {
    padding: 11,
    gap: 10,
  },
  topicCardTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  faqSection: {
    gap: 12,
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: 500,
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
    flex: 1,
    marginLeft: 10,
  },
  faqAnswer: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 20,
    marginTop: 12,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.primary,
    fontFamily: 'InterDisplayMedium',
  },
  supportSection: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: COLORS.white,
    fontFamily: 'InterDisplaySemiBold',
    marginBottom: 8,
  },
  supportSubtext: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 20,
  },
  supportButtons: {
    marginTop: 20,
    gap: 8,
  },
  liveChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 90,
    borderRadius: 8,
  },
  liveChatText: {
    fontSize: 16,
    fontWeight: 900,
    color: COLORS.textDark,
    fontFamily: 'InterDisplaySemiBold',
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 600,
    color: COLORS.textDark,
    fontFamily: 'InterDisplaySemiBold',
  },

  // ─── Guide Section Styles ─────────────────────────────────────────────────

  // Icon + title row inside accordion header
  guideSectionIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Expanded content wrapper
  guideContentBody: {
    marginTop: 16,
    gap: 6,
  },

  // Bold subheading inside expanded content e.g. "Seasonal Workers"
  guideSubheading: {
    fontSize: 13,
    fontWeight: 600,
    color: COLORS.primary,
    fontFamily: 'InterDisplaySemiBold',
    marginTop: 8,
    marginBottom: 2,
  },

  // Numbered step row
  guideStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  guideStepNumber: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
    marginTop: 1,
  },
  guideStepText: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 20,
    flex: 1,
  },

  // Bullet row (indented sub-item)
  guideBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingLeft: 8,
  },
  guideBulletDot: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    marginTop: 1,
  },
  guideBulletText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 20,
    flex: 1,
  },

  // Note / description text (italic feel, gray)
  guideNote: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 19,
    paddingLeft: 8,
    fontStyle: 'italic',
  },

  // Empty state when search returns nothing
  guideEmptyText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default styles;