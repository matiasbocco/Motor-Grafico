import React, { useState, useEffect } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import ProgressBar from "react-native-progress/Bar";

const TimedModal = ({
  visible,
  onClose,
  duration,
  description,
  title,
  status,
}) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (visible) {
      setProgress(1);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = 1 - elapsedTime / duration;
        if (newProgress <= 0) {
          clearInterval(interval);
          onClose();
          setProgress(0);
        } else {
          setProgress(newProgress);
        }
      }, 150);
      return () => clearInterval(interval);
    } else {
      setProgress(1);
    }
  }, [visible, duration, onClose]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.modalText}>{description}</Text>
          <ProgressBar
            progress={progress}
            width={null}
            height={10}
            borderRadius={10}
            borderWidth={0}
            style={styles.progressBar}
            useNativeDriver={true}
            color={status === "success" ? "#4CAF50" : "red"}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TimedModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },
  modalView: {
    width: 300,
    height: 80,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 12,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
