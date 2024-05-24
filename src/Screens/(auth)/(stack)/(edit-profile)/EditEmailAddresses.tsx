import { useEffect, useState } from "react";
import Backdrop from "@/components/Backdrop";
import Badge from "@/components/Badge";
import Divider from "@/components/Divider";
import Modal from "@/components/modal/Modal";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import colors from "tailwindcss/colors";
import EmailEditMenu from "@/components/EmailEditMenu";
import { EmailAddressResource } from "@clerk/types";
import { SortEmailAddresses } from "@/utility/helpers";

export default function EditEmailAddresses() {
  const { user } = useUser();

  const [emailAddress, setEmailAddress] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isCreatingEmail, setIsCreatingEmail] = useState(false);
  const [isEmailVerificationPending, setIsEmailVerificationPending] =
    useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const closeModal = () => setError(null);

  const validateEmail = (text: string) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(text);
  };

  const onAddEmail = async () => {
    const isEmailValid = validateEmail(emailAddress);

    if (!isEmailValid) {
      return setError({
        title: "Invalid Email",
        text: `${emailAddress} is not a valid email id`,
        actions: [{ onPress: closeModal, text: "Try again!" }],
      });
    }

    try {
      setIsCreatingEmail(true);
      const data = await user?.createEmailAddress({ email: emailAddress });
      ToastAndroid.show(`Added ${emailAddress}`, ToastAndroid.SHORT);
      setIsAddingEmail(false);

      try {
        await data?.prepareVerification({ strategy: "email_code" });
        setIsEmailVerificationPending(true);
        setVerificationEmail(emailAddress);
      } catch (err: any) {
        console.log("::prepareVerification::", JSON.stringify(err, null, 2));
        return setError({
          title:
            err.errors[0].message === err.errors[0].longMessage
              ? "Error"
              : err.errors[0].message,
          text: err.errors[0].longMessage,
          actions: [{ onPress: closeModal, text: "Okay" }],
        });
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: closeModal, text: "Okay" }],
      });
    } finally {
      setIsCreatingEmail(false);
    }
  };

  async function verifyCode() {
    try {
      setIsVerifyingCode(true);

      if (user) {
        const thatEmail = user.emailAddresses.find(
          (e) => e.emailAddress === verificationEmail
        );

        await thatEmail?.attemptVerification({
          code: verificationCode,
        });

        ToastAndroid.show(
          `${thatEmail?.emailAddress.toString()} is now verified`,
          ToastAndroid.SHORT
        );

        // Reset many things
        setIsEmailVerificationPending(false);
        setIsAddingEmail(false);

        setEmailAddress("");
        setVerificationCode("");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: closeModal, text: "Okay" }],
      });
    } finally {
      setIsVerifyingCode(false);
    }
  }

  const [menuVisible, setMenuVisible] = useState("");

  const toggleMenu = (emailID: string) => {
    setMenuVisible((prev) => (prev === emailID ? "" : emailID));
  };
  const closeMenu = () => {
    setMenuVisible("");
  };

  const [sortedEmails, setSortedEmails] = useState<EmailAddressResource[]>([]);

  useEffect(() => {
    if (user?.emailAddresses) {
      setSortedEmails(
        SortEmailAddresses(user?.emailAddresses, user?.primaryEmailAddress!)
      );
    }
  }, [user?.emailAddresses]);

  return (
    <>
      <View className="flex-1 bg-neutral-100 dark:bg-neutral-950">
        <View className="p-4">
          {sortedEmails.map((email) => (
            <View
              key={email.id}
              className="mb-4 w-full flex-row items-center justify-between"
            >
              <View className="flex-row gap-1 items-center justify-between">
                <Text className="text-base text-neutral-200 m-auto">
                  {email.emailAddress}
                </Text>
                {email.emailAddress ===
                  user?.primaryEmailAddress?.emailAddress && (
                  <Badge text="Primary" dark />
                )}
                {email.verification.status !== "verified" && (
                  <Badge text="Unverified" dark />
                )}
              </View>
              <EmailEditMenu
                email={email}
                primaryEmailAddress={
                  user?.primaryEmailAddress?.emailAddress || ""
                }
                menuVisible={menuVisible}
                toggleMenu={toggleMenu}
                closeMenu={closeMenu}
                error={error}
                setError={setError}
                setIsEmailVerificationPending={setIsEmailVerificationPending}
                setVerificationEmail={setVerificationEmail}
              />
            </View>
          ))}
        </View>

        <Divider />

        {!isAddingEmail && !isEmailVerificationPending && (
          <View className="p-4">
            <TouchableHighlight
              className="w-fit p-2 flex-row items-center rounded-md"
              activeOpacity={0.6}
              underlayColor={colors.neutral[900]}
              onPress={() => setIsAddingEmail(true)}
            >
              <View className="w-fit flex-row items-center justify-center gap-2">
                <MaterialCommunityIcons
                  className="mt-auto"
                  name="email-plus-outline"
                  size={18}
                  color={colors.neutral[100]}
                />
                <Text className="m-auto w-max text-neutral-950 dark:text-neutral-100 text-base">
                  Add email address
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        )}

        {isAddingEmail && (
          <View className="p-4 gap-2">
            <View>
              <Text className="text-neutral-950 dark:text-neutral-100 text-base font-bold">
                Add email address
              </Text>
              <Text className="text-neutral-700 dark:text-neutral-400 text-xs">
                An email containing a verification link will be sent to this
                email address.
              </Text>
            </View>

            <View>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                className="text-base border-b border-neutral-200 text-neutral-100 w-full rounded-lg"
                placeholderTextColor={colors.neutral[400]}
                value={emailAddress || ""}
                placeholder="abc@domain.com"
                onChangeText={(txt) => setEmailAddress(txt)}
              />
            </View>

            <View className="flex-row gap-2 justify-end items-center">
              <TouchableHighlight
                className="w-fit p-2 flex-row items-center rounded-md"
                activeOpacity={0.6}
                underlayColor={colors.neutral[900]}
                onPress={() => setIsAddingEmail(false)}
              >
                <Text className="m-auto w-max text-neutral-700 dark:text-neutral-300 text-sm">
                  Cancel
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                className="w-fit p-2 flex-row items-center rounded-md bg-sky-600"
                activeOpacity={0.6}
                underlayColor={colors.sky[900]}
                onPress={onAddEmail}
              >
                {isCreatingEmail ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text className="m-auto w-max text-neutral-800 dark:text-neutral-200 text-sm font-bold">
                    Add
                  </Text>
                )}
              </TouchableHighlight>
            </View>
          </View>
        )}

        {isEmailVerificationPending && (
          <View className="p-4 gap-2">
            <Text className="text-neutral-700 dark:text-neutral-400 text-xs">
              A verification code has been sent to {verificationEmail}, check!
            </Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="number-pad"
              className="text-base border-b border-neutral-200 text-neutral-100 w-full rounded-lg"
              placeholderTextColor={colors.neutral[400]}
              value={verificationCode || ""}
              placeholder="Code"
              onChangeText={(txt) => setVerificationCode(txt)}
            />
            <View className="flex-row gap-2 justify-end items-center">
              <TouchableHighlight
                className="w-fit p-2 flex-row items-center rounded-md"
                activeOpacity={0.6}
                underlayColor={colors.neutral[900]}
                onPress={() => setIsEmailVerificationPending(false)}
              >
                <Text className="m-auto w-max text-neutral-700 dark:text-neutral-300 text-sm">
                  Cancel
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                className={`w-fit p-2 flex-row items-center rounded-md  ${
                  verificationCode.length !== 6 ? "bg-sky-400" : "bg-sky-600"
                }`}
                activeOpacity={0.6}
                underlayColor={colors.sky[900]}
                disabled={verificationCode.length !== 6}
                onPress={() => verifyCode()}
              >
                {isVerifyingCode ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text className="m-auto w-max text-neutral-800 dark:text-neutral-200 text-sm font-bold">
                    Verify
                  </Text>
                )}
              </TouchableHighlight>
            </View>
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
