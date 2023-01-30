import { businessDocs } from "./repository/business-docs.repository.js";
import { PaymentInfo} from "./repository/payment-info.repository.js";
import { userInfo } from "./repository/user-info.repository.js";

export const userInfoRepository = new userInfo()
export const paymentInfoRespository = new PaymentInfo()
export const businessDocsRepository = new businessDocs()