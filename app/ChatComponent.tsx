import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DateSeparator } from "../components/DateSeparator";
import { ImageModal } from "../components/ImageModal";
import { MessageInput } from "../components/MessageInput";
import { MessageItem } from "../components/MessageItem";
import { ParticipantModal } from "../components/ParticipantModal";
import { ReactionModal } from "../components/ReactionModal";
import { useChatStore } from "../store/chatStore";
import { TMessage, TParticipant } from "../types/chat";

interface MessageWithDate extends TMessage {
  showDateSeparator?: boolean;
  separatorDate?: Date;
}

export default function App() {
  const {
    messages,
    participants,
    isLoading,
    error,
    initializeChat,
    updateMessages,
    updateParticipants,
    loadOlderMessages,
    setError,
  } = useChatStore();

  const [selectedParticipant, setSelectedParticipant] =
    useState<TParticipant | null>(null);
  const [selectedMessageForReactions, setSelectedMessageForReactions] =
    useState<TMessage | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  // const updateIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializeChat();

    // Set up periodic updates
    // updateIntervalRef.current = setInterval(() => {
    //   updateMessages();
    //   updateParticipants();
    // }, 5000); // Update every 5 seconds

    return () => {
      // if (updateIntervalRef.current) {
      //   clearInterval(updateIntervalRef.current);
      // }
    };
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  const processMessagesWithDates = (): MessageWithDate[] => {
    const processedMessages: MessageWithDate[] = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const messageDate = new Date(message.sentAt);

      // Check if we need to show a date separator
      if (i === 0) {
        processedMessages.push({
          ...message,
          showDateSeparator: true,
          separatorDate: messageDate,
        });
      } else {
        const prevMessageDate = new Date(messages[i - 1].sentAt);
        const showSeparator =
          messageDate.toDateString() !== prevMessageDate.toDateString();

        processedMessages.push({
          ...message,
          showDateSeparator: showSeparator,
          separatorDate: showSeparator ? messageDate : undefined,
        });
      }
    }

    return processedMessages;
  };

  const isMessageGrouped = (message: TMessage, index: number): boolean => {
    if (index === 0) return false;

    const prevMessage = messages[index - 1];
    const timeDiff = message.sentAt - prevMessage.sentAt;
    const fiveMinutes = 30 * 1000;

    return (
      prevMessage.authorUuid === message.authorUuid &&
      timeDiff < fiveMinutes
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await updateMessages();
      await updateParticipants();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingOlder || messages.length === 0) return;

    setLoadingOlder(true);
    try {
      await loadOlderMessages();
    } finally {
      setLoadingOlder(false);
    }
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: MessageWithDate;
    index: number;
  }) => {
    const messageIndex = messages.findIndex((m) => m.uuid === item.uuid);
    const isGrouped = isMessageGrouped(item, messageIndex);

    return (
      <View>
        {item.showDateSeparator && item.separatorDate && (
          <DateSeparator date={item.separatorDate} />
        )}
        <MessageItem
          message={item}
          isGrouped={isGrouped}
          onParticipantPress={setSelectedParticipant}
          onReactionPress={setSelectedMessageForReactions}
          onImagePress={setSelectedImageUrl}
        />
      </View>
    );
  };

  const renderHeader = () => {
    if (!loadingOlder) return null;

    return (
      <View style={styles.loadingHeader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading older messages...</Text>
      </View>
    );
  };

  if (isLoading && messages.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  const processedMessages = processMessagesWithDates();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tribe Chat Room</Text>
        <Text style={styles.headerSubtitle}>
          {participants.length} participant
          {participants.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={processedMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.uuid}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        // onEndReached={handleLoadMore}
        // onEndReachedThreshold={0.1}
        ListHeaderComponent={renderHeader}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />

      <MessageInput />

      <ParticipantModal
        participant={selectedParticipant}
        isVisible={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
      />

      <ReactionModal
        message={selectedMessageForReactions}
        isVisible={!!selectedMessageForReactions}
        onClose={() => setSelectedMessageForReactions(null)}
      />

      <ImageModal
        imageUrl={selectedImageUrl}
        isVisible={!!selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#F8F8F8",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  loadingHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#8E8E93",
  },
});
