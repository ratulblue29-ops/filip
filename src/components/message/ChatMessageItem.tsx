import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ChatMessage } from '../../@types/ChatMessage.type';
import { styles } from '../../screen/chat/chatDetailStyle';
import {
  CalendarDays,
  Clock,
  MapPin,
  Banknote,
  CheckCircle,
  XCircle,
  Undo2,
} from 'lucide-react-native';
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

type ChatMessageItemProps = {
  message: ChatMessage;
};

// ─── Offer Card ───────────────────────────────────────────
// Rendered when message.type === 'job_attachment' and metadata.offerCard exists
const OfferCard = ({
  offerCard,
  isMe,
  messageId,
  chatId,
}: {
  offerCard: any;
  isMe: boolean;
  messageId: string;
  chatId?: string; // passed from ChatDetailScreen via message prop
}) => {
  const [actionLoading, setActionLoading] = useState<
    'accept' | 'decline' | 'withdraw' | null
  >(null);

  const isPending = offerCard.status === 'pending';
  const isAccepted = offerCard.status === 'accepted';
  const isDeclined = offerCard.status === 'declined';
  const isWithdrawn = offerCard.status === 'withdrawn';

  // Update offer status in Firestore message metadata
  const updateStatus = async (
    status: string,
    action: 'accept' | 'decline' | 'withdraw',
  ) => {
    if (!chatId) return;
    setActionLoading(action);
    try {
      const db = getFirestore();
      const msgRef = doc(db, 'chats', chatId, 'messages', messageId);
      await updateDoc(msgRef, {
        'metadata.offerCard.status': status,
      });
      // Also update engagement doc if needed
      if (offerCard.engagementId) {
        const engRef = doc(db, 'engagements', offerCard.engagementId);
        await updateDoc(engRef, { status });
      }
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Status badge color
  const badgeColor = isAccepted
    ? '#4ADE80'
    : isDeclined
    ? '#F87171'
    : isWithdrawn
    ? '#9CA3AF'
    : '#FFD900';

  const badgeLabel = isAccepted
    ? 'Accepted'
    : isDeclined
    ? 'Declined'
    : isWithdrawn
    ? 'Withdrawn'
    : 'Pending';

  return (
    <View style={cardStyles.card}>
      {/* Title row */}
      <View style={cardStyles.titleRow}>
        <Text style={cardStyles.title} numberOfLines={1}>
          {offerCard.postTitle}
        </Text>
        <View
          style={[
            cardStyles.badge,
            { backgroundColor: badgeColor + '33', borderColor: badgeColor },
          ]}
        >
          <Text style={[cardStyles.badgeText, { color: badgeColor }]}>
            {badgeLabel}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={cardStyles.row}>
        <CalendarDays size={14} color="#9CA3AF" />
        <Text style={cardStyles.detail}>{offerCard.workDate}</Text>
      </View>

      <View style={cardStyles.row}>
        <Clock size={14} color="#9CA3AF" />
        <Text style={cardStyles.detail}>
          {offerCard.startTime} – {offerCard.endTime}
        </Text>
      </View>

      <View style={cardStyles.row}>
        <Banknote size={14} color="#9CA3AF" />
        <Text style={cardStyles.detail}>{offerCard.wage}/hr</Text>
      </View>

      <View style={cardStyles.row}>
        <MapPin size={14} color="#9CA3AF" />
        <Text style={cardStyles.detail}>{offerCard.location}</Text>
      </View>

      {!!offerCard.description && (
        <Text style={cardStyles.desc}>{offerCard.description}</Text>
      )}

      {/* Action buttons — only show when pending */}
      {isPending && (
        <View style={cardStyles.actionRow}>
          {/* Worker sees Accept + Decline */}
          {!isMe && (
            <>
              <TouchableOpacity
                style={[cardStyles.actionBtn, cardStyles.acceptBtn]}
                onPress={() => updateStatus('accepted', 'accept')}
                disabled={actionLoading !== null}
                activeOpacity={0.8}
              >
                {actionLoading === 'accept' ? (
                  <ActivityIndicator size="small" color="#1F2937" />
                ) : (
                  <>
                    <CheckCircle size={16} color="#1F2937" />
                    <Text style={cardStyles.acceptText}>Accept</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[cardStyles.actionBtn, cardStyles.declineBtn]}
                onPress={() => updateStatus('declined', 'decline')}
                disabled={actionLoading !== null}
                activeOpacity={0.8}
              >
                {actionLoading === 'decline' ? (
                  <ActivityIndicator size="small" color="#F87171" />
                ) : (
                  <>
                    <XCircle size={16} color="#F87171" />
                    <Text style={cardStyles.declineText}>Decline</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Employer sees Withdraw */}
          {isMe && (
            <TouchableOpacity
              style={[cardStyles.actionBtn, cardStyles.withdrawBtn]}
              onPress={() => updateStatus('withdrawn', 'withdraw')}
              disabled={actionLoading !== null}
              activeOpacity={0.8}
            >
              {actionLoading === 'withdraw' ? (
                <ActivityIndicator size="small" color="#9CA3AF" />
              ) : (
                <>
                  <Undo2 size={16} color="#9CA3AF" />
                  <Text style={cardStyles.withdrawText}>Withdraw Offer</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────
const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isOfferCard =
    message.type === 'job_attachment' && message.metadata?.offerCard;

  // ── Offer card message ──
  if (isOfferCard) {
    return (
      <View
        style={
          message.isMe ? styles.myMessageContainer : styles.otherMessageWrapper
        }
      >
        {!message.isMe && (
          <Text style={styles.senderName}>
            {message.sender}, {message.time}
          </Text>
        )}

        {!message.isMe && message.avatar && (
          <View style={styles.otherMessageRow}>
            <Image source={{ uri: message.avatar }} style={styles.chatAvatar} />
            <OfferCard
              offerCard={message.metadata.offerCard}
              isMe={message.isMe}
              messageId={message.id}
              chatId={message.metadata?.chatId}
            />
          </View>
        )}

        {message.isMe && (
          <OfferCard
            offerCard={message.metadata.offerCard}
            isMe={message.isMe}
            messageId={message.id}
            chatId={message.metadata?.chatId}
          />
        )}

        <Text style={[styles.timeText, message.isMe && { textAlign: 'right' }]}>
          {message.time}
        </Text>
      </View>
    );
  }

  // ── Regular text message (me) ──
  if (message.isMe) {
    return (
      <View style={styles.myMessageContainer}>
        <View style={styles.myBubble}>
          <Text style={styles.messageTextBlack}>{message.text}</Text>
        </View>
        <Text style={styles.timeText}>{message.time}</Text>
      </View>
    );
  }

  // ── Regular text message (other) ──
  return (
    <View style={styles.otherMessageWrapper}>
      <Text style={styles.senderName}>
        {message.sender}, {message.time}
      </Text>

      <View style={styles.otherMessageRow}>
        {message.avatar && (
          <Image source={{ uri: message.avatar }} style={styles.chatAvatar} />
        )}

        <View style={styles.otherBubble}>
          <Text style={styles.messageTextBlack}>{message.text}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatMessageItem;

// ─── Offer Card Styles ────────────────────────────────────
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    padding: 14,
    maxWidth: '85%',
    gap: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(249,250,251,0.10)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'InterDisplay-Medium',
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'InterDisplay-Medium',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detail: {
    color: '#D1D5DB',
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
  },
  desc: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'InterDisplay-Regular',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: '#FFD900',
  },
  acceptText: {
    color: '#1F2937',
    fontFamily: 'InterDisplay-Medium',
    fontWeight: '600',
    fontSize: 14,
  },
  declineBtn: {
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  declineText: {
    color: '#F87171',
    fontFamily: 'InterDisplay-Medium',
    fontWeight: '600',
    fontSize: 14,
  },
  withdrawBtn: {
    backgroundColor: 'rgba(156,163,175,0.12)',
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  withdrawText: {
    color: '#9CA3AF',
    fontFamily: 'InterDisplay-Medium',
    fontSize: 14,
  },
});
