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
