import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChatStore } from '../store/chatStore';
import { TMessage, TParticipant } from '../types/chat';

interface MessageItemProps {
  message: TMessage;
  isGrouped: boolean;
  onParticipantPress: (participant: TParticipant) => void;
  onReactionPress: (message: TMessage) => void;
  onImagePress: (imageUrl: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isGrouped,
  onParticipantPress,
  onReactionPress,
  onImagePress,
}) => {
  const { participants } = useChatStore();
  const participant = participants.find(p => p.uuid === message.authorUuid);
  const isOwnMessage = message.authorUuid === 'you';

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    const reactionCounts = message.reactions.reduce((acc, reaction) => {
      acc[reaction.value] = (acc[reaction.value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <TouchableOpacity
            key={emoji}
            style={styles.reactionBubble}
            onPress={() => onReactionPress(message)}
          >
            <Text style={styles.reactionEmoji}>{emoji && emoji}</Text>
            <Text style={styles.reactionCount}>{count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReplyMessage = () => {
    if (!message.replyToMessage) return null;

    const replyParticipant = participants.find(p => p.uuid === message.replyToMessage!.authorUuid);

    return (
      <View style={styles.replyContainer}>
        <View style={styles.replyLine} />
        <View style={styles.replyContent}>
          <Text style={styles.replyAuthor}>
            {replyParticipant?.name || 'Unknown User'}
          </Text>
          <Text style={styles.replyText} numberOfLines={2}>
            {message.replyToMessage.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessageContainer]}>
      {!isGrouped && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => participant && onParticipantPress(participant)}
          >
            {participant?.avatarUrl ? (
              <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.defaultAvatar]}>
                <Text style={styles.avatarText}>
                  {participant?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => participant && onParticipantPress(participant)}>
            <Text style={styles.participantName}>
              {participant?.name || 'Unknown User'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{formatTime(message.sentAt)}</Text>
        </View>
      )}
      
      <View style={[styles.messageContent, isGrouped && styles.groupedMessage]}>
        {renderReplyMessage()}
        
        {message.text && (
          <Text style={styles.messageText}>{message.text}</Text>
        )}
        
        {message.attachments.length > 0 &&  (
          message.attachments.map(item => (
          <TouchableOpacity key={item.url} onPress={() => onImagePress(item.url!)}>
            <Image source={{ uri: item.url }} style={styles.messageImage} />
          </TouchableOpacity>
          )
        ))}
        
        {message.isEdited && (
          <Text style={styles.editedLabel}>edited</Text>
        )}  
        
        {renderReactions()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  messageContent: {
    maxWidth: '80%',
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupedMessage: {
    marginLeft: 40,
    marginTop: 2,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  replyLine: {
    width: 3,
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginTop: 4,
  },
  editedLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 2,
  },
  reactionCount: {
    fontSize: 12,
    color: '#8E8E93',
  },
});