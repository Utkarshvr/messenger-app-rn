import { EmailAddressResource } from "@clerk/types";

export function SortEmailAddresses(
  emailAddresses: EmailAddressResource[],
  primaryEmailAddress: EmailAddressResource
) {
  const EmailsWithoutPrimary =
    emailAddresses.filter((e) => e.id !== primaryEmailAddress?.id) || [];

  const expiryDateLowestToBiggest = EmailsWithoutPrimary.sort((a, b) => {
    const dateA = a.verification.expireAt
      ? new Date(a.verification.expireAt)
      : null;
    const dateB = b.verification.expireAt
      ? new Date(b.verification.expireAt)
      : null;

    if (dateA === null && dateB === null) {
      return 0;
    } else if (dateA === null) {
      return 1;
    } else if (dateB === null) {
      return -1;
    } else {
      // Perform comparison only if both dates are valid
      return dateA.getTime() - dateB.getTime();
    }
  });

  const sortedEmails = [primaryEmailAddress, ...expiryDateLowestToBiggest];

  return sortedEmails;
}

export function formatDateEnGB(dateStr: string) {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-GB", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatMsgDate(inputDate: Date) {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get yesterday's date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Format the input date
  if (inputDate.toDateString() === today.toDateString()) {
    return (
      "Today, " +
      inputDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else if (inputDate.toDateString() === yesterday.toDateString()) {
    return (
      "Yesterday, " +
      inputDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else if (
    inputDate >=
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    )
  ) {
    return (
      inputDate.toLocaleDateString("en-US", { weekday: "short" }) +
      ", " +
      inputDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else if (inputDate.getFullYear() === today.getFullYear()) {
    return (
      inputDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }) +
      ", " +
      inputDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else {
    return (
      inputDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }) +
      ", " +
      inputDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }
}
