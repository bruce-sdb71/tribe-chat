import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { useChatStore } from '../store/chatStore';
import { TMessage, TReaction } from '../types/chat';

interface ReactionModalProps {
  message: TMessage | null;
  isVisible: boolean;
  onClose: () => void;
}

export const ReactionModal: React.FC<ReactionModalProps> = ({
  message,
  isVisible,
  onClose,
}) => {
  const { participants } = useChatStore();

  if (!message || !message.reactions) return null;

  const renderReactionItem = ({ item }: { item: TReaction }) => {
    const participant = participants.find(p => p.uuid === item.participantUuid);

    return (
      <View style={styles.reactionItem}>
        <Text style={styles.reactionEmoji}>{item.value}</Text>
        <View style={styles.participantInfo}>
          {participant?.avatarUrl ? (
            <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Text style={styles.avatarText}>
                {participant?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <Text style={styles.participantName}>
            {participant?.name || 'Unknown User'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        
        <Text style={styles.title}>Reactions</Text>
        
        <FlatList
          data={message.reactions}
          renderItem={renderReactionItem}
          keyExtractor={(item, index) => `${item.participantUuid}-${item.value}-${index}`}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  reactionEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  defaultAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  participantName: {
    fontSize: 16,
    color: '#000',
  },
});