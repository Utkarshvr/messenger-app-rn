import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import { EmailAddressResource, ClerkAPIError } from "@clerk/types";
import { useUser } from "@clerk/clerk-expo";

export default function EmailEditMenu({
  email,
  primaryEmailAddress,
  menuVisible,
  toggleMenu,
  closeMenu,
  setIsEmailVerificationPending,
  setVerificationEmail,
  error,
  setError,
  setVerificationTime,
}: {
  email: EmailAddressResource;
  primaryEmailAddress: string;

  menuVisible: string;
  toggleMenu: (emailID: string) => void;
  closeMenu: () => void;
  setIsEmailVerificationPending: React.Dispatch<React.SetStateAction<boolean>>;
  setVerificationEmail: React.Dispatch<React.SetStateAction<string>>;
  setVerificationTime: React.Dispatch<React.SetStateAction<number>>;

  error: {
    title: string;
    text: string;
    actions: {
      onPress: () => void;
      text: string;
    }[];
  } | null;
  setError: React.Dispatch<
    React.SetStateAction<{
      title: string;
      text: string;
      actions: {
        onPress: () => void;
        text: string;
      }[];
    } | null>
  >;
}) {
  const { user } = useUser();

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteEmail = async (emailID: string) => {
    console.log("deleting");
    try {
      setIsDeleting(true);
      const data = await user?.emailAddresses
        .find((e) => e.id === emailID)
        ?.destroy();
      console.log(data);
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Okay" }],
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const [isSettingEmailAsPrimary, setIsSettingEmailAsPrimary] = useState(false);

  const setEmailAsPrimary = async (emailID: string) => {
    try {
      setIsSettingEmailAsPrimary(true);
      await user?.update({
        primaryEmailAddressId: emailID,
      });
      closeMenu();
    } catch (err: any) {
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Okay" }],
      });
    } finally {
      setIsSettingEmailAsPrimary(false);
    }
  };

  const verifyEmail = async (emailID: string) => {
    try {
      const selectedEmail = user?.emailAddresses.find((e) => e.id === emailID);

      await selectedEmail?.prepareVerification({ strategy: "email_code" });
      setIsEmailVerificationPending(true);
      setVerificationEmail(selectedEmail?.emailAddress || "");

      setVerificationTime(30);

      const intervalId = setInterval(() => {
        setVerificationTime((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalId); // Clear interval when time is 0
            return prev;
          }
        });
      }, 1000);

      ToastAndroid.show(
        `Verification Code is sent to ${selectedEmail?.emailAddress}`,
        ToastAndroid.SHORT
      );
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Okay" }],
      });
    }
  };
  return (
    <>
      <View className="relative">
        <TouchableHighlight
          className="p-1 flex flex-row rounded-full justify-center items-center z-10"
          activeOpacity={0.6}
          underlayColor={colors.neutral[900]}
          onPress={() => toggleMenu(email.id)}
        >
          <Entypo
            name="dots-three-horizontal"
            size={20}
            color={colors.neutral[300]}
          />
        </TouchableHighlight>

        {menuVisible === email.id && (
          <View
            className={`w-[160px] absolute top-5 right-0 flex bg-neutral-400 dark:bg-neutral-800 rounded-lg`}
            style={{ zIndex: 10000000000000 }}
          >
            {email.verification.status !== "verified"
              ? null
              : email.emailAddress !== primaryEmailAddress && (
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor={colors.neutral[700]}
                    className="p-2 rounded-lg"
                    onPress={() => setEmailAsPrimary(email.id)}
                  >
                    {isSettingEmailAsPrimary ? (
                      <ActivityIndicator color={colors.white} />
                    ) : (
                      <Text className="m-auto text-neutral-950 dark:text-neutral-100 text-sm">
                        Set as primary
                      </Text>
                    )}
                  </TouchableHighlight>
                )}
            {email.verification.status !== "verified" && (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor={colors.neutral[700]}
                className="p-2 rounded-lg"
                onPress={() => verifyEmail(email.id)}
              >
                <Text className="m-auto text-neutral-950 dark:text-neutral-100 text-sm">
                  Verify
                </Text>
              </TouchableHighlight>
            )}
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={colors.neutral[700]}
              className="p-2 rounded-lg"
              onPress={() => deleteEmail(email.id)}
            >
              {isDeleting ? (
                <ActivityIndicator color={colors.red[600]} />
              ) : (
                <Text className="m-auto text-red-600 text-sm">Delete</Text>
              )}
            </TouchableHighlight>
          </View>
        )}
      </View>
    </>
  );
}
