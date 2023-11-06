export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters from the phone number
  const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

  // Check if the numeric phone number starts with "0", "+62", or "62"
  if (numericPhoneNumber.startsWith("0")) {
    // Replace the leading "0" with "62"
    return "62" + numericPhoneNumber.substring(1);
  } else if (numericPhoneNumber.startsWith("+62")) {
    // Remove the plus sign and keep the rest
    return "62" + numericPhoneNumber.substring(3);
  } else if (numericPhoneNumber.startsWith("62")) {
    return numericPhoneNumber;
  } else {
    // If it doesn't match any known format, return the original number
    return numericPhoneNumber;
  }
};
