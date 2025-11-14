import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import QRCode from "react-native-qrcode-svg";

export default function App() {
  const [text, setText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedValue, setScannedValue] = useState("");

  // Permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // 🔹 Vista del escáner
  if (scanning) {
    return (
      <View style={styles.cameraWrapper}>
        <Text style={styles.scannerText}>Escaneando...</Text>

        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(result) => {
            if (result.data) {
              setScanning(false);
              setScannedValue(result.data);
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Generator & Scanner</Text>

      {/* Campo de texto */}
      <TextInput
        style={styles.input}
        placeholder="Ingresá texto para generar QR"
        placeholderTextColor="#888"
        value={text}
        onChangeText={setText}
      />

      {/* QR dinámico */}
      {text !== "" && (
        <View style={styles.card}>
          <QRCode value={text} size={180} />
        </View>
      )}

      {/* Botón escanear */}
      <TouchableOpacity
        style={[styles.button, permission?.granted ? null : styles.buttonDisabled]}
        onPress={() => {
          if (permission?.granted) setScanning(true);
        }}
        disabled={!permission?.granted}
      >
        <Text style={styles.buttonText}>Escanear QR</Text>
      </TouchableOpacity>

      {/* Mensaje sin permisos */}
      {permission?.granted === false && (
        <Text style={styles.errorText}>❌ No otorgaste permisos de cámara.</Text>
      )}

      {/* Último valor escaneado */}
      {scannedValue !== "" && (
        <Text style={styles.resultText}>
          Último valor escaneado:{" "}
          <Text style={{ fontWeight: "bold" }}>{scannedValue}</Text>
        </Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#eef2f3",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  card: {
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginVertical: 25,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#9bb8d4",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 25,
    fontSize: 17,
    color: "#333",
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  scannerText: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "600",
    zIndex: 10,
  },
});
