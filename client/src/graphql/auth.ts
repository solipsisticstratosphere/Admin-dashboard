import { gql } from "@apollo/client";

export const VERIFY_ADMIN_PASSWORD = gql`
  mutation VerifyAdminPassword($input: VerifyAdminPasswordInput!) {
    verifyAdminPassword(input: $input) {
      success
      message
    }
  }
`;
