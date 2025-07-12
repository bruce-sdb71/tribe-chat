import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useChatStore } from "../store/chatStore";

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading } = useChatStore();

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const messageToSend = message.trim();
      setMessage("");

      try {
        await sendMessage(messageToSend);
      } catch (error) {
        Alert.alert("Error", "Failed to send message. Please try again.");
        setMessage(messageToSend); // Restore message on error
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#8E8E93"
          multiline
          maxLength={1000}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          <Ionicons
            name="send"
            size={20}
            color={!message.trim() || isLoading ? "#8E8E93" : "#007AFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 4,
    paddingRight: 8,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
