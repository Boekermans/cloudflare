export default {
  async email(message, env, ctx) {
const forwardList = {
  "address@domain.tld": [
    "recipient1@forward.to",
    "recipient2@forward.to",
  ],
  "another-address@domain.tld": "recipient@forward.to",
};

    const extractAddress = (email) => {
      const [localPart, domain] = email.split("@");
      const cleanedLocalPart = localPart.split("+")[0];
      return `${cleanedLocalPart}@${domain}`;
    };

    const isAllowed = (email) => {
      const cleanedEmail = extractAddress(email);
      return Object.keys(forwardList).includes(cleanedEmail);
    };

    const forward = async (addresses) => {
      const addressArray = Array.isArray(addresses) ? addresses : [addresses];
      await Promise.all(addressArray.map(address => message.forward(address)));
    };

    if (!isAllowed(message.to)) {
      message.setReject(`Address \`${message.to}\` doesn't exist`);
      return;
    }

    const addresses = forwardList[extractAddress(message.to)];
    await forward(addresses);
  },
};

