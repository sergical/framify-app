import { PinataFDK } from "pinata-fdk";
export const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.PINATA_GATEWAY as string,
});
