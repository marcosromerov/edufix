import { Alert, Platform } from "react-native";

/**
 * Muestra un aviso y ejecuta `onDismiss` al cerrarlo, funcionando igual en
 * web y en mobile. En web `Alert.alert` no dispara el `onPress` de los
 * botones, así que usamos `window.alert` (bloqueante) y navegamos después.
 */
export function alertThen(title: string, message: string, onDismiss: () => void): void {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
    onDismiss();
  } else {
    Alert.alert(title, message || undefined, [{ text: "OK", onPress: onDismiss }]);
  }
}
