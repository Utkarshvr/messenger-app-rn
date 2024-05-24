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
