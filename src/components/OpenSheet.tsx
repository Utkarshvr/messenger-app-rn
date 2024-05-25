// Using the provided hook
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button, useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

export default function OpenSheet() {
  const { showActionSheetWithOptions } = useActionSheet();

  const colorScheme = useColorScheme();
  const bgColor =
    colorScheme === "dark" ? colors.neutral[900] : colors.neutral[300];
  const textColor =
    colorScheme !== "dark" ? colors.neutral[950] : colors.neutral[50];

  const onPress = () => {
    const options = ["Delete", "Save", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        containerStyle: {
          backgroundColor: bgColor,
        },
        textStyle: { color: textColor },
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 1:
            // Save
            break;

          case destructiveButtonIndex:
            // Delete
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  return <Button title="Menu" onPress={onPress} />;
}
