import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  ActivityIndicator,
  Image,
  Text,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import colors from "tailwindcss/colors";
import { useState } from "react";
import Backdrop from "./Backdrop";
import Modal from "./modal/Modal";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileImg() {
  const { user } = useUser();

  const { showActionSheetWithOptions } = useActionSheet();

  const [userPicture, setUserPicture] =
    useState<null | ImagePicker.ImagePickerAsset>(null);
  const [isSettingImg, setIsSettingImg] = useState(false);
  const [isDeletingImg, setIsDeletingImg] = useState(false);

  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const colorScheme = useColorScheme();
  const bgColor =
    colorScheme === "dark" ? colors.neutral[900] : colors.neutral[300];
  const textColor =
    colorScheme !== "dark" ? colors.neutral[950] : colors.neutral[50];

  const selectUserPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
      exif: true,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setUserPicture(img);
    }
  };

  const removeProfileImage = async () => {
    try {
      setIsDeletingImg(true);
      await user?.setProfileImage({ file: null });
      ToastAndroid.show(`Profile picture is removed!`, ToastAndroid.SHORT);
      user?.reload();
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Try Again!" }],
      });
    } finally {
      setIsDeletingImg(false);
    }
  };

  const setProfileImage = async () => {
    try {
      setIsSettingImg(true);
      console.log({ isBase64Available: Boolean(userPicture?.base64) });
      await user?.setProfileImage({
        file: "data:image/jpeg;base64," + userPicture?.base64 || null,
      });
      setUserPicture(null);
      ToastAndroid.show(`Profile picture has been set!`, ToastAndroid.SHORT);
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Try Again!" }],
      });
    } finally {
      setIsSettingImg(false);
    }
  };

  const openSheet = () => {
    const options = [];

    if (user?.hasImage) {
      options.push("Edit profile picture");
      options.push("Remove profile picture");
    } else {
      options.push("Add profile picture");
    }

    const destructiveButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        containerStyle: {
          backgroundColor: bgColor,
        },
        textStyle: { color: textColor },
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            selectUserPicture();
            break;

          case destructiveButtonIndex:
            removeProfileImage();
            break;
        }
      }
    );
  };

  return (
    <>
      <View className="flex flex-1 gap-1 flex-col items-center justify-center p-3">
        <TouchableOpacity onPress={openSheet}>
          <Image
            source={{ uri: userPicture?.uri || user?.imageUrl }}
            width={92}
            height={92}
            alt="Image"
            style={{
              borderWidth: 1,
              borderRadius: 9999,
            }}
          />
        </TouchableOpacity>
        {!userPicture &&
          (isDeletingImg ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <TouchableOpacity onPress={openSheet}>
              <Text className="text-sm text-sky-600">
                {user?.hasImage ? "Edit picture" : "Add picture"}
              </Text>
            </TouchableOpacity>
          ))}

        {userPicture && (
          <View className="flex-row gap-2 justify-end items-center">
            <TouchableHighlight
              className="rounded-full p-1 mr-4"
              activeOpacity={0.7}
              underlayColor={colors.neutral[800]}
              onPress={() => setUserPicture(null)}
            >
              <Ionicons name="close" size={24} color={colors.neutral[300]} />
            </TouchableHighlight>

            <TouchableHighlight
              className="rounded-full p-1"
              underlayColor={colors.sky[900]}
              activeOpacity={0.7}
              onPress={setProfileImage}
            >
              {isSettingImg ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Ionicons
                  name="checkmark-sharp"
                  size={24}
                  color={colors.sky[600]}
                />
              )}
            </TouchableHighlight>
          </View>
        )}
      </View>

      {error && (
        <Backdrop center>
          <Modal
            title={error.title}
            text={error.text}
            actions={error.actions}
          />
        </Backdrop>
      )}
    </>
  );
}
